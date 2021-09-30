// these are from colorbrewer2.org
const color_patterns = [    
   // quantitative colors
   ['rgb(166,206,227)','rgb(31,120,180)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)'],

   // sequential colors
   ['rgb(255,255,204)','rgb(217,240,163)','rgb(173,221,142)','rgb(120,198,121)','rgb(65,171,93)','rgb(35,132,67)','rgb(0,90,50)'],

   // divergent colors
   ['rgb(215,48,39)','rgb(252,141,89)','rgb(254,224,139)','rgb(255,255,191)','rgb(217,239,139)','rgb(145,207,96)','rgb(26,152,80)']
];
const colors = color_patterns[1];

// a list of available data sets (filename, legend grades, title, layers etc.)
const housing_data = {
   filename: 'data/median-building-age.json', 
   dataGrades: [1940, 1950, 1960, 1970, 1980, 1990, 2000],
   layerTitle: 'Median Building Age',
   censusId: 'HD01_VD01'
}

/************* Leaflet setup ************/
const layer1 = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmxhaW5lYm9vaGVyIiwiYSI6ImNqdnpyZXYyazAzY2I0YXJ3NXU2bncza3EifQ.r-UXneroYKijhSlT4MVZjw', {
   maxZoom: 18,
   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
   id: 'streets-v11'
});

const layer2 = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmxhaW5lYm9vaGVyIiwiYSI6ImNqdnpyZXYyazAzY2I0YXJ3NXU2bncza3EifQ.r-UXneroYKijhSlT4MVZjw', {
   maxZoom: 18,
   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
   id: 'dark-v10'
});

const layer3 = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmxhaW5lYm9vaGVyIiwiYSI6ImNqdnpyZXYyazAzY2I0YXJ3NXU2bncza3EifQ.r-UXneroYKijhSlT4MVZjw', {
   maxZoom: 18,
   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
   id: 'light-v8'
});

// Create a map, show the first layer, and set the view to downtown fargo at zoom level 13
const map = L.map('map', {layers: [layer1, ]}).setView([46.8772, -96.7894], 13);

// Create a the controls (layers, legend, info)
let controlLayers = L.control.layers({
   'Streets': layer1, 
   'Dark': layer2, 
   'Light': layer3
}).addTo(map);
const legend = L.control({ position: 'bottomright' } );
const info = L.control({ position: 'topleft' });
/***************** End leaflet config *****************/

// add data layers and color them based on value
const AddLayerByID = async (geoLookupTable, CensusId, dataGrades, layerTitle) => {
   // Grab the geojson file via HTTP
   let blocks = await (await fetch("./data/census-blocks.geojson")).json();
   // Create a Leaflet geoJSON layer
   let geojson = L.geoJson(blocks, {
      style: function(feature) {
         /* This function gets called for *each* feature in the layer. This function is
            responsible for figuring out what style to apply to the feature. We do this by
            looking up the housing data for the given census block and figuring out the color
            that this block should be based on the data grade and scale */

         // First, look up the data we want to visualize in the lookup table by the census block ID
         let geoID = feature.properties.GEOID;

         // store on this.dataValue so the onEachFeature function can access it later
         this.dataValue = geoLookupTable[geoID] ? geoLookupTable[geoID][CensusId] : undefined;

         // Given the year of the housing structure, what color should we give it?
         let fillColor = getColor(this.dataValue, dataGrades);
         return { 
            color: 'black',
            dashArray: '2',
            fillColor: fillColor, 
            fillOpacity: .6,
            weight: '1'
         };
      },
      onEachFeature: function( feature, layer ) {
         // When each feature is created, give it a popup and set up some mouse interactions
         layer.bindPopup(`Median Age of Structures: <strong>${this.dataValue}</strong>`);
         feature.properties.value = this.dataValue;
         feature.properties.title = layerTitle;
         layer.on({
            mouseover: function(e) { info.update(e.target.feature.properties) },
            mouseout: function(e) { info.update() },
            // click: function(e) { map.fitBounds(e.target.getBounds())},
         });
      },
   });

   geojson.addTo(map);
   controlLayers.addOverlay(geojson, layerTitle);
}

// A little helper function to figure out which color to use for a given data value
const getColor = (value, dataGrades) => {
   if (isNaN(value) || !value) return '#fff'
   for (let i=0; i<dataGrades.length; i++) {
      if (Number(value) <= Number(dataGrades[i])) return colors[i]
   }
   return colors[colors.length-1];
}

const setup = async () => {
   const { filename, dataGrades, censusId, layerTitle } = housing_data;
   // Create a simple lookup table so we can easily grab data for any given Census Block ID:
   /* Each row in the JSON array will look like this:
      {
         GEO.id: '1500000US380170001001', 
         GEO.id2: '380170001001', 
         GEO.display-label: 'Block Group 1, Census Tract 1, Cass County, North Dakota', 
         HD01_VD01: '1962', 
         HD02_VD01: '2'
      }

      Turn it into:
      {
         '380170001001': {GEO.id, GEO.id2, HD01_VD01, etc}
      }
   */
   const geoLookupTable = (await (await fetch(filename)).json()).reduce((map, row, index) => {
      if (index === 0) return map; // skip the header of the data (first row)
      map[row['GEO.id2']] = row;
      return map;
   }, {});

   // Add the actual housing layer to leaflet
   AddLayerByID(geoLookupTable, censusId, dataGrades, layerTitle);

   // Set up the legend based on the color grades
   legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      const grades = [0].concat(dataGrades);
      const labels = [];
   
      for (let i = 0; i < grades.length; i++) {
         const from = grades[i];
         const to = grades[i + 1];
         labels.push(
            '<i style="background:' + getColor(from + .00001, dataGrades) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
      }
   
      div.innerHTML = labels.join('<br>');
      return div;
   };
   legend.addTo(map);

   // control that shows state info on hover
   info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
   };

   info.update = function (props) {
      this._div.innerHTML = 'Hover over a census block for more info';
      if (props) {
         this._div.innerHTML = `
            <h4>${props.title}</h4>
            <b>${props.value}</b><br/>BlkId: ${props.GEOID}
         `;
      }
   };
   info.addTo(map);

   // Add some other local geoJSON layers for flavor, with default styling
   const neighborhoods = await (await fetch('data/Neighborhoods.geojson')).json();
   controlLayers.addOverlay(L.geoJson(neighborhoods, {}), 'Neighborhoods');

   const schools = await (await fetch('data/Schools_Metro.geojson')).json();
   controlLayers.addOverlay(L.geoJson(schools, {}), 'Schools');
}
setup();