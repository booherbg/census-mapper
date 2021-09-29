      // these are from colorbrewer2.org
      const color_patterns = [    
         // quantitative colors
         ['rgb(166,206,227)','rgb(31,120,180)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)'],

         // sequential colors
         ['rgb(255,255,204)','rgb(217,240,163)','rgb(173,221,142)','rgb(120,198,121)','rgb(65,171,93)','rgb(35,132,67)','rgb(0,90,50)'],

         // divergent colors
         ['rgb(215,48,39)','rgb(252,141,89)','rgb(254,224,139)','rgb(255,255,191)','rgb(217,239,139)','rgb(145,207,96)','rgb(26,152,80)']
      ];

      // a list of available data sets (filename, legend grades, title, layers etc.)
      const data_files = [
         // median building age
         {
            filename: 'data/median-building-age.json', 
            data_grades: [1940, 1960, 1970, 1980, 1990, 2000],
            big_title: 'Median Building Age',
            layers: [
               ['HD01_VD01', null, ': media year of building', true],
            ]
         },

         // rent to income
         {
            filename: 'data/rent-to-income.json',
            data_grades: [10, 20, 30, 40, 50, 60],
            big_title: 'Rent To Income Ratio',
            layers: [
               ['HD01_VD02', 'HD01_VD01', 'rent is < 10% of income', true],
               ['HD01_BB01', 'HD01_VD01', 'rent is 10-20% of income', false],
               ['HD01_BB02', 'HD01_VD01', 'rent is 20-30% of income', false],
               ['HD01_BB03', 'HD01_VD01', 'rent is 30-40% of income', false],
               ['HD01_VD09', 'HD01_VD01', 'rent is 40-50% of income', false],
               ['HD01_VD10', 'HD01_VD01', 'rent is > 50% of income', false]
            ]
         },

         // migration to fargo
         {
            filename: 'data/migration-to-fargo.json',
            data_grades: [10, 20, 40, 50, 70, 90],
            big_title: 'Where did people live 1 year ago today?',
            layers: [
               ['HD01_VD02', 'HD01_VD01', 'have not moved in the last year', true],
               ['HD01_VD03', 'HD01_VD01', 'moved here from somewhere in the US', false],
               ['HD01_VD14', 'HD01_VD01', 'moved here from abroad', false],
               ['HD01_VD04', 'HD01_VD03', 'moved across town (fargo)', false],
               ['HD01_VD07', 'HD01_VD03', 'moved from a large city (transplant)', false],
               ['HD01_VD10', 'HD01_VD03', 'moved from a small city (transplant)', false]
            ]
         }];

      /************* This is the customizable part ************/
      // which dataset would you like to use?
      const data_to_use = data_files[2];

      // which color scheme would you like to use?
      const colors = color_patterns[0];
      /************* End configuration ************************/

      /************* Leafconst setup ************/
      // shortcuts for variables later
      const filename = data_to_use.filename;
      const data_rows = data_to_use.layers;
      const data_grades = data_to_use.data_grades;
      const big_title = data_to_use.big_title;

      const data = {};
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
      const layers = {'Streets': layer1, 'Dark': layer2, 'Light': layer3};
      const map = L.map('map', {layers: [layer1, ]}).setView([46.8772, -96.7894], 13);
      const overlays = {}
      //var controlLayers = L.control.layers(layers).addTo(map);

      const dataLayers = new L.LayerGroup();
      const groupedOverlays = {
            "Data": {},
            "Shapefiles": {}
          };
      const options = { exclusiveGroups: ["Data"], groupCheckboxes: false };
      const layerControl = L.control.groupedLayers(layers, groupedOverlays, options);
      map.addControl(layerControl);

      // control that shows state info on hover
      const info = L.control({ position: 'topleft' });
      info.onAdd = function (map) {
         this._div = L.DomUtil.create('div', 'info');
         this.update();
         return this._div;
      };

      info.update = function (props) {
         this._div.innerHTML = '<h4>' + big_title + '</h4>' +  (props ?
            '<b>' + props.value + '%</b><br /> of people ' + props.title + "<br/>BlkId: " + props.GEOID
            : 'Hover over a census block');
      };
      info.addTo(map);

      // quick setup for the legend
      const legend = L.control({position: 'bottomright'});
      legend.onAdd = function (map) {
         const div = L.DomUtil.create('div', 'info legend');
         const grades = [0].concat(data_grades);
         const labels = [];

         for (let i = 0; i < grades.length; i++) {
            const from = grades[i];
            const to = grades[i + 1];
            labels.push(
               '<i style="background:' + getColor(from + (grades[1] / 10000)) + '"></i> ' +
               from + (to ? '&ndash;' + to : '+'));
         }

         div.innerHTML = labels.join('<br>');
         return div;
      };
      legend.addTo(map);

      /***************** End leaflet config *****************/

      function getColor(d) {
         if (isNaN(d)) {
            // no data
            return '#fff'
         }
         return d < data_grades[0] ? colors[0] :
                d < data_grades[1] ? colors[1] :
                d < data_grades[2] ? colors[2] :
                d < data_grades[3] ? colors[3] :
                d < data_grades[4] ? colors[4] :
                d < data_grades[5] ? colors[5] :
                           colors[6];
      }

      function style(feature) {
         return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.8,
            fillColor: getColor(feature.properties.density)
         };
      }

      $.getJSON('Schools_Metro.geojson', function(d) {
         l = L.geoJson(d, {});
         //controlLayers.addOverlay(l, 'Schools');
         layerControl.addOverlay(l, 'Schools', 'Shapefiles');
      });

      $.getJSON('data/Neighborhoods.geojson', function(d) {
         l = L.geoJson(d, {});
         //controlLayers.addOverlay(l, 'Neighborhoods');
         layerControl.addOverlay(l, 'Neighborhoods', 'Shapefiles');
      });

      // let geojson;
      // add layers and color them based on value
      function AddLayerByID(CensusId, TotalId, title, showImmediately) {
         $.getJSON("./data/census-blocks.geojson",function(blocks){
            let density;
            let geojson = L.geoJson( blocks, {
               style: function(feature){
                  let fillColor, goid = feature.properties.GEOID;
                  let total = 0;
                  let num = 0;
                  density = data[goid];

                  if (TotalId == null) {
                     // just do the numbers, not a percent
                     if (density === undefined) {
                     } else {
                        density = density[CensusId];
                     }
                  } else {
                     if (density === undefined) {
                     } else {
                        num = density[CensusId];
                        total = density[TotalId];
                        density = num / total;
                        density = Math.round(density * 100)
                     }
                  }
                  console.log(density);
                  fillColor = getColor(density);
                  return { 
                     color: "black",
                     weight: 2 ,
                     dashArray: '3',
                     fillColor: fillColor, 
                     fillOpacity: .7,
                  };
               },
               onEachFeature: function( feature, layer ){
                  /*layer.bindPopup( "Percentage of Rent More Than 50% Of Income :: Income: <strong>" + density * 100 + "%</strong> ("+num+"/"+total+")<br/>");*/
                  feature.properties.value = density;
                  feature.properties.title = title;
                  onEachFeature(feature, layer);
               },
            });

            overlays['census-blocks'] = geojson;
            if (showImmediately)
            {
               geojson.addTo(map);
            }
            //L.control.layers(layers, overlays).addTo(map);
            //controlLayers.addOverlay(geojson, title);
            layerControl.addOverlay(geojson, title, "Data");
         });
      }

      $.getJSON(filename, function(d) {
         for (i=0; i<d.length; i++) 
         {
            if (i > 0)
            {
               data[d[i]['GEO.id2']] = d[i];
            }
         }
      });

      for (i=0; i < data_rows.length; i++) {
         AddLayerByID(data_rows[i][0], data_rows[i][1], data_rows[i][2], data_rows[i][3]);
      }

      function highlightFeature(e) {
         let layer = e.target;

         /*
         layer.setStyle({
            weight: 5,
            color: '#fff',
            dashArray: '',
            fillOpacity: 0.3
         }); */

         if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
         }
         info.update(layer.feature.properties);
      }

      function resetHighlight(e) {
         //geojson.resetStyle(e.target);
         info.update();
      }

      function zoomToFeature(e) {
         map.fitBounds(e.target.getBounds());
      }

      function onEachFeature(feature, layer) {
         layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
         });
      }