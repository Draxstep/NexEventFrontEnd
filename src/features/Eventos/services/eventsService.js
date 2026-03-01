import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const eventsService = {
    
    getEvents: async () => {
        const res = await axios.get(`${API_URL}/events`, { withCredentials: false, });
        return res.data;
    },

    createEvent: async (formData) => {
        try {
            const res = await axios.post(
                `${API_URL}/events`,
                formData,
                {
                    withCredentials: false,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return res.data;
        } catch (error) {
            console.error('Error creating event:', error);
            console.error('Full error object:', error);
            throw error;
        }
    }
}