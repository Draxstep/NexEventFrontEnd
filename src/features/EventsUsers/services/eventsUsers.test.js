import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTopSellingEvents } from '../services/eventsUsers';

// =============================================================
// Mock global de fetch para simular respuestas del backend
// =============================================================
const mockEventos = [
  { id: 1, nombre: 'Evento A', imagen_url: 'https://img.com/a.jpg', descripcion: 'Desc A', fecha: '2026-05-01', hora: '10:00', lugar: 'Lugar A', estado: true, Ciudad: null, Categoria: null },
  { id: 2, nombre: 'Evento B', imagen_url: 'https://img.com/b.jpg', descripcion: 'Desc B', fecha: '2026-05-02', hora: '11:00', lugar: 'Lugar B', estado: true, Ciudad: null, Categoria: null },
  { id: 3, nombre: 'Evento C', imagen_url: 'https://img.com/c.jpg', descripcion: 'Desc C', fecha: '2026-05-03', hora: '12:00', lugar: 'Lugar C', estado: true, Ciudad: null, Categoria: null },
  { id: 4, nombre: 'Evento D', imagen_url: 'https://img.com/d.jpg', descripcion: 'Desc D', fecha: '2026-05-04', hora: '13:00', lugar: 'Lugar D', estado: true, Ciudad: null, Categoria: null },
  { id: 5, nombre: 'Evento E', imagen_url: 'https://img.com/e.jpg', descripcion: 'Desc E', fecha: '2026-05-05', hora: '14:00', lugar: 'Lugar E', estado: true, Ciudad: null, Categoria: null },
];

// Ventas simuladas por evento (id → cantidad_vendida)
const mockVentas = {
  1: 5,   // Evento A: 5 vendidos
  2: 20,  // Evento B: 20 vendidos — debe ser #1
  3: 15,  // Evento C: 15 vendidos — debe ser #2
  4: 0,
  5: 8,   // Evento E: 8 vendidos — debe ser #3
};

beforeEach(() => {
  // Simulamos fetch para cada llamada que hace getTopSellingEvents
  global.fetch = vi.fn((url) => {
    // Llamada a /eventos/activos
    if (url.includes('/eventos/activos')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEventos),
      });
    }

    // Llamada a /reportes/ventas/evento/:id
    const match = url.match(/\/reportes\/ventas\/evento\/(\d+)/);
    if (match) {
      const id = parseInt(match[1]);
      const cantidad = mockVentas[id] || 0;
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            evento: { id, nombre: `Evento ${id}` },
            ventas: [{ cantidad_vendida: cantidad }],
          }),
      });
    }

    return Promise.resolve({ ok: false });
  });
});

// =============================================================
// TEST 1 — Mapeo: los eventos deben tener imagen_url, no image
// =============================================================
describe('getTopSellingEvents - Mapeo de campos', () => {
  it('debe retornar eventos con el campo imagen_url y no con image', async () => {
    const result = await getTopSellingEvents();

    result.forEach((evento) => {
      // El campo correcto es imagen_url
      expect(evento).toHaveProperty('imagen_url');
      // El campo incorrecto NO debe existir
      expect(evento).not.toHaveProperty('image');
    });
  });
});

// =============================================================
// TEST 2 — Orden: el evento con más ventas debe ir primero
// =============================================================
describe('getTopSellingEvents - Orden por ventas', () => {
  it('debe ordenar los eventos de mayor a menor por cantidad vendida', async () => {
    const result = await getTopSellingEvents();

    // Evento B (20 vendidos) debe ser #1
    expect(result[0].nombre).toBe('Evento B');
    // Evento C (15 vendidos) debe ser #2
    expect(result[1].nombre).toBe('Evento C');
    // Evento E (8 vendidos) debe ser #3
    expect(result[2].nombre).toBe('Evento E');
  });

  it('debe tener el primer evento con más ventas que el segundo', async () => {
    const result = await getTopSellingEvents();
    expect(result[0].totalVendido).toBeGreaterThanOrEqual(result[1].totalVendido);
  });
});

// =============================================================
// TEST 3 — Límite: aunque lleguen 5 eventos, solo retorna 3
// =============================================================
describe('getTopSellingEvents - Límite de 3 eventos', () => {
  it('debe retornar exactamente 3 eventos aunque el API envíe más', async () => {
    const result = await getTopSellingEvents();

    // El mock tiene 5 eventos pero solo deben retornarse 3
    expect(result).toHaveLength(3);
  });
});