// firebase-firestore-setup.js
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc,
  query,
  where,
  doc,
  getDoc
} = require('firebase/firestore');
require('dotenv').config();

async function testFirestoreConnection() {
  console.log('🔍 Firebase Firestore Connection Test');

  // Your Firebase configuration
  // Replace with your actual Firebase project config
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
    appId: process.env.FIREBASE_APP_ID || "YOUR_APP_ID"
  };

  try {
    // Initialize Firebase
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    
    // Initialize Firestore
    console.log('Connecting to Firestore...');
    const db = getFirestore(app);
    
    console.log('✅ Successfully connected to Firestore!');
    
    // Test reading a collection
    console.log('\n📋 Testing collection access:');
    try {
      // Replace 'test' with your actual collection name
      const testCollection = collection(db, 'test');
      const snapshot = await getDocs(testCollection);
      
      console.log(`Collection 'test' has ${snapshot.size} documents.`);
      
      if (snapshot.size > 0) {
        console.log('Sample documents:');
        snapshot.forEach((doc) => {
          console.log(` - Document ID: ${doc.id}`);
          console.log(`   Data: ${JSON.stringify(doc.data())}`);
        });
      } else {
        console.log('Collection is empty. Testing document creation...');
        
        // Test creating a document
        try {
          const docRef = await addDoc(collection(db, 'test'), {
            name: 'Test Document',
            created: new Date(),
            description: 'This is a test document created by the connection test script'
          });
          
          console.log('✅ Created new test document with ID:', docRef.id);
          
          // Verify document was created
          const newDocRef = doc(db, 'test', docRef.id);
          const newDocSnap = await getDoc(newDocRef);
          
          if (newDocSnap.exists()) {
            console.log('✅ Successfully verified document creation:');
            console.log(`   Data: ${JSON.stringify(newDocSnap.data())}`);
          }
        } catch (createError) {
          console.error('❌ Failed to create test document:', createError.message);
        }
      }
    } catch (readError) {
      console.error('❌ Failed to read collection:', readError.message);
      
      if (readError.code === 'permission-denied') {
        console.error('\n🔐 Permission Error:');
        console.error('1. Check your Firebase security rules');
        console.error('2. Make sure your API key and project settings are correct');
      }
    }
    
    console.log('\n✅ Firestore connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.code) {
      console.error('Error code:', error.code);
      
      if (error.code === 'auth/invalid-api-key') {
        console.error('\n🔑 Invalid API Key:');
        console.error('1. Check your Firebase API key');
        console.error('2. Make sure your .env file is set up correctly');
      } else if (error.code === 'auth/network-request-failed') {
        console.error('\n🌐 Network Error:');
        console.error('1. Check your internet connection');
        console.error('2. Verify firewall settings are not blocking Firebase');
      }
    }
  }
}

testFirestoreConnection().catch(console.error);