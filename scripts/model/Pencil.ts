import { Component } from "./Component.ts";
import {JsonIgnore, JsonProperty} from "json-object-mapper";
import "reflect-metadata";
import {OpacityColour} from "./OpacityColour.ts";
import {Feature} from "./Feature.ts";
import {Base} from "./Base.ts";
import {FrontBack} from "./FrontBack.ts";

export class Pencil extends Base {
	@JsonProperty({ name: "brand", required: true })
	brand: string; // the brand of the pencil
	@JsonProperty({ name: "model_name", required: true })
	modelName: string; // the name of the pencil
	@JsonProperty({ name: "model_number", required: false })
	modelNumber: string; // the model number of the pencil
	@JsonProperty({ name: "lead_size", required: true })
	leadSize: number; // the lead size
	@JsonProperty({ name: "lead_shape", required: false })
	leadShape: string = "cylindrical"; // the lead shape - which defaults to 'cylindrical'
	@JsonProperty({ name: "text", required: false })
	text:string = ""; // the text that is written on the pencil
	@JsonProperty({ name: "maximum_lead_length", required: false })
	maximumLeadLength: number; // the maximum length of lead that will fit in the pencil
	@JsonProperty({ name: "mechanism", required: true })
	mechanism: string = "";
	@JsonProperty({ name: "weight", required: false })
	weight: number;
	@JsonProperty({ name: "colour_component", required: true })
	colourComponent: string = ""; // the colour component that defines the differences
	@JsonProperty({ name: "colours", required: true })
	private colours: string[] = []; // the colours of the pencil
	@JsonProperty({ name: "colour_map", required: false })
	colourMap: { [id: string]: string} = {}; // the map of named colours to hex colour codes
	@JsonProperty({ name: "accurate", required: false })
	accurate: boolean = false;
	@JsonProperty({ name: "features", required: false })
	features: Feature[] = [];
	@JsonProperty({ name: "front", required: false })
	front: FrontBack[];
	@JsonProperty({ name: "back", required: false })
	back: FrontBack[];
	@JsonProperty({ name: "components", required: false })
	components: Component[] = []; // the components that make up the pencil
	@JsonProperty({ name: "skus", required: false })
	skus: string[] = []; // the components that make up the pencil

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	//
	// GENERATED METADATA BY THE postConstruct METHOD
	//
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	colourComponents: OpacityColour[] = [];
	maxWidth:number = 0; // the maximum width of the pencil (generated)
	maxHeight:number = 0; // the maximum height of the pencil (generated)
	totalLength:number = 0; // the total length of the pencil (generated)
	materials:string[] = []; // The materials that make up this pencil - to keep them in order of definition

	// whether the pencil has internal parts chich means that the pencil can be
	// disassembled (possibly) - maybe someone is just keen and has ruined the
	// pencil

	hasInternal:boolean = false; // whether this has internal parts
	hasHidden:boolean = false; // whether this pencil has hidden parts

	postConstruct(colours: string[], colourMap: { [id: string]: string}): void {
		// first up we need to parse the colours
		for(const colour of this.colours) {
			this.colourComponents.push(new OpacityColour(this.colourMap, colour));
		}

		const materialsSet: Set<string> = new Set();

		for(const component of this.components) {
			component.postConstruct(this.colours, this.colourMap);

			if(component.hasInternalStart || component.hasInternalEnd) {
				this.hasInternal = true;
			}

			if(component.isHidden) {
				this.hasHidden = true;
			}

			this.totalLength += component.length;

			let tempWidth:number = component.maxWidth;
			if(tempWidth > this.maxWidth) {
				this.maxWidth = tempWidth;
			}

			let tempHeight: number = component.maxHeight;
			if(tempHeight > this.maxHeight) {
				this.maxHeight = tempHeight;
			}

			const componentMaterials: string[] = component.materials;

			for(const componentMaterial of componentMaterials) {
				if(!materialsSet.has(componentMaterial)) {
					this.materials.push(componentMaterial);
					materialsSet.add(componentMaterial);
				}
			}
		}
	}

	getColours(): string[] {
		return(this.colours);
	}
}