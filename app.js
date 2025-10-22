// Initialize map
const map = L.map('map', {
  center: [39.5, -98.5],
  zoom: 5,
  zoomControl: true
});

// Base layers
const baseStreet = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '&copy; OpenStreetMap, &copy; CARTO'
});

const baseDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '&copy; OpenStreetMap, &copy; CARTO'
}).addTo(map);

const baseSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: '&copy; ESRI'
});

// NEXRAD Radar overlay
const radarWMS = L.tileLayer.wms('https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi', {
  layers: 'nexrad-n0r-900913',
  format: 'image/png',
  transparent: true,
  opacity: 0.6,
  attribution: 'IEM NEXRAD'
}).addTo(map);

// Marker clusters for fires
const fireCluster = L.markerClusterGroup({
  maxClusterRadius: 50,
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: true,
  zoomToBoundsOnClick: true,
  iconCreateFunction: function(cluster) {
    const count = cluster.getChildCount();
    let size = 'small';
    if (count > 50) size = 'large';
    else if (count > 20) size = 'medium';
    
    return L.divIcon({
      html: '<div style="background:linear-gradient(135deg,#ef4444,#f59e0b);color:#fff;border-radius:50%;width:45px;height:45px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;box-shadow:0 4px 12px rgba(239,68,68,.6);border:3px solid #fff">' + count + '</div>',
      className: 'fire-cluster',
      iconSize: L.point(45, 45)
    });
  }
});

// NWS Alerts layer
const alertsLayer = L.geoJSON(null, {
  style: function(feature) {
    const severityColors = {
      'Extreme': '#dc2626',
      'Severe': '#f59e0b',
      'Moderate': '#eab308',
      'Minor': '#22c55e',
      'Unknown': '#94a3b8'
    };
    const sev = feature.properties?.severity || 'Unknown';
    return {
      color: severityColors[sev],
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.15
    };
  },
  onEachFeature: function(feature, layer) {
    const p = feature.properties || {};
    const headline = p.headline || p.event || 'Weather Alert';
    const areas = p.areaDesc || 'N/A';
    const sev = p.severity || 'Unknown';
    const expires = p.expires ? new Date(p.expires).toLocaleString() : 'N/A';
    
    layer.bindPopup(`
      <h3>${headline}</h3>
      <strong>Severity:</strong> ${sev}<br>
      <strong>Areas:</strong> ${areas}<br>
      <strong>Expires:</strong> ${expires}
    `);
    
    layer.on('mouseover', () => layer.setStyle({weight: 3, fillOpacity: 0.25}));
    layer.on('mouseout', () => layer.setStyle({weight: 2, fillOpacity: 0.15}));
  }
}).addTo(map);

// Fire icon
const fireIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguNSAyMkMxMC41IDIyIDEyIDIwLjUgMTIgMThDMTIgMTYgMTEgMTQgMTAgMTNDMTAgMTUgOSAxNiA3IDE2QzUgMTYgMyAxNC41IDMgMTJDMyA5IDUgNyA3LjUgNkw5IDRDOSA0IDkgNSA5LjUgNS41QzEwIDYgMTAuNSA3IDExIDhDMTEuNSA5IDEyIDEwIDEyLjUgMTFDMTMgMTIgMTMuNSAxMyAxNCAxNEMxNC41IDE1IDE1IDE2IDE1LjUgMTdDMTYgMTcuNSAxNi41IDE4IDE3IDE4LjVDMTcuNSAxOSAxOCAxOS41IDE4LjUgMjBDMTguNSAyMC41IDE5IDIxIDE5IDIxLjVDMTkgMjIgMTguNSAyMiAxOCAyMkgxNkgxMkgxMEg4LjVaIiBmaWxsPSIjRUY0NDQ0Ii8+CjxwYXRoIGQ9Ik0xMiAxOEMxMiAxNi41IDExLjUgMTUgMTAuNSAxNEMxMC41IDE1IDEwIDE1LjUgOSAxNS41QzggMTUuNSA3IDE0LjUgNyAxM0M3IDExIDggMTAgOS41IDlMMTAuNSA3LjVDMTAuNSA3LjUgMTAuNSA4IDExIDguNUMxMS41IDkgMTIgOS41IDEyLjUgMTBDMTMgMTAuNSAxMy41IDExIDEzLjUgMTEuNUMxNCAxMiAxNC41IDEyLjUgMTUgMTNDMTUuNSAxMy41IDE2IDE0IDE2IDE0LjVDMTYuNSAxNSAxNyAxNS41IDE3LjUgMTZDMTggMTYuNSAxOC41IDE3IDE4LjUgMTcuNUMxOSAxOCAxOSAxOC41IDE5IDE5QzE5IDIwIDE4LjUgMjEgMTcuNSAyMS41QzE2LjUgMjIgMTUuNSAyMiAxNC41IDIySDEyQzEyIDIwLjUgMTIgMTkuNSAxMiAxOFoiIGZpbGw9IiNGNTlFMEIiLz4KPC9zdmc+',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
});

// Data storage
let firesData = [];
let alertsData = [];

// Load fires - checking if fireLocations is already available globally
function loadFires() {
  console.log('=== FIRE LOADING DEBUG ===');
  console.log('1. Checking window.fireLocations:', typeof window.fireLocations);
  console.log('2. Checking global fireLocations:', typeof fireLocations);
  
  try {
    // Try to access fireLocations from global scope
    if (typeof window.fireLocations !== 'undefined') {
      firesData = window.fireLocations;
      console.log('✓ Found window.fireLocations');
    } else if (typeof fireLocations !== 'undefined') {
      firesData = fireLocations;
      console.log('✓ Found global fireLocations');
    } else {
      console.error('✗ fireLocations not found!');
      console.log('Make sure fires.js is loaded BEFORE app.js');
      document.getElementById('fireCount').textContent = 'Not Found';
      alert('Fire data not loaded!\n\nMake sure your HTML includes:\n<script src="fires.js"></script>\n<script src="app.js"></script>\n\nAnd fires.js contains:\nconst fireLocations = [...your data...];\n\n(fires.js must be loaded BEFORE app.js)');
      return;
    }
    
    console.log('3. Fires data loaded:', firesData.length, 'fires');
    
    if (!firesData || firesData.length === 0) {
      console.warn('Fire data array is empty!');
      document.getElementById('fireCount').textContent = '0';
      return;
    }
    
    console.log('4. Sample fire data:', firesData[0]);
    
    // Add markers
    let validMarkers = 0;
    let invalidMarkers = 0;
    
    firesData.forEach((fire, index) => {
      const lat = parseFloat(fire.latitude);
      const lon = parseFloat(fire.longitude);
      
      // Validate coordinates
      if (isNaN(lat) || isNaN(lon)) {
        invalidMarkers++;
        console.warn(`Invalid coordinates at index ${index}:`, fire);
        return;
      }
      
      if (index < 3) {
        console.log(`Fire ${index}: lat=${lat}, lon=${lon}, brightness=${fire.brightness}`);
      }
      
      const marker = L.marker([lat, lon], { icon: fireIcon })
        .bindPopup(`
          <h3>🔥 Fire Hotspot</h3>
          <strong>Location:</strong> ${lat.toFixed(4)}°N, ${Math.abs(lon).toFixed(4)}°W<br>
          <strong>Date:</strong> ${fire.acq_date || 'N/A'}<br>
          <strong>Time:</strong> ${fire.acq_time || 'N/A'}<br>
          <strong>Brightness:</strong> ${fire.brightness ? fire.brightness.toFixed(1) : 'N/A'}K<br>
          <strong>FRP:</strong> ${fire.frp || 'N/A'} MW<br>
          <strong>Confidence:</strong> ${fire.confidence || 'N/A'}<br>
          <strong>Sensor:</strong> ${fire.sensor || 'N/A'}
        `);
      
      fireCluster.addLayer(marker);
      validMarkers++;
    });
    
    console.log(`5. Added ${validMarkers} valid markers, ${invalidMarkers} invalid`);
    
    map.addLayer(fireCluster);
    console.log('6. Fire cluster added to map');
    
    // Zoom to show all fire markers
    if (fireCluster.getLayers().length > 0) {
      const bounds = fireCluster.getBounds();
      map.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 7
      });
      console.log('7. Map zoomed to bounds:', bounds);
    } else {
      console.warn('7. No markers in cluster to zoom to!');
    }
    
    // Check visibility after render
    setTimeout(() => {
      const clusterDivs = document.querySelectorAll('.fire-cluster');
      const markerIcons = document.querySelectorAll('.leaflet-marker-icon');
      console.log('8. Visible clusters:', clusterDivs.length);
      console.log('9. Visible marker icons:', markerIcons.length);
      
      if (clusterDivs.length === 0 && markerIcons.length === 0) {
        console.error('⚠️ NO MARKERS VISIBLE ON MAP!');
        console.log('Check the Layer Control panel - "Fire Hotspots" must be checked');
      } else {
        console.log('✓ Fire markers are visible on map!');
      }
    }, 1500);
    
    updateStats();
    console.log('=== FIRE LOADING COMPLETE ===');
    
  } catch (error) {
    console.error('ERROR in loadFires():', error);
    console.error('Stack trace:', error.stack);
    document.getElementById('fireCount').textContent = 'Error';
    alert('Error loading fire data: ' + error.message);
  }
}

// Load NWS alerts
async function loadAlerts() {
  try {
    const response = await fetch('https://api.weather.gov/alerts/active');
    const data = await response.json();
    alertsData = data.features || [];
    
    alertsLayer.clearLayers();
    alertsLayer.addData(data);
    
    updateStats();
  } catch (error) {
    console.error('Error loading alerts:', error);
    document.getElementById('alertCount').textContent = 'Error';
  }
}

// Update statistics
function updateStats() {
  document.getElementById('fireCount').textContent = firesData.length;
  document.getElementById('alertCount').textContent = alertsData.length;
  
  // High risk fires (brightness > 305K or FRP > 2)
  const highRisk = firesData.filter(f => f.brightness > 305 || f.frp > 2).length;
  document.getElementById('highRiskCount').textContent = highRisk;
  
  // Average brightness
  if (firesData.length > 0) {
    const avgBright = firesData.reduce((sum, f) => sum + (f.brightness || 0), 0) / firesData.length;
    document.getElementById('avgBrightness').textContent = avgBright.toFixed(1) + 'K';
  }
  
  performAnalysis();
}

// Spatial analysis
function performAnalysis() {
  if (firesData.length === 0) return;
  
  let analysisText = '';
  
  // Fire density analysis
  const bounds = map.getBounds();
  const area = (bounds.getNorth() - bounds.getSouth()) * (bounds.getEast() - bounds.getWest());
  const density = (firesData.length / Math.abs(area)).toFixed(4);
  
  // Alert-fire correlation
  const firesInAlertZones = firesData.filter(fire => {
    return alertsData.some(alert => {
      if (!alert.geometry) return false;
      const coords = alert.geometry.coordinates;
     
      if (coords && coords[0] && coords[0][0]) {
        const polygon = coords[0][0];
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          const xi = polygon[i][0], yi = polygon[i][1];
          const xj = polygon[j][0], yj = polygon[j][1];
          const intersect = ((yi > fire.latitude) !== (yj > fire.latitude))
            && (fire.longitude < (xj - xi) * (fire.latitude - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }
        return inside;
      }
      return false;
    });
  }).length;
  
  // Regional clustering
  const midwest = firesData.filter(f => f.latitude > 41 && f.latitude < 49 && f.longitude > -95 && f.longitude < -82).length;
  
  // High risk calculation
  const highRiskFires = firesData.filter(f => f.brightness > 305 || f.frp > 2).length;
  
  analysisText = `<strong>Fire Density:</strong> ${density} fires/deg²<br><br>`;
  analysisText += `<strong>Fires in Alert Zones:</strong> ${firesInAlertZones} (${((firesInAlertZones/firesData.length)*100).toFixed(1)}%)<br><br>`;
  analysisText += `<strong>Midwest Cluster:</strong> ${midwest} fires detected in Great Lakes region<br><br>`;
  analysisText += `<strong>Risk Assessment:</strong> ${highRiskFires > 5 ? 'Elevated' : 'Moderate'} wildfire risk based on thermal signatures`;
  
  document.getElementById('analysisText').innerHTML = analysisText;
}

// Layer controls
const baseLayers = {
  'Dark Mode': baseDark,
  'Street View': baseStreet,
  'Satellite': baseSatellite
};

const overlays = {
  'Fire Hotspots': fireCluster,
  'NEXRAD Radar': radarWMS,
  'Weather Alerts': alertsLayer
};

L.control.layers(baseLayers, overlays, { collapsed: false, position: 'topleft' }).addTo(map);

// Legend
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {
  const div = L.DomUtil.create('div', 'legend');
  div.innerHTML = '<div class="legend-title">Alert Severity</div>';
  
  const items = [
    { color: '#dc2626', label: 'Extreme' },
    { color: '#f59e0b', label: 'Severe' },
    { color: '#eab308', label: 'Moderate' },
    { color: '#22c55e', label: 'Minor' }
  ];
  
  items.forEach(item => {
    div.innerHTML += `
      <div class="legend-row">
        <div class="legend-swatch" style="background:${item.color}"></div>
        <span>${item.label}</span>
      </div>
    `;
  });
  
  div.innerHTML += '<div class="legend-row"><span style="margin-left:24px">🔥 Fire Hotspot</span></div>';
  
  return div;
};
legend.addTo(map);

// Scale control
L.control.scale({ imperial: true, metric: true }).addTo(map);

// Initialize
loadFires();
loadAlerts();

// Refresh alerts every 5 minutes
setInterval(loadAlerts, 300000);