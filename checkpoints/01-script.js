// these are from colorbrewer2.org
const color_patterns = [    
   // quantitative colors
   ['rgb(166,206,227)','rgb(31,120,180)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)'],

   // sequential colors
   ['rgb(255,255,204)','rgb(217,240,163)','rgb(173,221,142)','rgb(120,198,121)','rgb(65,171,93)','rgb(35,132,67)','rgb(0,90,50)'],

   // divergent colors
   ['rgb(215,48,39)','rgb(252,141,89)','rgb(254,224,139)','rgb(255,255,191)','rgb(217,239,139)','rgb(145,207,96)','rgb(26,152,80)']
];
const colors = color_patterns[2];

// a list of available data sets (filename, legend grades, title, layers etc.)
const housing_data = {
   filename: 'data/median-building-age.json', // json tile that we will use to build the colors
   colorSegments: [1940, 1950, 1960, 1970, 1980, 1990, 2000], // how to determine color grades for each housing age
   layerTitle: 'Median Building Age', // title of the data set
   censusId: 'HD01_VD01', // key in json file where actual data for census block is located
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
/***************** End leaflet config *****************/