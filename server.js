// server.js - Express server with direct Firestore integration
const express = require('express');
const cors = require('cors');
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

// Firebase configuration - make sure these are in your .env file
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
console.log('Initializing Firebase...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log('Firestore initialized');

// Database service methods
const dbService = {
  // ===== Appointment functions =====
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
  
  deleteAppointment: async (appointmentId) => {
    try {
      await deleteDoc(doc(db, 'appointments', appointmentId));
      return { success: true, id: appointmentId };
    } catch (error) {
      console.error(`Error deleting appointment ${appointmentId}:`, error);
      throw error;
    }
  },
  
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
  
  deleteClient: async (clientId) => {
    try {
      await deleteDoc(doc(db, 'clients', clientId));
      return { success: true, id: clientId };
    } catch (error) {
      console.error(`Error deleting client ${clientId}:`, error);
      throw error;
    }
  },
  
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

// Initialize express app
const expressApp = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Middleware
expressApp.use(cors());
expressApp.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple logging middleware
expressApp.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Handle all other routes by serving index.html
expressApp.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });

// Routes

// === Appointment Routes ===
expressApp.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await dbService.getAllAppointments();
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

expressApp.get('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await dbService.getAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    console.error(`Error fetching appointment ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

expressApp.post('/api/appointments', async (req, res) => {
  try {
    // Basic validation
    const { clientId, barberId, serviceId, appointmentDate } = req.body;
    if (!clientId || !barberId || !serviceId || !appointmentDate) {
      return res.status(400).json({ 
        error: 'Missing required fields: clientId, barberId, serviceId, appointmentDate' 
      });
    }
    
    const newAppointment = await dbService.createAppointment(req.body);
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

expressApp.put('/api/appointments/:id', async (req, res) => {
  try {
    const updatedAppointment = await dbService.updateAppointment(req.params.id, req.body);
    res.json(updatedAppointment);
  } catch (error) {
    console.error(`Error updating appointment ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

expressApp.delete('/api/appointments/:id', async (req, res) => {
  try {
    await dbService.deleteAppointment(req.params.id);
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error(`Error deleting appointment ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// Get appointments by client
expressApp.get('/api/clients/:clientId/appointments', async (req, res) => {
  try {
    const appointments = await dbService.getAppointmentsByClient(req.params.clientId);
    res.json(appointments);
  } catch (error) {
    console.error(`Error fetching appointments for client ${req.params.clientId}:`, error);
    res.status(500).json({ error: 'Failed to fetch client appointments' });
  }
});

// Get appointments by barber
expressApp.get('/api/barbers/:barberId/appointments', async (req, res) => {
  try {
    const appointments = await dbService.getAppointmentsByBarber(req.params.barberId);
    res.json(appointments);
  } catch (error) {
    console.error(`Error fetching appointments for barber ${req.params.barberId}:`, error);
    res.status(500).json({ error: 'Failed to fetch barber appointments' });
  }
});

// Get appointments by date
expressApp.get('/api/appointments/date/:date', async (req, res) => {
  try {
    const appointments = await dbService.getAppointmentsByDate(req.params.date);
    res.json(appointments);
  } catch (error) {
    console.error(`Error fetching appointments for date ${req.params.date}:`, error);
    res.status(500).json({ error: 'Failed to fetch appointments by date' });
  }
});

// === Client Routes ===
expressApp.get('/api/clients', async (req, res) => {
  try {
    const clients = await dbService.getAllClients();
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

expressApp.get('/api/clients/:id', async (req, res) => {
  try {
    const client = await dbService.getClientById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error(`Error fetching client ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

expressApp.post('/api/clients', async (req, res) => {
  try {
    // Basic validation
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields: firstName, lastName, email' 
      });
    }
    
    const newClient = await dbService.createClient(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

expressApp.put('/api/clients/:id', async (req, res) => {
  try {
    const updatedClient = await dbService.updateClient(req.params.id, req.body);
    res.json(updatedClient);
  } catch (error) {
    console.error(`Error updating client ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

expressApp.delete('/api/clients/:id', async (req, res) => {
  try {
    await dbService.deleteClient(req.params.id);
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error(`Error deleting client ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// Search clients by name
expressApp.get('/api/clients/search/:name', async (req, res) => {
  try {
    const clients = await dbService.searchClientsByName(req.params.name);
    res.json(clients);
  } catch (error) {
    console.error(`Error searching clients by name ${req.params.name}:`, error);
    res.status(500).json({ error: 'Failed to search clients' });
  }
});

// === Barber Routes ===
expressApp.get('/api/barbers', async (req, res) => {
  try {
    const barbers = await dbService.getAllBarbers();
    res.json(barbers);
  } catch (error) {
    console.error('Error fetching barbers:', error);
    res.status(500).json({ error: 'Failed to fetch barbers' });
  }
});

expressApp.get('/api/barbers/:id', async (req, res) => {
  try {
    const barber = await dbService.getBarberById(req.params.id);
    if (!barber) {
      return res.status(404).json({ error: 'Barber not found' });
    }
    res.json(barber);
  } catch (error) {
    console.error(`Error fetching barber ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch barber' });
  }
});

expressApp.post('/api/barbers', async (req, res) => {
  try {
    // Basic validation
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Missing required fields: firstName, lastName' 
      });
    }
    
    const newBarber = await dbService.createBarber(req.body);
    res.status(201).json(newBarber);
  } catch (error) {
    console.error('Error creating barber:', error);
    res.status(500).json({ error: 'Failed to create barber' });
  }
});

expressApp.put('/api/barbers/:id', async (req, res) => {
  try {
    const updatedBarber = await dbService.updateBarber(req.params.id, req.body);
    res.json(updatedBarber);
  } catch (error) {
    console.error(`Error updating barber ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update barber' });
  }
});

expressApp.delete('/api/barbers/:id', async (req, res) => {
  try {
    await dbService.deleteBarber(req.params.id);
    res.json({ success: true, message: 'Barber deleted successfully' });
  } catch (error) {
    console.error(`Error deleting barber ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete barber' });
  }
});

// === Service Routes ===
expressApp.get('/api/services', async (req, res) => {
  try {
    const services = await dbService.getAllServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

expressApp.get('/api/services/:id', async (req, res) => {
  try {
    const service = await dbService.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error(`Error fetching service ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

expressApp.post('/api/services', async (req, res) => {
  try {
    // Basic validation
    const { name, price, duration } = req.body;
    if (!name || !price || !duration) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, price, duration' 
      });
    }
    
    const newService = await dbService.createService(req.body);
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

expressApp.put('/api/services/:id', async (req, res) => {
  try {
    const updatedService = await dbService.updateService(req.params.id, req.body);
    res.json(updatedService);
  } catch (error) {
    console.error(`Error updating service ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

expressApp.delete('/api/services/:id', async (req, res) => {
  try {
    await dbService.deleteService(req.params.id);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error(`Error deleting service ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Health check endpoint
expressApp.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
expressApp.get('/', (req, res) => {
  res.json({ 
    message: 'AceOfFades Barbershop API',
    version: '1.0.0',
    endpoints: {
      appointments: '/api/appointments',
      clients: '/api/clients',
      barbers: '/api/barbers',
      services: '/api/services'
    }
  });
});

// Error handling middleware
expressApp.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

// Start the server
expressApp.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`http://localhost:${port}`);
});

module.exports = expressApp; // Export for testing
