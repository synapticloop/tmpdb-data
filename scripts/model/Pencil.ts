import { Component } from "./component/Component.ts";

export class Pencil {
	// the name of the pencil
	name:string = "";
	// the brand of the pencil
	brand:string = "";
	// the lead size
	leadSize:string = "";
	// the components that make up the pencil
	components:Component[] = [];
	// the text that is written on the pencil
	text:string = "";

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
	// the model number
	modelNumber:String = null;
	front = [];
	back = [];
	// a map of colour names to HTML # values
	colourMap: { [id: string]: string; } = { };
	model = {};
	skus:string[] = [];

	/**
	 * <p></p>
	 *
	 * @param pencilDataString The JSON data of the Pencil
	 */
	constructor(pencilDataString: string) {
		const pencilJSONData:any = JSON.parse(pencilDataString);

		this.colourComponent = pencilJSONData.colour_component ?? this.colourComponent;
		this.colourMap = pencilJSONData.colour_map ?? this.colourMap;
		this.modelNumber = pencilJSONData.model_number ?? this.modelNumber;

		this.front = pencilJSONData.front ?? this.front;
		this.back = pencilJSONData.back ?? this.back;
		this.skus = pencilJSONData.skus ?? this.skus;

		for(const component of pencilJSONData.components) {
			const thisComponent = new Component(component);
			this.components.push(thisComponent);
			this.totalLength += thisComponent.getWidth()

			if(thisComponent.type === this.colourComponent) {
				this.colourComponents = thisComponent.colours;
			}

			let tempWidth = thisComponent.getMaxWidth();
			if(tempWidth >= this.maxWidth) {
				this.maxWidth = tempWidth;
			}
			let tempHeight = thisComponent.getMaxHeight();
			if(tempHeight >= this.maxHeight) {
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
		this.text = pencilJSONData.text ?? this.text;
	}

	getTotalLength() { return(this.totalLength); }
}