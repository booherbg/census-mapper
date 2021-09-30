# census-mapper
Civic Hackathon Weekend 2015 project: Still a work in progress, needs cleaned up and refactored

Running this is pretty easy. Clone the project, then make sure python is installed. Then
just use any static HTTP server like `python -m SimpleHTTPServer` or `serve` (install with
`npm install -g serve`)

## To download census data:

   1. https://data.census.gov/cedsci/ -- click 'advanced search'
   2. Click on Geography -> Block -> North Dakota -> Cass County -> All Blocks Within Cass County --> Search...
   3. Select DataSet. You can view it in a table, or on a map to verify.
   4. Download -> Select your data -> CSV file will be downloaded (as a zip file)
   5. Turn the CSV file into a json file for easy loading:
      `npm install -g csv2json`, then `csv2json ./FILENAME.csv DATASET.json` (use the file that has 'with labels' in the name)

