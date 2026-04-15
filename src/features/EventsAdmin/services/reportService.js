import { getAllEvents } from "./eventService";
import { getSalesReportByEvent } from "./salesReportService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const getEventsByPopularity = async () => {
  const response = await fetch(`${API_URL}/reportes/rank`);
  const result = await safeJson(response);

  if (!response.ok) {
    throw new Error(
      result?.error ||
      result?.message ||
      "Error al obtener ranking de eventos por interés."
    );
  }

  if (!Array.isArray(result)) {
    return [];
  }

  return result.map((event) => ({
    ...event,
    cantidadInteresados: Number(event?.total_intereses) || 0,
  }));
};

export const getTopMostSoldEvents = async () => {
  const events = await getAllEvents();
  if (!Array.isArray(events) || events.length === 0) {
    return [];
  }

  const totalsByEvent = await Promise.allSettled(
    events.map(async (event) => {
      const report = await getSalesReportByEvent(event.id);
      const ventas = Array.isArray(report?.ventas) ? report.ventas : [];

      const totalEntradasVendidas = ventas.reduce(
        (acc, item) => acc + (Number(item?.cantidad_vendida) || 0),
        0
      );
      const totalGanancia = ventas.reduce(
        (acc, item) => acc + (Number.parseFloat(item?.ganancia) || 0),
        0
      );

      return {
        ...event,
        totalEntradasVendidas,
        totalGanancia,
      };
    })
  );

  return totalsByEvent
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value)
    .sort((a, b) => {
      if (b.totalEntradasVendidas !== a.totalEntradasVendidas) {
        return b.totalEntradasVendidas - a.totalEntradasVendidas;
      }
      return b.totalGanancia - a.totalGanancia;
    });
};