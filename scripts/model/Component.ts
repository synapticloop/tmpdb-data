import {Part} from "./Part.ts";
import {Extra} from "./Extra.ts";
import {JsonIgnore, JsonProperty} from "json-object-mapper";
import "reflect-metadata";
import {OpaqueColour} from "./OpaqueColour.ts";
import {PartDeserialiser} from "./deserialisers/PartDeserialiser.ts";
import {ExtraDeserialiser} from "./deserialisers/ExtraDeserialiser.ts";
import {Base} from "./Base.ts";

export class Component extends Base {

	@JsonProperty({ name: "material", required: false })
	private material:string; // the materials that this component is made out of

	@JsonProperty({ name: "colours", required: false })
	private colours: string[]; // the colours of this component

	@JsonProperty({ name: "type", required: false })
	type:string; // the type of this component

	@JsonProperty({ name: "parts", required: false, type: Part, deserializer: PartDeserialiser })
	parts: Part[] = [];

	@JsonProperty({ name: "extras", required: false, type: Extra, deserializer: ExtraDeserialiser })
	extras:Extra[] = [];

	@JsonProperty({ name: "internal_start", required: false, type: Part, deserializer: PartDeserialiser })
	internalStart:Part[] = []; // the type of this component

	@JsonProperty({ name: "internal_end", required: false, type: Part, deserializer: PartDeserialiser })
	internalEnd:Part[] = []; // the type of this component


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	//
	// GENERATED METADATA BY THE postConstruct METHOD
	//
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	materials:string[] = []; // the materials that this component is made out of

	// the length of the component - which is when you are looking at it
	// sideways...
	length:number = 0;

	// the width
	maxWidth:number = 0;
	minWidth:number = 0;

	maxHeight:number = 0;
	minHeight:number = 0;

	// this is the length of the clip if it has extras...
	allLength: number = 0;
	// this is the offset of the extras (if it has any)
	allOffset: number = 0;

	internalStartLength: number = 0;
	internalEndLength: number = 0;
	hasInternalStart: boolean = false;
	hasInternalEnd: boolean = false;
	hasInternal: boolean = false;

	isHidden: boolean = false;

	postConstruct(colours: string[], colourMap: Map<string, string>): void {
		// first up we want to cascade the postConstruct
		super.mergeOpacityColours(this.colours, colours, colourMap);

		for(const part of this.parts) {
			part.postConstruct(this.mergedColours, colourMap);
		}

		for(const internalEnd of this.internalEnd) {
			internalEnd.postConstruct(this.mergedColours, colourMap);
			this.internalEndLength += internalEnd.length;
		}

		for(const internalStart of this.internalStart) {
			internalStart.postConstruct(this.mergedColours, colourMap);
			this.internalStartLength += internalStart.length;
		}

		this.materials.push(this.material);

		if(this.internalStart.length > 0) {
			this.hasInternalStart = true;
		}

		if(this.internalEnd.length > 0) {
			this.hasInternalEnd = true;
		}

		this.hasInternal = this.hasInternalStart || this.hasInternalEnd;

		for(const part of this.parts) {
			this.length += part.length;

			if(part.material) {
				this.materials.push(part.material);
			}

			let tempMaxWidth:number = part.getMaxWidth();
			if(tempMaxWidth >= this.maxWidth) {
				this.maxWidth = tempMaxWidth;
			}

			let tempMinWidth:number = part.getMinWidth();
			if(tempMinWidth >= this.minWidth) {
				this.minWidth = tempMinWidth;
			}

			let tempMaxHeight = part.getMaxHeight();
			if(tempMaxHeight >= this.maxHeight) {
				this.maxHeight = tempMaxHeight;
			}

			let tempMinHeight = part.getMinHeight();
			if(tempMinHeight >= this.minHeight) {
				this.minHeight = tempMinHeight;
			}
		}

		// this component is only hidden if it has a length of 0 and one, or both
		// internal parts
		if(this.parts.length === 0 && (this.internalStart.length !== 0 || this.internalEnd.length !== 0)) {
			this.isHidden = true;
		}


		for(const extra of this.extras) {
			extra.postConstruct(this.mergedColours, colourMap);

			if(extra.xOffset < this.allOffset) {
				this.allOffset = extra.xOffset;
			}

			if(extra.length > this.allLength) {
				this.allLength = extra.length;
			}
			// TODO - need to do multiple
		}

		if(this.allLength === 0) {
			this.allLength = this.length;
		}
	}
}