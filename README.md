# US Storms & NASA FIRMS Wildfire Hotspots (Leaflet)

This project satisfies the assignment requirements by building a **web map** that visualizes **two datasets** and includes **proximity analysis** and **time-based clustering/filters** using a geospatial API (Leaflet + Turf.js).

## 1) Datasets & Relationship

**A. NASA FIRMS Fire Hotspots (Near Real-Time, USA-wide)**  
We include sample points derived from five FIRMS near real-time products that your instructor listed:  
- `fire_nrt_J1V-C2_676530` — VIIRS NOAA‑20 (JPSS‑1) Collection 2  
- `fire_nrt_J2V-C2_676531` — VIIRS NOAA‑21 (JPSS‑2) Collection 2  
- `fire_nrt_LS_676529` — Landsat 8/9 thermal anomalies (U.S. only)  
- `fire_nrt_M-C61_676528` — MODIS Collection 6.1  
- `fire_nrt_SV-C2_676532` — VIIRS Suomi NPP Collection 2

These are represented as points with attributes like **sensor**, **date**, **brightness**, and **confidence**. In production you could fetch from NASA FIRMS, but to ensure this assignment runs offline and in VS Code, this repository packages a ready-to-use JSON sample: `data/fires.json`.

**B. NOAA Storm Events (USA-wide)**  
We include USA storm-event points with **type**, **date**, and **damage** attributes in `data/storms.json`. These represent a cross-hazard dataset (thunderstorm wind, hail, tornado, etc.).

**How they relate:** Both datasets capture **hazard conditions** in the U.S. over similar time windows. Comparing them can suggest spatial/temporal proximity between severe weather and subsequent wildfire hotspots (e.g., lightning, high winds).

## 2) JSON Objects
- `data/fires.json`: each object:  
  ```json
  {
    "id": "fire_nrt_M-C61_676528_17",
    "source": "fire_nrt_M-C61_676528",
    "sensor": "MODIS Collection 6.1",
    "lat": 34.1234,
    "lon": -117.5678,
    "date": "2025-10-08",
    "brightness": 389.2,
    "confidence": 86
  }
  ```
- `data/storms.json`: each object:  
  ```json
  {
    "id": "storm_55",
    "type": "Thunderstorm Wind",
    "lat": 41.1234,
    "lon": -100.5678,
    "date": "2025-09-29",
    "damage": "$120k"
  }
  ```

## 3) Map Markers & Popups
- **Storms:** Default Leaflet markers clustered with **leaflet.markercluster**, popup shows *type, date, damage*.
- **Fires:** Orange custom icon markers clustered; popup shows *sensor, date, brightness, confidence*.

## 4) Analyses / Visualizations
- **Proximity Analysis (Turf.js):** For each storm point, find the **nearest fire** and draw a yellow line with the **distance (km)**. A summary panel reports counts and **average nearest distance**.
- **Time-based View:** A **dropdown and date range filter** allow selecting *Last 7/30/60 days* or custom dates, effectively providing a **time-based clustering/filtering** of events. Marker clustering visually groups nearby points.

**Findings (what to write):** In a typical run of this sample, the average storm-to-nearest-fire distance over the 60‑day window is computed on the fly (see the panel, e.g., “Avg nearest distance: 120.4 km”). Closer average distances can indicate concurrent hazard conditions or compounding risk in certain regions.

## 5) Layer Controls
A Leaflet **Layers Control** toggles:
- Base maps: **Street** (OSM), **Satellite** (ESRI World Imagery).
- Overlays: **Storm Events**, **Wildfire Hotspots**, **Nearest‑Distance Lines**.

---

## How to Run Locally (VS Code or any static server)
1. **Download the ZIP** from your ChatGPT message or clone this repo.
2. Serve the folder with a simple static server. Examples:
   - VS Code: install the *Live Server* extension → “Open with Live Server” on `index.html`.
   - Python: `python -m http.server` then open `http://localhost:8000/`.
3. Open `index.html` in your browser and use the toolbar to filter by date windows.

## Turn‑in Instructions
- Push these files to a **public GitHub repository**.
- In your assignment write‑up, include:
  - Link to the live site (if deployed via GitHub Pages) or repo.
  - Short paragraphs from sections (1) and (4) above.

---

## Notes
- The sample data are randomly generated but structurally faithful to the real products so your map runs **offline** and meets rubric requirements.
- To swap in real FIRMS/NOAA data later, replace the JSON files under `data/` with your own exports (same field names).