const HOST = 'https://treento.onrender.com';

// Token JWT (in memoria)
let TOKEN = null;

// Mappa Leaflet (inizializzata dopo il DOM)
let map;

function setOut(obj) {
  const out = document.getElementById('out');
  out.textContent =
    typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
}

function setToken(token) {
  TOKEN = token;
  document.getElementById('tokenStatus').textContent = TOKEN ? 'set' : 'not set';
}

function getAuthHeaders() {
  if (!TOKEN) return {};
  return { Authorization: `Bearer ${TOKEN}` };
}

async function api(path, { method = 'GET', body, auth = false } = {}) {
  try {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth) Object.assign(headers, getAuthHeaders());

    const res = await fetch(HOST + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    return { status: res.status, data };
  } catch (err) {
    console.error('FETCH ERROR:', err);
    return {
      status: 0,
      data: { message: 'Network error / server unreachable' }
    };
  }
}

// Auth
async function signup() {
  const email = document.getElementById('suEmail').value;
  const password = document.getElementById('suPassword').value;
  const r = await api('/auth/signup', {
    method: 'POST',
    body: { email, password }
  });
  setOut(r);
}

async function login() {
  const email = document.getElementById('liEmail').value;
  const password = document.getElementById('liPassword').value;
  const r = await api('/auth/login', {
    method: 'POST',
    body: { email, password }
  });

  if (r.status === 200 && r.data?.token) {
    setToken(r.data.token);
  }
  setOut(r);
}

function logout() {
  setToken(null);
  setOut('Logged out (token cleared).');
}

async function me() {
  const r = await api('/auth/me', { auth: true });
  setOut(r);
}

// Trees
async function loadTrees() {
  const limit = document.getElementById('treesLimit').value.trim();
  const url = limit ? `/trees?limit=${encodeURIComponent(limit)}` : '/trees';

  const r = await api(url);
  setOut(r);

  const ul = document.getElementById('treesList');
  ul.innerHTML = '';

  if (r.status !== 200 || !Array.isArray(r.data)) return;

  // Lista alberi
  r.data.forEach(tree => {
    const li = document.createElement('li');
    li.style.cursor = 'pointer';

    li.innerHTML = `
      <b>${tree.species}</b><br>
      <small>
        ${tree.scientificName || '—'}<br>
        Lat: ${tree.lat.toFixed(4)}, Lng: ${tree.lng.toFixed(4)}
      </small>
    `;

    li.onclick = () => {
      document.getElementById('selectedTreeId').textContent = tree._id;
    };

    ul.appendChild(li);
  });

  // Se la mappa non è pronta, esco
  if (!map) return;

  // Rimuovo marker precedenti
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });

  // Aggiungo marker
  r.data.forEach(tree => {
    L.marker([tree.lat, tree.lng])
      .addTo(map)
      .bindPopup(`
        <b>${tree.species}</b><br>
        ${tree.scientificName || ''}
      `);
  });
}

async function loadTreeDetail() {
  const id = document.getElementById('selectedTreeId').textContent.trim();
  if (!id || id === '-') return setOut('Select a tree first.');

  const r = await api(`/trees/${encodeURIComponent(id)}`);

  if (r.status === 200 && r.data) {
    setOut({
      id: r.data._id,
      species: r.data.species,
      scientificName: r.data.scientificName,
      latitude: r.data.lat,
      longitude: r.data.lng
    });
  } else {
    setOut(r);
  }
}

// Reports
async function createReport() {
  const title = document.getElementById('repTitle').value;
  const location = document.getElementById('repLocation').value;

  const r = await api('/reports', {
    method: 'POST',
    body: { title, location },
    auth: true
  });
  setOut(r);
}

async function loadMyReports() {
  const r = await api('/reports/me', { auth: true });
  setOut(r);
}

async function adminListReports() {
  const r = await api('/reports', { auth: true });
  setOut(r);
}

async function adminUpdateReportStatus() {
  const id = document.getElementById('adminReportId').value.trim();
  const status = document.getElementById('adminStatus').value;
  if (!id) return setOut('Insert reportId first.');

  const r = await api(`/reports/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: { status },
    auth: true
  });
  setOut(r);
}

// Adoptions
async function createAdoption() {
  const treeId = document.getElementById('selectedTreeId').textContent.trim();
  if (!treeId || treeId === '-') {
    return setOut('Select a tree first.');
  }

  const r = await api('/adoptions', {
    method: 'POST',
    body: { treeId },
    auth: true
  });
  setOut(r);
}

async function loadMyAdoptions() {
  const r = await api('/adoptions/me', { auth: true });
  setOut(r);
}

async function adminListAdoptions() {
  const r = await api('/adoptions', { auth: true });
  setOut(r);
}

async function adminUpdateAdoptionStatus() {
  const id = document.getElementById('adminAdoptionId').value.trim();
  const status = document.getElementById('adminAdoptionStatus').value;
  if (!id) return setOut('Insert adoptionId first.');

  const r = await api(`/adoptions/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: { status },
    auth: true
  });
  setOut(r);
}

// Inizializzazione mappa

document.addEventListener('DOMContentLoaded', () => {
  map = L.map('map').setView([46.07, 11.12], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
});