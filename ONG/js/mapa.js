// mapa.js — Leaflet interactive map + filters + grid + lightbox
const MAP_CENTER = [-32.5, -68.5];
let productores = [];
let markersGroup;
let map;
let geoJsonLayer;

function initMap(){
  map = L.map('map').setView(MAP_CENTER, 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:''}).addTo(map);
  markersGroup = L.layerGroup().addTo(map);
}

async function loadDataProductores(){
  try{
    const res = await fetch('data/productores.json');
    productores = await res.json();
    return productores;
  }catch(err){
    console.error('Error cargando data', err);
  }
}

function createMarker(prod){
  const icon = L.icon({iconUrl: 'assets/icons/pin.svg', iconSize:[34,34], iconAnchor:[17,34]});
  const m = L.marker([prod.lat, prod.lng], {icon});
  // Contenido del Popup 
  const html = `<div style="min-width:180px"><strong>${prod.nombre}</strong><br/><img src="${prod.foto}" alt="${prod.nombre}" style="width:100%;height:80px;object-fit:cover;margin-top:8px;border-radius:4px"/><p style="margin:8px 0 0 0;font-size:0.85rem">${prod.descripcion}</p><p style="margin:8px 0 0 0;font-size:0.8rem;color:#333">${prod.contacto?.email || '—'} ${prod.contacto?.telefono ? ' • ' + prod.contacto.telefono : ''}</p></div>`;
  m.bindPopup(html);
  return m;
}

function renderMarkers(list, shouldFitBounds = true){
  markersGroup.clearLayers();
  list.forEach(p=> markersGroup.addLayer(createMarker(p)) );
  if(list.length && shouldFitBounds){
    const group = L.featureGroup(list.map(p=> L.marker([p.lat,p.lng])));
    try{ map.fitBounds(group.getBounds().pad(0.2)); }catch(e){}
  }
}

function renderGrid(list){
  const grid = document.getElementById('grid');
  if(!grid) return;
  grid.innerHTML = list.map(p=>`
    <article class="card" data-id="${p.id}">
      <img src="${p.foto}" alt="${p.nombre}"/>
      <div class="card-body">
        <h5>${p.nombre}</h5>
        <p>${p.descripcion}</p>
      </div>
    </article>
  `).join('') || '<p style="padding:14px">No hay productores que coincidan con los filtros.</p>';

  grid.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const id = +card.dataset.id;
      const prod = productores.find(x=>x.id===id);
      if(prod){
        openLightbox(prod);
        map.setView([prod.lat, prod.lng], 13);
      }
    });
  });
}

function getActiveFilters(){
  const prov = document.querySelector('#provincias button.active')?.dataset?.prov || 'all';
  const checkboxes = Array.from(document.querySelectorAll('#filters .filter-block input[type=checkbox]'));
  const categorias = checkboxes.filter(i=> i.value && i.closest('.filter-block')?.querySelector('h4')?.textContent === 'Categorías' && i.checked).map(i=>i.value);
  const certs = checkboxes.filter(i=> i.value && i.closest('.filter-block')?.querySelector('h4')?.textContent === 'Certificaciones' && i.checked).map(i=>i.value);
  return {prov, categorias, certs};
}

function applyFilters(shouldFitBounds = true){
  const {prov, categorias, certs} = getActiveFilters();
  let filtered = productores.slice();
  if(prov && prov !== 'all') filtered = filtered.filter(p=> p.provincia === prov);
  if(categorias.length) filtered = filtered.filter(p=> categorias.some(c=> p.categorias.includes(c)));
  if(certs.length) filtered = filtered.filter(p=> certs.some(c=> p.certificaciones.includes(c)));
  renderMarkers(filtered, shouldFitBounds);
  renderGrid(filtered);
}

function setupListeners(){
  // provinces buttons
  document.querySelectorAll('#provincias button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('#provincias button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  // checkboxes
  document.querySelectorAll('#filters input[type=checkbox]').forEach(ch=> ch.addEventListener('change', ()=> applyFilters()));

  // reset
  document.getElementById('resetFilters').addEventListener('click', ()=>{
    document.querySelectorAll('#filters input[type=checkbox]').forEach(i=> i.checked = false);
    document.querySelector('#provincias button[data-prov="all"]').click();
  });
}

/* Lightbox */
function openLightbox(prod){
  const lb = document.getElementById('lightbox');
  const body = document.getElementById('lb-body');
  body.innerHTML = `
    <h2 style="color:var(--primary)">${prod.nombre}</h2>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
      <img src="${prod.foto}" alt="${prod.nombre}" style="width:320px;max-width:100%;border-radius:6px;object-fit:cover"/>
      <div style="flex:1">
        <p>${prod.descripcion}</p>
        <p><strong>Provincia:</strong> ${prod.provincia}</p>
        <p><strong>Categorías:</strong> ${prod.categorias.join(', ')}</p>
        <p><strong>Certificaciones:</strong> ${prod.certificaciones.join(', ') || '—'}</p>
        <p><strong>Contacto:</strong> ${prod.contacto?.email || '—'} ${prod.contacto?.telefono ? ' • ' + prod.contacto.telefono : ''}</p>
      </div>
    </div>
  `;
  // append a Volver button inside the lightbox body for clarity
  const backBtn = document.createElement('button');
  backBtn.className = 'lb-back';
  backBtn.textContent = 'Volver';
  backBtn.addEventListener('click', closeLightbox);
  body.appendChild(backBtn);

  lb.setAttribute('aria-hidden','false');
}
function closeLightbox(){
  const lb = document.getElementById('lightbox');
  lb.setAttribute('aria-hidden','true');
}

// Variable para guardar la capa de provincias
let geojsonLayer;

// 1. Función para definir el color de cada provincia
function getColor(provincia) {
  switch (provincia) {
    case 'Mendoza': return '#6A0D4B'; // Color primario
    case 'San Juan': return '#798A5A'; // Color secundario
    case 'San Luis': return '#F0A500'; // Color de acento
    case 'La Rioja': return '#8a4c74'; // Tono de primario
    case 'Catamarca': return '#97a67c'; // Tono de secundario
    default: return '#CCCCCC';
  }
}

// 2. Función de estilo para la capa GeoJSON
function style(feature) {
  return {
    fillColor: getColor(feature.properties.nombre),
    weight: 2,
    opacity: 1,
    color: 'white', // Color del borde
    dashArray: '3',
    fillOpacity: 0.6
  };
}

// 3. Funciones de interactividad (resaltar al pasar el mouse)
function highlightFeature(e) {
  const layer = e.target;
  layer.setStyle({
    weight: 5,
    color: '#333',
    dashArray: '',
    fillOpacity: 0.8
  });
  layer.bringToFront();
} 



function resetHighlight(e) {
  geojsonLayer.resetStyle(e.target);
}

// 4. Función que se asigna a cada "feature" (provincia)
function onEachFeature(feature, layer) {
  // Añade un popup simple
  layer.bindPopup('<h4>' + feature.properties.nombre + '</h4>');
  
  // Asigna los eventos del mouse
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
  });
}

// 5. Función principal para cargar la capa
async function loadCuyoChoropleth() {
  const PROVINCIAS_CUYO = ['Mendoza', 'San Juan', 'San Luis', 'La Rioja', 'Catamarca'];
  const GeoJSON_URL = 'https://apis.datos.gob.ar/georef/api/v2.0/provincias.geojson';
  try {
    const response = await fetch(GeoJSON_URL);
    const data = await response.json();
    // Filtramos las pronvincias de Cuyo
    const cuyoFeatures = data.features.filter(feature => {
      return PROVINCIAS_CUYO.includes(feature.properties.nombre);
    });
    const cuyoGeoJSON = {
      type: 'FeatureCollection',
      features: cuyoFeatures
    };

    geoJsonLayer = L.geoJson(cuyoGeoJSON, {
      style: style,

      onEachFeature: onEachFeature
    }).addTo(map); // le agregamos al mapa los datos filtrados
    geoJsonLayer.bringToBack();
    return geoJsonLayer;

  } catch (err) {
    console.error('Error cargando choropleth de Cuyo', err);
  }
}

// setup lb close button
document.addEventListener('click', (e)=>{
  if(e.target.matches('.lb-close') || e.target.id === 'lightbox') closeLightbox();
  if(e.target.matches('.lb-back')) closeLightbox();
});

// init
document.addEventListener('DOMContentLoaded', async ()=>{
  initMap();
  setupListeners(); // Los botones configurados

  try {
    const [provinciasLayer, lecturaProductores] = await Promise.all([
      loadCuyoChoropleth(), loadDataProductores()
    ]);
    // Definimos la variable global de productores
    productores = lecturaProductores;
    // Aplicar filtros de los pines
    applyFilters(shouldFitBounds = false);

    if(provinciasLayer){
      map.fitBounds(provinciasLayer.getBounds());      
    }

  } catch (e) {
    console.error('No se pudieron cargar los productores.');
  }
});
