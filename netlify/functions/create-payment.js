// netlify/functions/create-payment.js
exports.handler = async function(event, context) {
    // Обработка CORS preflight запросов
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }
    
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }
    
    try {
        const body = JSON.parse(event.body);
        const { paymentData, idempotenceKey } = body;
        
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
        
        // логируем запрос для отладки
        console.log('YooKassa create call', JSON.stringify(paymentData));
        const response = await fetch('https://api.yookassa.ru/v3/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'Idempotence-Key': idempotenceKey || Date.now().toString()
            },
            body: JSON.stringify(paymentData)
        });
        
        // если API вернул ошибку 400/401 и пустой JSON, залогируем текст
        const text = await response.text();
        if (!response.ok) {
            console.error('YooKassa API error', response.status, text);
            return {
                statusCode: response.status,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'YooKassa error', details: text || 'no body' })
            };
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse YooKassa response:', e, 'text:', text);
            return {
                statusCode: response.status,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Failed to parse payment service response',
                    status: response.status,
                    raw: text
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
        console.error('Error creating payment:', error);
        
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