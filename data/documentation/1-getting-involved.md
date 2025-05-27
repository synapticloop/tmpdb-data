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

## Adding pencil details

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

Where the JSON file does not include the `accuracy` key.

