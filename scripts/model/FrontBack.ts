import {JsonIgnore, JsonProperty} from "json-object-mapper";
import "reflect-metadata";
import {OpaqueColour} from "./OpaqueColour.ts";

export class FrontBack {
	@JsonProperty({ name: "shape", required: true })
	shape: string; // the shape of the front/back piece

	@JsonProperty({ name: "dimensions", required: true })
	dimensions: number[]; // the dimensions of the front/back piece

	@JsonIgnore()
	fill: OpaqueColour;
}