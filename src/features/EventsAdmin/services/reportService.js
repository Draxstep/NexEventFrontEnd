import { getAllEvents, getEventInterestRanking } from "./eventService";
import { getSalesReportByEvent } from "./salesReportService";

export const getEventsByPopularity = async () => {
  return getEventInterestRanking();
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