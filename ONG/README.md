Impulso Cuyano — Mapa de Productores (demo)

Archivos principales:
- `index.html` — layout y estructura (sidebar, mapa, grilla)
- `css/styles.css` — estilos responsivos
- `js/mapa.js` — lógica de Leaflet, filtros, grid y lightbox
- `data/productores.json` — datos de ejemplo (3 productores)
- `assets/icons/pin.svg` — icono de pin para el mapa

Cómo probar localmente (PowerShell en Windows):
1. Abre un PowerShell en la carpeta `ONG` (la que contiene `index.html`).
2. Ejecuta un servidor simple con Python 3:

```powershell
python -m http.server 8000
```
3. Abre en tu navegador: `http://localhost:8000`

Notas y próximos pasos sugeridos:
- Reemplaza las rutas de imagen (`assets/img/...`) con imágenes reales optimizadas (.webp).
- Considera agregar `leaflet.markercluster` si hay muchos productores.
- Puedo añadir una pequeña validación de formulario para "Sumate" o integrar búsqueda por texto si quieres.
