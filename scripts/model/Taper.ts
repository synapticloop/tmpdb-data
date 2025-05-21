import {JsonIgnore, JsonProperty} from "json-object-mapper";
import "reflect-metadata";
import {OpacityColour} from "./OpacityColour.ts";
import {Base} from "./Base.ts";

export class Taper extends Base {
	@JsonProperty({ name: "offset", required: true })
	offset: number[];
	@JsonProperty({ name: "background_colours", required: false })
	private backgroundColours: string[];


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	//
	// GENERATED METADATA BY THE postConstruct METHOD
	//
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	backgroundOpacityColours: OpacityColour[];

	postConstruct(colours: string[], colourMap: { [p: string]: string }): void {
		for(const backgroundColour of this.backgroundColours) {
			this.backgroundOpacityColours.push(new OpacityColour(colourMap, backgroundColour));
		}
	}
}