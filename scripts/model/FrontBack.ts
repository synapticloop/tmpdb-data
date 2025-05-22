import {JsonIgnore, JsonProperty} from "json-object-mapper";
import "reflect-metadata";
import {OpaqueColour} from "./OpaqueColour.ts";
import {Base} from "./Base.ts";

export class FrontBack extends Base {
	@JsonProperty({ name: "shape", required: true })
	shape: string; // the shape of the front/back piece

	@JsonProperty({ name: "dimensions", required: true })
	private dimensions: number[]; // the dimensions of the front/back piece

	@JsonProperty({ name: "fill", required: false })
	private fill: string[];

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	//
	// GENERATED METADATA BY THE postConstruct METHOD
	//
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	// TODO - sort this out
	fillColour: OpaqueColour;
	width: number;
	length: number;


	postConstruct(colours: string[], colourMap: Map<string, string>): void {
		super.mergeOpacityColours(this.fill, colours, colourMap);
		this.width = this.dimensions[0];
		this.length = this.dimensions[1];
	}
}