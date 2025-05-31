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

_(To regenerate the list - and this `README.md` file, run `npm run readme-generator` from the root of the project.)_


| Brand | Name | Model # | Lead Size<br />_(mm)_ | # Variants<br />_(colours / patterns)_ | Accuracy |
| ---: | :--- | :--- | ---: | ---: | :--- |
| **Alvin** | **DA** | TECH | 2.0 | 3 | high |
| **Alvin** | **PRO-MATIC** | MC5 | 2.0 | 1 | high |
| **BIC** | **Criterium** | LUXE | 2.0 | 3 | high |
| **Daiso** | **2mm Mechanical Pencil** |  | 2.0 | 2 | high |
| **Hapila** | **2mm mechanical pencil** | SPSHHB | 2.0 | 2 | high |
| **ito-ya** | **Wooden Sharp Pencil** | WSP | 2.0 | 4 | high |
| **Kita Boshi** | **Adult Pencil** | OTP-580 | 2.0 | 4 | high |
| **Koh-i-Noor** | **TECHNIGRAPH** | 5611 | 2.0 | 7 | low |
| **Küelox** | **3308** | 3308 | 2.0 | 1 | high |
| **M &amp; G** | **Easy Come Easy Go!** | amp-35601 | 2.0 | 3 | high |
| **Mitsubishi** | **uni** | MH-500 | 2.0 | 1 | high |
| **Mr. Pen** | **2.0** | 2.0 | 2.0 | 1 | high |
| **OHTO** | **Sharp Pencil** | APS-280E | 0.5 | 5 | medium |
| **OHTO** | **Sharp Pencil 2.0** | APS-680E | 2.0 | 6 | high |
| **OHTO** | **Wooden Pencil** | WN03-SP20 | 2.0 | 5 | high |
| **OHTO** | **Wooden Sharp** | WN01-SP5 | 0.5 | 5 | medium |
| **Pacific Arc** | **COLLEGIATE** | H-1301 | 2.0 | 2 | high |
| **Pacific Arc** | **Premium** | H-1309 | 2.0 | 2 | high |
| **Pacific Arc** | **TECH PRO** | H-1305 | 2.0 | 5 | high |
| **Redcircle** | **600** | 600 | 2.0 | 3 | high |
| **rOtring** | **Tikky** | TK12 | 0.5 | 10 | high |
| **rOtring** | **Tikky** | TK12 | 0.7 | 15 | high |
| **Staedtler** | **Mars Technico** | 780c | 2.0 | 2 | high |
| **STUDMARK** | **3750** | 3750 | 2.0 | 1 | high |
| **Unbranded** | **Metal Black** | unknown | 2.0 | 1 | high |
| **Unbranded** | **Plastic Black** | unknown | 2.0 | 1 | high |
| | | **26 Pencils** | | **95 Variants**<br />_(colours / patterns)_  | |




---

_`[Rendered with MDReadmeRenderer]`_

---



## Individual pencil's overview

### Accuracy Designations

#### low

 - Where any one of these things are true.
 - Physical pencil not present for measurement
 - Measurements of the pencil were not taken with a precision tool, and may have been estimated from supplied images.
 - The overall look of the pencil and the relative dimensions should be within reasonable and relative bounds.
 - The pencil may be based on a third party branded model that is identical to the original.
 - It is unlikely that internal measurements have any level of relative accuracy, and, where supplied have been estimated.
 - There may be a low level of accuracy of the colours of the pencil's parts.

#### medium

 - Where any one of these things are true.
 - Physical pencil present, however no precision measurement tool was used.
 - Physical pencil not present and image used for measurements, an accurate measuring scale is included with the image.
 - Not all pencil measurements were taken with a precision tool, (especially where there are internal components which access could not be gained).
 - External measurements may have been accurately measured, however internal components may not have been measured.
 - The pencil may be based on a first/third party branded model that is identical to the original.
 - The accuracy of the colours of the pencil's parts may not be reflected by the rendered images.

#### high

 - Where all of these things are true (with caveats).
 - Physical pencil used for measurements, or physical pencil not present, but source technical documents used for measurements.
 - Pencil measurements taken with a high precision tool.
 - Internal measurements may not be available due to disassembly challenges.
 - The accuracy of the colours of the pencil's parts may not be reflected by the rendered images.

#### unknown

 - The accuracy level for this mechanical pencil could not be determined.
 - The accuracy of the colours of the pencil's parts may not be reflected by the rendered images.


# Technical Details



## Directory structure

- `/data/` - for mechanical pencil data
- `/documentation/` - for documentation output, or written
- `/meta/` - directory for meta information about the generation of pencils
- `/scripts/` - scripts for running the various generators


- `/output/` - For generated files, the subdirectories are named for the output 
  file format type and will have subdirectories beneath it that are more 
  descriptive of 
  what the output contains: **NOTE:** '`This directory is designed to be 
  transient`' and can be deleted without side effects, this can be 
  re-generated by the renderer at any time.  For example, some of the file 
  formats generated are: 
  - `/output/png/` - Generated PNG files 
  - `/output/svg/` - Generated vector (SVG) files 
  - `/output/pdf/` - Generated document (PDF) files 


## Examples

### OHTO Sharp Pencil 2.0

For the file `/data/ohto/sharp-pencil-aps-680e-2.0.json`, one of the SVG files 
that is generated.

![OHTO Sharp Pencil 2.0 SVG rendering](./output/svg/technical/ohto/sharp-pencil-aps-680e-2.0.svg)

and colour variants too (both as PNGs and SVGs) - one for each colour

<img src="./output/png/technical/ohto/sharp-pencil-aps-680e-2.0-colour-black.png">

<img src="./output/png/technical/ohto/sharp-pencil-aps-680e-2.0-colour-blue.png">

<img src="./output/png/technical/ohto/sharp-pencil-aps-680e-2.0-colour-green.png">

<img src="./output/png/technical/ohto/sharp-pencil-aps-680e-2.0-colour-red.png">

<img src="./output/png/technical/ohto/sharp-pencil-aps-680e-2.0-colour-wood.png">

<img src="./output/png/technical/ohto/sharp-pencil-aps-680e-2.0-colour-yellow.png">

### Additional output files (both as PNGs and SVGs)

For the file `/data/mitsubishi/uni-mh-500-2.0.json`, examples of some of the 
output renderings.

#### Technical Component Renderer

<img src="./output/png/technical/alvin/da-tech-2.0-colour-green.png">

#### Technical Exploded Renderer

<img src="./output/png/technical/alvin/da-tech-2.0-exploded-colour-red.png">

#### Technical Grouped Renderer

<img src="./output/png/technical/alvin/da-tech-2.0-grouped.png">

### Technical Renderer

<img src="./output/png/technical/alvin/da-tech-2.0.png">

#### Pencil Renderer

<img src="./output/png/pencil/alvin/da-tech-2.0-colour-white.png">

#### Pencil 45 Renderer

<img src="./output/png/pencil/alvin/da-tech-2.0-colour-green-45.png">

#### All variants

<img src="./output/png/pencil/alvin/da-tech-2.0-all-variants.png">


## Updating CustomVector Images

All (or at least most) vector based images were made with 
[Provector](https://provector.app) which is an online and free Vector 
editing webapp.


The Saved File is a `.json` file which is stored in the 
`documentation/provector/vectors/` directory.  The export of the images are saved in 
the `documentation/provector/images` directory.

