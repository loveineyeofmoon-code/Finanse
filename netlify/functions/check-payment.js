// netlify/functions/check-payment.js
exports.handler = async function(event, context) {
    // Обработка CORS preflight запросов
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, OPTIONS'
            },
            body: ''
        };
    }
    
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }
    
    try {
        const { paymentId } = event.queryStringParameters;
        
        if (!paymentId) {
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'paymentId is required' })
            };
        }
        
        const YOOMONEY_SHOP_ID = process.env.YOOKASSA_SHOP_ID;
        const YOOMONEY_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;
        
        if (!YOOMONEY_SHOP_ID || !YOOMONEY_SECRET_KEY) {
            return {
                statusCode: 500,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Server configuration error',
                    message: 'Missing YooKassa credentials'
                })
            };
        }
        
        const auth = Buffer.from(`${YOOMONEY_SHOP_ID}:${YOOMONEY_SECRET_KEY}`).toString('base64');
        
        const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            }
        });
        
        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error('Failed to parse YooKassa response:', e);
            return {
                statusCode: response.status,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Failed to parse payment service response',
                    status: response.status
                })
            };
        }
        
        return {
            statusCode: response.status,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        
    } catch (error) {
        console.error('Error checking payment:', error);
        
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: 'Internal Server Error',
                message: error.message 
            })
        };
    }
};