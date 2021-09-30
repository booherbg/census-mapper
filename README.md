# census-mapper
Civic Hackathon Weekend 2015 project: Still a work in progress, needs cleaned up and refactored

Running this is pretty easy. Clone the project, then make sure python is installed. Then
just use the built in HTTP server:

``` bash
$ python -m SimpleHTTPServer
```

You can change which datafile is loaded, and the color scheme by adjusting the two
variables around line 100 (`data_to_use` and `colors`)

and then visit http://localhost:8000

## To download census data:

   1. https://data.census.gov/cedsci/ -- click 'advanced search'
   2. Click on Geography -> Block -> North Dakota -> Cass County -> All Blocks Within Cass County --> Search...
   3. Select DataSet. You can view it in a table, or on a map to verify.
   4. Download -> Select your data -> CSV file will be downloaded (as a zip file)
   5. Turn the CSV file into a json file for easy loading:
      `npm install -g csv2json`, then `csv2json ./FILENAME.csv DATASET.json` (use the file that has 'with labels' in the name)

