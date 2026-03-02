// Firebase Admin SDK script to set premium subscription
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, 'firebase-key.json');
try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://finance-78bce.firebaseio.com"
  });
} catch (error) {
  console.error('❌ firebase-key.json not found. Make sure to add it to the root directory.');
  process.exit(1);
}

const db = admin.firestore();

async function setPremiumSubscription(email) {
  try {
    console.log('📍 Initializing Firestore connection...');
    // Find user by email
    const usersRef = db.collection('users');
    console.log('📍 Querying for user...');
    const query = usersRef.where('email', '==', email);
    const snapshot = await query.get();
    console.log(`📍 Found ${snapshot.size} user(s)`);

    if (snapshot.empty) {
      console.error(`❌ User with email "${email}" not found`);
      return;
    }

    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;
    console.log(`📍 User ID: ${userId}`);

    // Set premium subscription (1 year from now)
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);

    console.log('📍 Updating Firestore...');
    await db.collection('users').doc(userId).update({
      subscription: 'premium',
      subscriptionActive: true,
      subscriptionEndDate: subscriptionEndDate.toISOString().split('T')[0],
      subscriptionStartDate: new Date().toISOString().split('T')[0]
    });

    console.log(`✅ Premium subscription set for ${email}`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Expires: ${subscriptionEndDate.toISOString().split('T')[0]}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

const email = process.argv[2] || 'aksenovvvv1804@gmail.com';
const command = process.argv[2];

console.log(`🔍 Command: ${command}`);

async function listAllUsers() {
  try {
    console.log('📋 Listing all users in the database...\n');
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    if (snapshot.empty) {
      console.log('❌ No users found in the database');
      return;
    }
    
    console.log(`Found ${snapshot.size} user(s):\n`);
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Email: ${data.email}`);
      console.log(`Subscription: ${data.subscription}`);
      console.log(`---`);
    });
  } catch (error) {
    console.error('❌ Error listing users:', error.message);
  }
}

// If command is --list, show all users
if (command === '--list') {
  listAllUsers().then(() => process.exit(0));
} else {
  setPremiumSubscription(email);
}
