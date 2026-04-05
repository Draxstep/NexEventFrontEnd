const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const getEventsByPopularity = async () => {
    const response = await fetch(`${API_URL}/reportes/rank`);
    if (!response.ok) throw new Error("Failed to fetch events by popularity");
    return response.json();
}

export const getTopMostSoldEvents = async () => {
    const response = await fetch(`${API_URL}/reportes/top-most-sold-events`);
    if (!response.ok) throw new Error ("Failed to fetch events by popularity");
    return response.json();
}