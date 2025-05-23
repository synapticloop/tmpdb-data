import {JsonProperty} from "json-object-mapper";
import "reflect-metadata";

export class OpaqueColour {
	@JsonProperty({ name: "colour", required: true })
	colour: string; // the hex code of the colour (if found in the colour map), else the name

	colourName: string; // the name of the colour
	opacity: number = 1; // the opacity - from a value of 0 to 1
	definition: string; // The definition which is the colour name % opacity (from 0 to 100)

	constructor(colourMap: Map<string, string>, colour: string) {
		if(colourMap === null) {
			colourMap = new Map<string, string>();
		}

		const splits: string[] = colour.split("%");

		this.colourName = splits[0];

		switch(splits.length) {
			case 2:
				if(colourMap.get(splits[0])) {
					this.colour = colourMap.get(splits[0]);
				} else {
					this.colour = splits[0];
				}

				let opacityTemp: number = parseInt(splits[1]);
				if (opacityTemp > 1) {
					this.opacity = opacityTemp/100;
				} else {
					this.opacity = opacityTemp;
				}
				break;
			case 1:
				if(colourMap.get(splits[0])) {
					this.colour = colourMap.get(splits[0]);
				} else {
					this.colour = splits[0];
				}

				break;
			default:
				this.colour = colour;
		}

		this.definition = this.colour + "%" + this.opacity;
	}
}