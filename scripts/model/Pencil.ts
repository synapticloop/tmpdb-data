import { Component } from "./Component.ts";

export class Pencil {
	// the name of the pencil
	modelName:string = "";
	modelNumber:string = "";
	// the brand of the pencil
	brand:string = "";
	// the lead size
	leadSize:string = "";
	// the lead shape - which defaults to 'cylindrical'
	leadShape: string = "cylindrical";
	maximumLeadLength: number;
	// the components that make up the pencil
	components:Component[] = [];
	// the text that is written on the pencil
	text:string = "";

	mechanism:string = "";
	// the maximum width of the pencil (generated)
	maxWidth:number = 0;
	// the maximum height of the pencil (generated)
	maxHeight:number = 0;
	// the total length of the pencil (generated)
	totalLength:number = 0

	// The materials that make up this pencil - to keep them in order of definition
	materials:string[] = [];
	// the set of materials for this pencil - which is used to de-duplicate
	materialsSet = new Set();
	// the colour component that defines the differences
	colourComponent:string = "";
	// the colour components
	colourComponents:string[] = [ "white" ];
	// the weight of the pencil
	weight:number = null;
	front = [];
	back = [];
	// a map of colour names to HTML # values
	colourMap: { [id: string]: string; } = { };
	model = {};
	skus:string[] = [];

	// whether the pencil has internal parts chich means that the pencil can be
	// disassembled (possibly) - maybe someone is just keen and has ruined the
	// pencil
	hasInternal:boolean = false;
	hasHidden:boolean = false;

	/**
	 * <p></p>
	 *
	 * @param pencilDataString The JSON data of the Pencil
	 */
	constructor(pencilDataString: string) {
		const pencilJSONData:any = JSON.parse(pencilDataString);

		this.colourComponent = pencilJSONData.colour_component ?? this.colourComponent;
		this.colourMap = pencilJSONData.colour_map ?? this.colourMap;

		this.modelName = pencilJSONData.model_name ?? this.modelName;
		this.modelNumber = pencilJSONData.model_number ?? this.modelNumber;
		this.mechanism = pencilJSONData.mechanism ?? this.mechanism;

		this.front = pencilJSONData.front ?? this.front;
		this.back = pencilJSONData.back ?? this.back;
		this.skus = pencilJSONData.skus ?? this.skus;
		this.weight = pencilJSONData.weight ?? this.weight;

		// go through and look for the colour component, this will be the
		// base colours if not over-ridden
		for(const component of pencilJSONData.components) {
			if (component.type === this.colourComponent) {
				this.colourComponents = component.colours;
			}
		}

		for(const component of pencilJSONData.components) {
			const thisComponent = new Component(component, this.colourComponents);

			if(thisComponent.hasInternalStart || thisComponent.hasInternalEnd) {
				this.hasInternal = true;
			}

			if(thisComponent.isHidden) {
				this.hasHidden = true;
			}

			this.components.push(thisComponent);
			this.totalLength += thisComponent.length;

			if(thisComponent.type === this.colourComponent) {
				this.colourComponents = thisComponent.colours;
			}

			let tempWidth:number = thisComponent.maxWidth;
			if(tempWidth > this.maxWidth) {
				this.maxWidth = tempWidth;
			}

			let tempHeight: number = thisComponent.maxHeight;
			if(tempHeight > this.maxHeight) {
				this.maxHeight = tempHeight;
			}

			const componentMaterials = thisComponent.materials;

			for(const componentMaterial of componentMaterials) {
				if(!this.materialsSet.has(componentMaterial)) {
					this.materials.push(componentMaterial);
					this.materialsSet.add(componentMaterial);
				}
			}
		}

		this.brand = pencilJSONData.brand ?? this.brand;
		this.model = pencilJSONData.model ?? this.model;

		this.leadSize = pencilJSONData.lead_size ?? this.leadSize;
		this.leadShape = pencilJSONData.lead_shape ?? this.leadShape;
		this.maximumLeadLength = pencilJSONData.maximum_lead_length ?? this.maximumLeadLength;
		this.text = pencilJSONData.text ?? this.text;
	}
}