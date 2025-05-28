import { Component } from "./Component.ts";
import {JsonIgnore, JsonProperty, ObjectMapper, Deserializer } from "json-object-mapper";
import "reflect-metadata";
import {OpaqueColour} from "./meta/OpaqueColour.ts";
import {Feature} from "./meta/Feature.ts";
import {FrontBack} from "./FrontBack.ts";
import {ComponentDeserialiser} from "./deserialisers/ComponentDeserialiser.ts";
import {MapDeserialiser} from "./deserialisers/MapDeserialiser.ts";
import {Base} from "./Base.ts";
import {FrontBackDeserialiser} from "./deserialisers/FrontBackDeserialiser.ts";
import {FeatureDeserialiser} from "./deserialisers/FeatureDeserialiser.ts";
import {dimensionsHorizontal, TextOrientation} from "../utils/svg-helper.ts";
import {formatToTwoPlaces} from "../utils/formatter.ts";

export class Pencil extends Base {
	@JsonProperty({ name: "brand", required: true })
	brand: string; // the brand of the pencil
	@JsonProperty({ name: "model_name", required: true })
	modelName: string; // the name of the pencil
	@JsonProperty({ name: "model_number", required: false })
	modelNumber: string; // the model number of the pencil
	@JsonProperty({ name: "skus", required: false })
	skus: string[] = []; // the components that make up the pencil

	@JsonProperty({ name: "text", required: false })
	text:string = ""; // the text that is written on the pencil

	@JsonProperty({ name: "manufactured_in", required: false })
	manufacturedIn: string = "unknown";
	@JsonProperty({ name: "manufactured_from", required: false })
	manufacturedFrom: string[] = [];
	@JsonProperty({ name: "manufactured_to", required: false })
	manufacturedTo: string[] = [];

	@JsonProperty({ name: "accuracy", required: false })
	accuracy: string = "unknown";

	@JsonProperty({ name: "mechanism", required: true })
	mechanism: string = "";
	@JsonProperty({ name: "lead_size", required: true })
	leadSize: number; // the lead size
	@JsonProperty({ name: "lead_shape", required: false })
	leadShape: string = "cylindrical"; // the lead shape - which defaults to 'cylindrical'

	@JsonProperty({ name: "maximum_lead_length", required: false })
	maximumLeadLength: number; // the maximum length of lead that will fit in the pencil
	@JsonProperty({ name: "number_leads", required: false })
	numberLeads: number = 1; // the maximum length of lead that will fit in the pencil
	@JsonProperty({ name: "weight", required: false })
	weight: number;

	@JsonProperty({ name: "features", required: false, type: Feature, deserializer: FeatureDeserialiser })
	features: Feature[] = [];

	@JsonProperty({ name: "colour_component", required: true })
	colourComponent: string = ""; // the colour component that defines the differences
	@JsonProperty({ name: "colours", required: true })
	private colours: string[] = []; // the colours of the pencil
	@JsonProperty({ name: "colour_map", required: false, deserializer: MapDeserialiser })
	colourMap: Map<string, string> = new Map<string, string>(); // the map of named colours to hex colour codes

	@JsonProperty({ name: "front", required: false, type: FrontBack, deserializer: FrontBackDeserialiser })
	front: FrontBack[] = [];
	@JsonProperty({ name: "back", required: false, type: FrontBack, deserializer: FrontBackDeserialiser })
	back: FrontBack[] = [];

	@JsonProperty({ name: "components", required: true, type: Component, deserializer: ComponentDeserialiser})
	components: Component[] = []; // the components that make up the pencil

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	//
	// GENERATED METADATA BY THE postConstruct METHOD
	//
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	colourVariants: String[] = [];
	colourComponents: OpaqueColour[] = [];

	featureDescriptions: string[] = [];

	maxWidth:number = 0; // the maximum width of the pencil (generated)
	maxHeight:number = 0; // the maximum height of the pencil (generated)
	totalLength:number = 0; // the total length of the pencil (generated)
	materials:string[] = []; // The materials that make up this pencil - to keep them in order of definition

	// whether the pencil has internal parts chich means that the pencil can be
	// disassembled (possibly) - maybe someone is just keen and has ruined the
	// pencil
	hasInternal:boolean = false; // whether this has internal parts - i.e. attached to an externally visible part
	hasHidden:boolean = false; // whether this pencil has hidden parts - i.e. not external at all


	// now for the grouped components

	tipGroupedComponent: Component[] = [];
	tipGroupedComponentOffset: number = 0;
	tipGroupedComponentLength: number = 0;

	bodyGroupedComponent: Component[] = [];
	bodyGroupedComponentOffset: number = 0;
	bodyGroupedComponentLength: number = 0;

	gripGroupedComponent: Component;
	gripGroupedComponentOffset: number = 0;
	gripGroupedComponentLength: number = 0;

	clipGroupedComponent: Component;
	clipGroupedComponentOffset: number = 0;
	clipGroupedComponentLength: number = 0;

	capGroupedComponent: Component[] = [];
	capGroupedComponentOffset: number = 0;
	capGroupedComponentLength: number = 0;

	postConstruct(colours: string[], colourMap: Map<string, string>): void {
		// first up we need to parse the colours
		for(const colour of this.colours) {
			const opaqueColour = new OpaqueColour(this.colourMap, colour);
			this.colourComponents.push(opaqueColour);
			this.colourVariants.push(opaqueColour.colourName);
		}

		for(const feature of this.features) {
			this.featureDescriptions.push(feature.featureDescription());

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

		for(const front of this.front) {
			front.postConstruct(this.colours, colourMap);
		}

		for(const back of this.back) {
			back.postConstruct(this.colours, colourMap)
		}

		this.groupComponents();
	}

	/**
	 * Group the components into the following groupings:
	 *  - tip (components - everything up to the body/grip)
	 *  - body (components - everything between the tip and the cap
	 *  - cap (components - everything that is cap onwards)
	 *
	 *  Additionally, there are two more specific components
	 *  - grip (single component named 'grip')
	 *  - clip (single component named 'clip'
	 *
	 * @private - no touchy-touchy externally :)
	 */
	private groupComponents(): void {
		let currentOffset: number = 0;

		let drawComponents: Component[] = [];

		// the tip is always offset of 0
		this.tipGroupedComponentOffset = 0;

		for(const component of this.components) {
			// push the component into the array
			drawComponents.push(component);
			currentOffset += component.length;

			if(component.type === "tip") {
				// found the tip, push all drawcomponents to the tip component

				this.tipGroupedComponent = drawComponents;
				this.bodyGroupedComponentOffset = currentOffset;

				drawComponents.length = 0;
			}

			if(component.type === "cap") {
				// now that we are at the cap - everything left in the draw components
				// will be body

				// need to remove the cap
				drawComponents.pop();
				this.bodyGroupedComponent = drawComponents;
				this.capGroupedComponentOffset = currentOffset;
				// we need to add it back
				drawComponents.push(component);
			}

			if(component.type === "grip") {
				this.gripGroupedComponent = component;
				this.gripGroupedComponentOffset = currentOffset - component.length;
			}

			if(component.type === "clip") {
				this.clipGroupedComponent = component;
				this.clipGroupedComponentOffset = currentOffset - component.length;
			}

		}

		// now whatever is left is the cap
		this.capGroupedComponent = drawComponents;
	}

	getColours(): string[] {
		return(this.colours);
	}
}