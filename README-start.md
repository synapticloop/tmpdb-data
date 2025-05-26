# The Mechanical Pencil Database - Data

The primary idea of this repository is to record the technical details of 
mechanical pencils (including clutch pencils and leadholders) for posterity. 

The data of the pencil in itself should be enough, however included in this 
repository are renderers that will parse this data and output various formats.

The base output format is SVG which can then be used to generate other 
formats, for example 

 - The svg file is used to generate a png file.
 - The png file is then included in a pdf file.

The renderings and output files and formats are included in this repository, 
although they will probably disappear as the list of pencils becomes too large 
and unwieldly.

Despite the rendered outputs, the primary goal os to capture the data that the 
pencil comprises. 

**NOTE:** Since the base output is SVG the JSON data also contains content which 
is applicable to the SVG rendering output (and some others), which is 
then mixing up the technical pencil data with display data - this is 
unfortunate but a design decision.

## Pencil definitions that are included in this repository

_(To regenerate the list - and this `README.md` file, run  
`npm run readme-generator` from the root of the project.)_


