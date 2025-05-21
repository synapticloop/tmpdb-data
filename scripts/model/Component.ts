import {Part} from "./Part.ts";
import {Extra} from "./Extra.ts";
import {JsonIgnore, JsonProperty} from "json-object-mapper";
import "reflect-metadata";
import {Base} from "./Base.ts";
import {OpacityColour} from "./OpacityColour.ts";

export class Component extends Base {

	@JsonProperty({ name: "material", required: false })
	private material:string; // the materials that this component is made out of

	@JsonProperty({ name: "color", required: false })
	private colours:string[]; // the colours of this component

	@JsonProperty({ name: "type", required: true })
	type:string; // the type of this component

	@JsonProperty({ name: "parts", required: false })
	parts: Part[] = [];

	@JsonProperty({ name: "extras", required: false })
	extras:Extra[] = [];

	@JsonProperty({ name: "internal_start", required: false })
	internalStart:Part[] = []; // the type of this component

	@JsonProperty({ name: "internal_end", required: false })
	internalEnd:Part[] = []; // the type of this component


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	//
	// GENERATED METADATA BY THE postConstruct METHOD
	//
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	materials:string[] = []; // the materials that this component is made out of
	opacityColours: OpacityColour[] = [];

	// the length of the component - which is when you are looking at it
	// sideways...
	length:number = 0;

	// the width
	maxWidth:number = 0;
	minWidth:number = 0;

	maxHeight:number = 0;
	minHeight:number = 0;

	hasInternalStart:boolean = false;
	hasInternalEnd:boolean = false;

	isHidden: boolean = false;

	postConstruct(colours: string[], colourMap: { [id: string]: string}): void {
		if(this.colours.length === 0) {
			this.colours = colours;
		}

		// now go through and map the colours
		for(const colour of this.colours) {
			this.opacityColours.push(new OpacityColour(colourMap, colour));
		}

		this.materials.push(this.material);

		if(this.internalStart.length > 0) {
			this.hasInternalStart = true;
		}

		if(this.internalEnd.length > 0) {
			this.hasInternalEnd = true;
		}

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
	}
}