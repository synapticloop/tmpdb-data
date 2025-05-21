import {JsonProperty} from "json-object-mapper";
import "reflect-metadata";

export class Feature {
	@JsonProperty({ name: "type", required: true })
	type: string; // the type of the feature - e.g. eraser, sharpener

	@JsonProperty({ name: "location", required: false })
	location: string; // the location of the feature - e.g. - inside cap
}