# The Mechanical Pencil Database - Data

The primary idea of this repository is to record the details of mechanical pencils - including clutch pencils and leadholders for posterity. 

the data of the pencil in itself should be enpigh, howevevr included in this repository are renderers that will parse this data and putput various formats. 

the base format is SVG which can then be used to generate - which may then be included in other formats. 

for example:

 - the svg file is ised to generate the png files.
 - the png files are then included in the pdf files.

the renderings and output files and formats are included in this repository, although they will probably disappear as the list of pencils be omes too large and unwieldly. 

Contains data for mechanical pencils in JSON format which can then be 
utilised to generate all sorts of images and output data.

Despite the renered outputs, the primary goal os to capture the data that the pencil comprises. 

## Directory structure

- `/docs/` - for documentations
- `/data/` - for mechanical pencil data
- `/output/` - For generated files
  - `/output/images/` - Generated PNG files 
  - `/output/vectors/` - Generated vector (SVG) files 


## Examples

### OHTO Sharp Pencil 2.0

For the file `/data/ohto/sharp-pencil-wn03.json`, one of the SVG files that 
is generated.

![Alt text](./output/vectors/pencil/ohto/sharp-pencil-wn03.svg)

and colour variants too (as PNGs)

<img src="./output/images/pencil/ohto/sharp-pencil-2.0-colour-black.png">

<img src="./output/images/pencil/ohto/sharp-pencil-2.0-colour-blue.png">

<img src="./output/images/pencil/ohto/sharp-pencil-2.0-colour-green.png">

<img src="./output/images/pencil/ohto/sharp-pencil-2.0-colour-red.png">

<img src="./output/images/pencil/ohto/sharp-pencil-2.0-colour-wood.png">

<img src="./output/images/pencil/ohto/sharp-pencil-2.0-colour-yellow.png">

### Mitsubishi Uni 

For the file `/data/mitsubishi/uni.json`, one of the SVG files that is 
generated.

![Alt text](./output/vectors/pencil/mitsubishi/uni.svg)

and colour variants too (as PNGs)

<img src="./output/images/pencil/mitsubishi/uni-colour-maroon.png">


## Updating CustomVector Images

All (or at least most) vector based images were made with 
[Provector](https://provector.app) which is an online and free Vector 
editing webapp.


The Saved File is a `.json` file which is stored in the 
`docs/provector/vectors/` directory.  The export of the images are saved in 
the `docs/provector/images` directory.

