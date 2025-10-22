# Wildfire Hotspots & Live Weather (USA)



**Author:** Purna Saud (University of Wyoming)


---
Visit [https://purnasaud.github.io/wildfirehotspots_weather/](https://purnasaud.github.io/wildfirehotspots_weather/).  
Alerts auto-refresh every 5 minutes.


## 1) Datasets 


**A. FIRMS Fire Hotspots — `fire_nrt_J1V-C2_676530` (Jan–Oct 2025)**

Near–real-time wildfire/thermal anomaly points from **VIIRS (NOAA-20)**. Key fields: `latitude`, `longitude`, `acq_date`, `acq_time`, `brightness`, `frp`, `confidence`, `sensor`.

*Why:* shows where fires are occurring now and their intensity.


**B. NWS Active Alerts (live)**

GeoJSON polygons from **api.weather.gov/alerts/active** with `event`, `severity`, `areaDesc`, `expires`.

*Why:* weather alerts (e.g., Red Flag, severe storms) often influence fire ignition/spread.


*Relationship:* We compare where fires appear **inside** or **near** active weather alert areas.


---


## 2) JSON objects (examples)


**Fire (in `fires.js`):**


```js

{

  latitude: 38.1234,

  longitude: -120.5678,

  acq_date: "2025-08-12",

  acq_time: "2036",

  brightness: 312.6,

  frp: 2.8,

  confidence: "high",

  sensor: "VIIRS NOAA-20 (fire_nrt_J1V-C2_676530)"

}

```


**NWS Alert (from API):**


```json

{

  "type": "Feature",

  "properties": {

    "event": "Red Flag Warning",

    "severity": "Severe",

    "areaDesc": "Western Colorado",

    "expires": "2025-10-22T20:00:00Z"

  },

  "geometry": { "type": "Polygon", "coordinates": [ ... ] }

}

```


---


## 3) Map & popups


* **Fire markers** (clustered) → popup shows **brightness, FRP, confidence, date, sensor**.

* **NWS alerts** (polygons) → popup shows **headline, severity, areas, expires**.

* **Base maps:** Dark, Street, Satellite.

* **Overlays:** Fire Hotspots, NEXRAD Radar, Weather Alerts.


---


## 4) Analysis (simple & visible)


* **Fire density:** fires per map area (quick intensity check).

* **Fires in alert zones:** count/percent of fires inside active alerts (correlation).

* **Regional cluster (Great Lakes):** quick regional tally.

* **Risk flag:** “High-risk” if **brightness > 305 K** or **FRP > 2 MW**.


*Typical finding:* Western U.S. shows most high-brightness hotspots; a noticeable share overlaps Red Flag or severe weather alerts.


---


## 5) How to run


1. Put these files together: `index.html`, `app.js`, `style.css`, `fires.js`.

2. Open the folder in **VS Code** → **Live Server**, **or** run:


   ```bash

   python -m http.server

   ```




---


