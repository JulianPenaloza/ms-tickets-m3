const AREAS_URL = process.env.AREAS_URL || 'http://127.0.0.1:3012';

async function solicitarArea(ruta, authorization) {
  let respuesta;

  try {
    respuesta = await fetch(`${AREAS_URL}${ruta}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: authorization
      },
      signal: AbortSignal.timeout(5000)
    });
  } catch (error) {
    const fallo = new Error('No fue posible comunicarse con ms-areas');
    fallo.status = 503;
    throw fallo;
  }

  if (respuesta.status === 404) return null;

  if (!respuesta.ok) {
    const fallo = new Error('ms-areas no está disponible');
    fallo.status = 503;
    throw fallo;
  }

  try {
    return await respuesta.json();
  } catch (error) {
    const fallo = new Error('ms-areas devolvió una respuesta inválida');
    fallo.status = 503;
    throw fallo;
  }
}

async function obtenerPorId(id, authorization) {
  return solicitarArea(`/areas/${encodeURIComponent(id)}`, authorization);
}

async function obtenerPorIds(ids, authorization) {
  if (!ids.length) return [];

  const lista = [...new Set(ids)].join(',');
  return solicitarArea(`/areas?ids=${encodeURIComponent(lista)}`, authorization);
}

module.exports = { obtenerPorId, obtenerPorIds };
