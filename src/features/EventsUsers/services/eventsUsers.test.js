import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTopSellingEvents } from '../services/eventsUsers';

const mockEventos = [
  { id: 1, nombre: 'Evento A', imagen_url: 'https://img.com/a.jpg', fecha: '2026-05-01', hora: '10:00', lugar: 'Lugar A', total_vendido: '5', Ciudad: null, Categoria: null },
  { id: 2, nombre: 'Evento B', imagen_url: 'https://img.com/b.jpg', fecha: '2026-05-02', hora: '11:00', lugar: 'Lugar B', total_vendido: '20', Ciudad: null, Categoria: null },
  { id: 3, nombre: 'Evento C', imagen_url: 'https://img.com/c.jpg', fecha: '2026-05-03', hora: '12:00', lugar: 'Lugar C', total_vendido: '15', Ciudad: null, Categoria: null },
  { id: 4, nombre: 'Evento D', imagen_url: 'https://img.com/d.jpg', fecha: '2026-05-04', hora: '13:00', lugar: 'Lugar D', total_vendido: '0', Ciudad: null, Categoria: null },
];

beforeEach(() => {
  vi.clearAllMocks();
  globalThis.fetch = vi.fn((url) => {
    if (url.includes('/reportes/top-most-sold-events')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEventos),
      });
    }

    return Promise.resolve({ ok: false });
  });
});

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

describe('getTopSellingEvents - Endpoint de reporte', () => {
  it('debe usar el endpoint /reportes/top-most-sold-events', async () => {
    await getTopSellingEvents();

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/reportes/top-most-sold-events')
    );
  });
});

describe('getTopSellingEvents - Límite de 3 eventos', () => {
  it('debe retornar máximo 3 eventos aunque el API envíe más', async () => {
    const result = await getTopSellingEvents();
    expect(result).toHaveLength(3);
  });
});

describe('getTopSellingEvents - Menos de 3 eventos', () => {
  it('debe retornar 2 eventos cuando el backend solo envía 2', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEventos.slice(0, 2)),
      })
    );

    const result = await getTopSellingEvents();
    expect(result).toHaveLength(2);
  });
});