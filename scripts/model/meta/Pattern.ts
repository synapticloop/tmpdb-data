import {JsonProperty} from "json-object-mapper";
import "reflect-metadata";

export class Pattern {
	@JsonProperty({ name: "name", required: true })
	name: string; // The display name of the pattern
	@JsonProperty({ name: "description", required: true })
	description: string; // The display description for the pattern
	@JsonProperty({ name: "pattern", required: true })
	pattern: string[]; // The SVG pattern definition
	@JsonProperty({ name: "in_built", required: false })
	inBuilt: boolean = false;
}