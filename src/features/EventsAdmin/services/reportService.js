const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const getEventsByPopularity = async () => {
    const response = await fetch(`${API_URL}/reportes/rank`);
    if (!response.ok) throw new Error("Failed to fetch events by popularity");
    return response.json();
}