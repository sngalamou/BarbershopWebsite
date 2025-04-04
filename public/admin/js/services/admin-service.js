/**
 * Admin Service
 * Handles admin-specific API operations
 */

const adminService = {
    /**
     * Get dashboard summary data
     */
    getDashboardSummary: async function() {
        try {
            return await apiService.get('admin/dashboard');
        } catch (error) {
            console.error('Get Dashboard Summary Error:', error);
            
            // For demo purposes, return mock data
            return {
                counts: {
                    appointmentsToday: 24,
                    activeServices: 6,
                    staffMembers: 3,
                    registeredClients: 142
                },
                recentActivity: [
                    {
                        type: 'new_appointment',
                        title: 'New Appointment',
                        description: 'John Smith booked a Classic Haircut with James Wilson',
                        time: '15 minutes ago'
                    },
                    {
                        type: 'appointment_completed',
                        title: 'Appointment Completed',
                        description: 'Michael Johnson\'s Beard Trim with Robert Johnson was completed',
                        time: '35 minutes ago'
                    },
                    {
                        type: 'new_customer',
                        title: 'New Customer',
                        description: 'David Williams registered an account',
                        time: '1 hour ago'
                    }
                ]
            };
        }
    },
    
    /**
     * Get admin stats for specific date range
     */
    getStats: async function(startDate, endDate) {
        try {
            return await apiService.get(`admin/stats?start=${startDate}&end=${endDate}`);
        } catch (error) {
            console.error('Get Stats Error:', error);
            throw error;
        }
    },
    
    /**
     * Get all appointments
     */
    getAllAppointments: async function(filters = {}) {
        try {
            let endpoint = 'admin/appointments';
            
            // Add query parameters for filters
            if (Object.keys(filters).length > 0) {
                const queryParams = new URLSearchParams();
                
                if (filters.status && filters.status !== 'all') {
                    queryParams.append('status', filters.status);
                }
                
                if (filters.staff && filters.staff !== 'all') {
                    queryParams.append('staff', filters.staff);
                }
                
                if (filters.startDate) {
                    queryParams.append('startDate', filters.startDate);
                }
                
                if (filters.endDate) {
                    queryParams.append('endDate', filters.endDate);
                }
                
                if (filters.search) {
                    queryParams.append('search', filters.search);
                }
                
                if (filters.page) {
                    queryParams.append('page', filters.page);
                }
                
                if (filters.limit) {
                    queryParams.append('limit', filters.limit);
                }
                
                endpoint += `?${queryParams.toString()}`;
            }
            
            return await apiService.get(endpoint);
        } catch (error) {
            console.error('Get All Appointments Error:', error);
            
            // For demo purposes, return mock data
            return {
                appointments: [
                    {
                        _id: '1',
                        client: {
                            name: 'John Smith',
                            email: 'john@example.com',
                            phone: '(555) 123-4567'
                        },
                        service: {
                            _id: '1',
                            name: 'Classic Haircut',
                            duration: 30,
                            price: 25
                        },
                        staff: {
                            _id: '1',
                            name: 'James Wilson'
                        },
                        date: '2025-04-04',
                        time: '10:30 AM',
                        status: 'confirmed',
                        notes: ''
                    },
                    {
                        _id: '2',
                        client: {
                            name: 'Michael Johnson',
                            email: 'michael@example.com',
                            phone: '(555) 234-5678'
                        },
                        service: {
                            _id: '3',
                            name: 'Beard Trim',
                            duration: 15,
                            price: 15
                        },
                        staff: {
                            _id: '3',
                            name: 'Robert Johnson'
                        },
                        date: '2025-04-04',
                        time: '11:00 AM',
                        status: 'scheduled',
                        notes: ''
                    },
                    {
                        _id: '3',
                        client: {
                            name: 'David Williams',
                            email: 'david@example.com',
                            phone: '(555) 345-6789'
                        },
                        service: {
                            _id: '2',
                            name: 'Premium Haircut & Style',
                            duration: 45,
                            price: 35
                        },
                        staff: {
                            _id: '2',
                            name: 'Michael Rodriguez'
                        },
                        date: '2025-04-04',
                        time: '1:30 PM',
                        status: 'confirmed',
                        notes: 'Client requested extra styling time'
                    }
                ],
                totalAppointments: 3,
                totalPages: 1,
                currentPage: 1
            };
        }
    },
    
    /**
     * Create a new appointment
     */
    createAppointment: async function(appointmentData) {
        try {
            return await apiService.post('admin/appointments', appointmentData);
        } catch (error) {
            console.error('Create Appointment Error:', error);
            throw error;
        }
    },
    
    /**
     * Update an appointment
     */
    updateAppointment: async function(id, appointmentData) {
        try {
            return await apiService.put(`admin/appointments/${id}`, appointmentData);
        } catch (error) {
            console.error('Update Appointment Error:', error);
            throw error;
        }
    },
    
    /**
     * Delete an appointment
     */
    deleteAppointment: async function(id) {
        try {
            return await apiService.delete(`admin/appointments/${id}`);
        } catch (error) {
            console.error('Delete Appointment Error:', error);
            throw error;
        }
    },
    
    /**
     * Get appointment status counts
     */
    getAppointmentStatusCounts: async function() {
        try {
            return await apiService.get('admin/appointments/status-counts');
        } catch (error) {
            console.error('Get Appointment Status Counts Error:', error);
            
            // For demo purposes, return mock data
            return {
                scheduled: 15,
                confirmed: 22,
                completed: 134,
                cancelled: 7,
                'no-show': 3
            };
        }
    }
};