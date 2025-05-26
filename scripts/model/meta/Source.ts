import {JsonIgnore, JsonProperty} from "json-object-mapper";
import "reflect-metadata";
import {Base} from "../Base.ts";

export class Source {
	@JsonProperty({ name: "name", required: true })
	name: string;
	@JsonProperty({ name: "url", required: true })
	url: string;
}