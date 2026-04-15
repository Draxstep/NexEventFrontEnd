export const ACTIVE_EVENT_STATUS = "Activo";

const normalizeEventStatus = (status) =>
  typeof status === "string" ? status.trim().toLowerCase() : "";

export const isActiveEventStatus = (status) =>
  normalizeEventStatus(status) === ACTIVE_EVENT_STATUS.toLowerCase();

export const isHistoricalEventStatus = (status) => {
  const normalized = normalizeEventStatus(status);
  if (!normalized) return false;
  return normalized !== ACTIVE_EVENT_STATUS.toLowerCase();
};
