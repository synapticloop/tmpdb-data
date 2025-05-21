import {JsonProperty} from "json-object-mapper";
import "reflect-metadata";

export class OpaqueColour {
	@JsonProperty({ name: "colour", required: true })
	colour: string; // the hex code of the colour (if found in the colour map), else the name

	colourName: string; // the name of the colour
	opacity: number = 1;
	definition: string;

	constructor(colourMap: { [ id: string ] : string }, colour: string) {
		if(colourMap === null) {
			colourMap = {};
		}

		this.colourName = colour;

		const splits: string[] = colour.split("%");
		switch(splits.length) {
			case 2:
				if(colourMap[splits[0]]) {
					this.colour = colourMap[splits[0]];
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
				if(colourMap[splits[0]]) {
					this.colour = colourMap[splits[0]];
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