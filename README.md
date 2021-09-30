# Census Mapper GIS Workshop

The main branch contains the starting repo and checkpoints folder for a GIS 
Workshop. For a more advanced and less documented project (that includes 
multiple data sets), see the `hackathon` branch.

To see the final solution, just copy the `checkpoints/04/script-final.js`
into the `script.js` file.

To run the project just clone the project and use any static HTTP server like 
`python -m SimpleHTTPServer` or `serve` (install with `npm install -g serve`).

## To download census data:

   1. https://data.census.gov/cedsci/ -- click 'advanced search'
   2. Click on Geography -> Block -> North Dakota -> Cass County -> All Blocks Within Cass County --> Search...
   3. Select DataSet. You can view it in a table, or on a map to verify.
   4. Download -> Select your data -> CSV file will be downloaded (as a zip file)
   5. Turn the CSV file into a json file for easy loading:
      `npm install -g csv2json`, then `csv2json ./FILENAME.csv DATASET.json` (use the file that has 'with labels' in the name)

