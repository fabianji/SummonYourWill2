// Servicio de cliente HTTP para comunicarse con el backend FastAPI.
const API_URL = "http://localhost:8000";

// Maneja respuestas, lanzando error con detalle si el estado no es exitoso.
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "API error");
  }
  return response.json();
};

// ===== Guides =====
export const fetchGuides = () => fetch(`${API_URL}/guides/`).then(handleResponse);
export const fetchGuide = (id) => fetch(`${API_URL}/guides/${id}`).then(handleResponse);
export const createGuide = (data) =>
  fetch(`${API_URL}/guides/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
export const updateGuide = (id, data) =>
  fetch(`${API_URL}/guides/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
export const deleteGuide = (id) => fetch(`${API_URL}/guides/${id}`, { method: "DELETE" });

// ===== Diary =====
export const fetchDiaryEntries = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${API_URL}/diary/?${query}` : `${API_URL}/diary/`;
  return fetch(url).then(handleResponse);
};
export const createDiaryEntry = (data) =>
  fetch(`${API_URL}/diary/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);

// ===== Abilities =====
export const fetchAbilities = () => fetch(`${API_URL}/abilities/`).then(handleResponse);
export const createAbility = (data) =>
  fetch(`${API_URL}/abilities/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);

// ===== Media =====
export const fetchMedia = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${API_URL}/media/?${query}` : `${API_URL}/media/`;
  return fetch(url).then(handleResponse);
};
export const createMedia = (data) =>
  fetch(`${API_URL}/media/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
