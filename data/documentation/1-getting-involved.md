# Welcome to the Mechanical Pencil Database _(data section)_

This repository contains data on collected mechanical pencils, which can 
then be used to render various outputs (thing `svg`, `png`, `pdf`, etc.).

The file format is JSON 

## Getting involved

There are many ways to get involved:

1. You could look through the (TODO - link to output directory of pencils 
   that need more information) pencil files that need more information and 
   add them (through a pull request, or raising of an issue).
1. Add new pencil with measurements (at whatever accuracy)

# Adding Pencil Details

## Directory (brand) naming

For any new brands, the directory name should 

 - be **ALL** lowercased
 - **NO** non alphanumeric characters.
 - Have **NO** whitespace - replace all whitespace with hyphens ('-')
 - Have **NO** diacritical marks (e.g. à, è, ç, ô, Ä, ŭ, ō, ñ) 

This is to provide naming consistency and to avoid any issues with reading or 
writing files on various operating systems.

## File naming

Each pencil should reside in the brand directory and named as follows

`<model_name>-<model_number>-<lead_size>.json`


### Accuracy levels

#### 'High' accuracy 

When assigning an accuracy level to a json file, the general rule is that 
the only time it will be `high` is when the physical pencil is present and a 
precision measuring device is used (think micrometer).  The only other 
pencil that will have a `high` rating is where the original technical 
schematics/designs are available and are used for the measurements.

#### 'Medium' accuracy

#### 'Low' accuracy

#### 'Unknown' accuracy

Where the JSON file does not include the `accuracy` key, it will be set to this.

