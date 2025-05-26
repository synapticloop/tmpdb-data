import {JsonIgnore, JsonProperty} from "json-object-mapper";
import "reflect-metadata";
import {Base} from "./Base.ts";
import {OpaqueColour} from "./meta/OpaqueColour.ts";

export class ExtraPart extends Base {
	// private properties
	@JsonProperty({ name: "colours", required: false })
	private colours: string[];

	// required properties
	@JsonProperty({ name: "shape", required: true })
	shape: string;
	@JsonProperty({ name: "points", required: true })
	points: number[] = [];

	// other properties
	@JsonProperty({ name: "width", required: false })
	width: number = 3.0

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	//
	// GENERATED METADATA BY THE postConstruct METHOD
	//
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	isCurve: boolean = false;

	postConstruct(colours: string[], colourMap: Map<string, string>): void {
		switch (this.shape) {
			case "curve":
			case "curve-fill":
				this.isCurve = true;
		}

		super.mergeOpacityColours(this.colours, colours, colourMap);
	}
}