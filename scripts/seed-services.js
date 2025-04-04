const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  addDoc,
  serverTimestamp 
} = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample services to seed
const services = [
  {
    name: "Classic Haircut",
    price: 25.00,
    duration: 30,
    description: "Standard haircut for all hair types",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: "Beard Trim",
    price: 15.00,
    duration: 15,
    description: "Precise beard shaping and trimming",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: "Full Grooming Package",
    price: 45.00,
    duration: 60,
    description: "Haircut, beard trim, and hot towel treatment",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

// Function to seed services
async function seedServices() {
  try {
    const servicesCollection = collection(db, 'services');
    
    for (const service of services) {
      const docRef = await addDoc(servicesCollection, service);
      console.log(`Added service: ${service.name} with ID: ${docRef.id}`);
    }
    
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding services:', error);
  }
}

// Run the seeding function
seedServices();