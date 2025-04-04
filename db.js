// db.js - Firestore database setup and utility functions
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} = require('firebase/firestore');
require('dotenv').config();

// Firebase configuration - store these in your .env file
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

// Database utility functions for your barbershop app
const dbService = {
  // ===== Appointment functions =====
  
  // Get all appointments
  getAllAppointments: async () => {
    try {
      const appointmentsCol = collection(db, 'appointments');
      const snapshot = await getDocs(appointmentsCol);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw error;
    }
  },
  
  // Get appointment by ID
  getAppointmentById: async (appointmentId) => {
    try {
      const docRef = doc(db, 'appointments', appointmentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting appointment ${appointmentId}:`, error);
      throw error;
    }
  },
  
  // Create new appointment
  createAppointment: async (appointmentData) => {
    try {
      // Add timestamp
      const dataWithTimestamp = {
        ...appointmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'appointments'), dataWithTimestamp);
      return {
        id: docRef.id,
        ...dataWithTimestamp
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
  
  // Update appointment
  updateAppointment: async (appointmentId, appointmentData) => {
    try {
      // Add updated timestamp
      const dataWithTimestamp = {
        ...appointmentData,
        updatedAt: serverTimestamp()
      };
      
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, dataWithTimestamp);
      
      // Get the updated document
      const updatedDoc = await getDoc(appointmentRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error(`Error updating appointment ${appointmentId}:`, error);
      throw error;
    }
  },
  
  // Delete appointment
  deleteAppointment: async (appointmentId) => {
    try {
      await deleteDoc(doc(db, 'appointments', appointmentId));
      return { success: true, id: appointmentId };
    } catch (error) {
      console.error(`Error deleting appointment ${appointmentId}:`, error);
      throw error;
    }
  },
  
  // Get appointments by client ID
  getAppointmentsByClient: async (clientId) => {
    try {
      const appointmentsCol = collection(db, 'appointments');
      const q = query(appointmentsCol, where('clientId', '==', clientId), orderBy('appointmentDate', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting appointments for client ${clientId}:`, error);
      throw error;
    }
  },
  
  // Get appointments by barber ID
  getAppointmentsByBarber: async (barberId) => {
    try {
      const appointmentsCol = collection(db, 'appointments');
      const q = query(appointmentsCol, where('barberId', '==', barberId), orderBy('appointmentDate', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting appointments for barber ${barberId}:`, error);
      throw error;
    }
  },
  
  // Get appointments for a specific date
  getAppointmentsByDate: async (date) => {
    try {
      // Convert date to Firestore timestamp format (start and end of day)
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);
      
      const appointmentsCol = collection(db, 'appointments');
      const q = query(
        appointmentsCol, 
        where('appointmentDate', '>=', startTimestamp),
        where('appointmentDate', '<=', endTimestamp),
        orderBy('appointmentDate')
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting appointments for date ${date}:`, error);
      throw error;
    }
  },
  
  // ===== Client functions =====
  
  // Get all clients
  getAllClients: async () => {
    try {
      const clientsCol = collection(db, 'clients');
      const snapshot = await getDocs(clientsCol);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting clients:', error);
      throw error;
    }
  },
  
  // Get client by ID
  getClientById: async (clientId) => {
    try {
      const docRef = doc(db, 'clients', clientId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting client ${clientId}:`, error);
      throw error;
    }
  },
  
  // Create new client
  createClient: async (clientData) => {
    try {
      // Add timestamp
      const dataWithTimestamp = {
        ...clientData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'clients'), dataWithTimestamp);
      return {
        id: docRef.id,
        ...dataWithTimestamp
      };
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },
  
  // Update client
  updateClient: async (clientId, clientData) => {
    try {
      // Add updated timestamp
      const dataWithTimestamp = {
        ...clientData,
        updatedAt: serverTimestamp()
      };
      
      const clientRef = doc(db, 'clients', clientId);
      await updateDoc(clientRef, dataWithTimestamp);
      
      // Get the updated document
      const updatedDoc = await getDoc(clientRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error(`Error updating client ${clientId}:`, error);
      throw error;
    }
  },
  
  // Delete client
  deleteClient: async (clientId) => {
    try {
      await deleteDoc(doc(db, 'clients', clientId));
      return { success: true, id: clientId };
    } catch (error) {
      console.error(`Error deleting client ${clientId}:`, error);
      throw error;
    }
  },
  
  // Search clients by name
  searchClientsByName: async (name) => {
    try {
      // Note: Firestore doesn't support direct string contains queries
      // This is a simple implementation. For more advanced search,
      // consider using Firebase extensions like Algolia or Elastic App Search
      
      const clientsCol = collection(db, 'clients');
      // Get all clients and filter on client side
      const snapshot = await getDocs(clientsCol);
      
      const searchTermLower = name.toLowerCase();
      return snapshot.docs
        .filter(doc => {
          const data = doc.data();
          const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
          return fullName.includes(searchTermLower);
        })
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
    } catch (error) {
      console.error(`Error searching clients by name ${name}:`, error);
      throw error;
    }
  },
  
  // ===== Barber functions =====
  
  // Get all barbers
  getAllBarbers: async () => {
    try {
      const barbersCol = collection(db, 'barbers');
      const snapshot = await getDocs(barbersCol);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting barbers:', error);
      throw error;
    }
  },
  
  // Get barber by ID
  getBarberById: async (barberId) => {
    try {
      const docRef = doc(db, 'barbers', barberId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting barber ${barberId}:`, error);
      throw error;
    }
  },
  
  // Create new barber
  createBarber: async (barberData) => {
    try {
      // Add timestamp
      const dataWithTimestamp = {
        ...barberData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'barbers'), dataWithTimestamp);
      return {
        id: docRef.id,
        ...dataWithTimestamp
      };
    } catch (error) {
      console.error('Error creating barber:', error);
      throw error;
    }
  },
  
  // Update barber
  updateBarber: async (barberId, barberData) => {
    try {
      // Add updated timestamp
      const dataWithTimestamp = {
        ...barberData,
        updatedAt: serverTimestamp()
      };
      
      const barberRef = doc(db, 'barbers', barberId);
      await updateDoc(barberRef, dataWithTimestamp);
      
      // Get the updated document
      const updatedDoc = await getDoc(barberRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error(`Error updating barber ${barberId}:`, error);
      throw error;
    }
  },
  
  // Delete barber
  deleteBarber: async (barberId) => {
    try {
      await deleteDoc(doc(db, 'barbers', barberId));
      return { success: true, id: barberId };
    } catch (error) {
      console.error(`Error deleting barber ${barberId}:`, error);
      throw error;
    }
  },
  
  // ===== Service functions =====
  
  // Get all services
  getAllServices: async () => {
    try {
      const servicesCol = collection(db, 'services');
      const snapshot = await getDocs(servicesCol);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting services:', error);
      throw error;
    }
  },
  
  // Get service by ID
  getServiceById: async (serviceId) => {
    try {
      const docRef = doc(db, 'services', serviceId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting service ${serviceId}:`, error);
      throw error;
    }
  },
  
  // Create new service
  createService: async (serviceData) => {
    try {
      // Add timestamp
      const dataWithTimestamp = {
        ...serviceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'services'), dataWithTimestamp);
      return {
        id: docRef.id,
        ...dataWithTimestamp
      };
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },
  
  // Update service
  updateService: async (serviceId, serviceData) => {
    try {
      // Add updated timestamp
      const dataWithTimestamp = {
        ...serviceData,
        updatedAt: serverTimestamp()
      };
      
      const serviceRef = doc(db, 'services', serviceId);
      await updateDoc(serviceRef, dataWithTimestamp);
      
      // Get the updated document
      const updatedDoc = await getDoc(serviceRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error(`Error updating service ${serviceId}:`, error);
      throw error;
    }
  },
  
  // Delete service
  deleteService: async (serviceId) => {
    try {
      await deleteDoc(doc(db, 'services', serviceId));
      return { success: true, id: serviceId };
    } catch (error) {
      console.error(`Error deleting service ${serviceId}:`, error);
      throw error;
    }
  }
};

module.exports = dbService;