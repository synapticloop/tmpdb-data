import {Part} from "./Part.ts";
import {ExtraPart} from "./ExtraPart.ts";
import {Base} from "./Base.ts";
import {JsonProperty} from "json-object-mapper";
import {ExtraPartDeserialiser} from "./deserialisers/ExtraPartDeserialiser.ts";

export class Extra extends Base{
	@JsonProperty({ name: "dimensions", required: true } )
	private dimensions: number[];
	@JsonProperty( { name: "parts", type: ExtraPart, deserializer: ExtraPartDeserialiser, required: true } )
	extraParts:ExtraPart[] = [];

	// TODO PRIVATE
	@JsonProperty( { name: "offset", required: true } )
	private offset: number[] = [];

	@JsonProperty( { name: "colours", required: false } )
	private colours: string[] = []

	length: number;
	height: number;
	depth: number;

	xOffset: number;
	yOffset: number;

	postConstruct(colours: string[], colourMap: Map<string, string>): void {
		super.mergeOpacityColours(this.colours, colours, colourMap);

		this.length = this.dimensions[0];
		this.height = this.dimensions[1];
		this.depth = this.dimensions[2];

		this.xOffset = this.offset[0];
		this.yOffset = this.offset[1];
	}
}