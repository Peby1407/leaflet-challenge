// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Initialize all the LayerGroups that we'll use.
let layers = {
  Layer1: new L.LayerGroup(),
  Layer2: new L.LayerGroup(),
  Layer3: new L.LayerGroup(),
  Layer4: new L.LayerGroup(),
  Layer5: new L.LayerGroup(),
  Layer6: new L.LayerGroup()
};

// Create the map with our layers.
let map = L.map("map", {
  center: [38.116386, -101.299591],
  zoom: 5,
  layers: [
    layers.Layer1,
    layers.Layer2,
    layers.Layer3,
    layers.Layer4,
    layers.Layer5,
    layers.Layer6
  ]
});

// Add our "streetmap" tile layer to the map.
streetmap.addTo(map);

// Create an overlays object to add to the layer control.
let overlays = {
  "-10 - 10": layers.Layer1,
  "10 - 30": layers.Layer2,
  "30 - 50": layers.Layer3,
  "50 - 70": layers.Layer4,
  "70 - 90": layers.Layer5,
  "90+": layers.Layer6
};

// Create a control for our layers, and add our overlays to it.
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map.
let info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend".
info.onAdd = function() {
  let div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map.
info.addTo(map);

// // Initialize an object that contains icons for each layer group.
let icons = {
  Layer1: L.circleMarker({
    icon: "-10 - 10",
    iconColor: "blue",
    markerColor: "blue",
    shape: "circle"
  }),
  Layer2: L.circleMarker({
    icon: "10 - 30",
    iconColor: "purple",
    markerColor: "purple",
    shape: "circle"
  }),
  Layer3: L.circleMarker({
    icon: "30 - 50",
    iconColor: "yellow",
    markerColor: "yellow",
    shape: "circle"
  }),
  Layer4: L.circleMarker({
    icon: "50 - 70",
    iconColor: "orange",
    markerColor: "orange",
    shape: "circle"
  }),
  Layer5: L.circleMarker({
    icon: "70 - 90",
    iconColor: "brown",
    markerColor: "brown",
    shape: "circle"
  }),
  Layer6: L.circleMarker({
    icon: "90+",
    iconColor: "black",
    markerColor: "black",
    shape: "circle"
  })
};


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(infoRes) {

    let geodata = infoRes.features.geometry.coordinates;
    let depth = geodata[2];
    let lat = geodata[0];
    let lon = geodata[1];
    let quakeInfo = infoRes.features;
    // Initialize quakedepth, which will be used as a key to access the appropriate layers, icons for the layer group
    let quakedepth;

    // Loop through the earthquakes (they're the same size and have partially matching data).
    for (let i = 0; i < quakeInfo.length; i++) {

      if (depth <10 && depth >0) {
        quakedepth = "Layer1";
      }
      
      else if (depth <30 && depth >10) {
        quakedepth = "Layer2";
      }
            else if (depth <50 && depth >30) {
        quakedepth = "Layer3";
      }
            else if (depth <70 && depth >50) {
        quakedepth = "Layer4";
      }
      
      else if (depth <90 && depth >70) {
        quakedepth = "Layer5";
      }
      
      else {
        quakedepth = "Layer6";
      }

      
      // Create a new marker with the appropriate icon and coordinates.
      let newMarker = L.marker([lat, lon], {
        icon: icons[quakedepth]
      });

      // Add the new marker to the appropriate layer.
      newMarker.addTo(layers[quakedepth]);

      // Bind a popup to the marker that will  display on being clicked. This will be rendered as HTML.
      newMarker.bindPopup(quakeInfo.property.place);
    }


});

