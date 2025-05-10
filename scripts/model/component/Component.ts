import {Part} from "./Part.ts";
import {Pencil} from "../Pencil.ts";

export class Component {
	parts = [];
	material:string = "unknown";
	colours:string[] = [ "white" ];
	type:string = "unknown";
	width:number = 0;
	maxWidth:number = 0;
	maxHeight:number = 0;
	extraParts = [];
	extraPartFirst:boolean = false;

	constructor(jsonObject:any) {
		this.type = jsonObject.type ?? this.type;
		this.material = jsonObject.material ?? this.material;
		this.colours = jsonObject.colours ?? this.colours;

		if(jsonObject.parts) {
			let isFirst = true;
			for(let part of jsonObject.parts) {
				const thisPart = new Part(part, this.colours);
				this.parts.push(thisPart);
				this.width += thisPart.getWidth();

				if(thisPart.extraParts.length > 0) {
					this.extraParts.push(thisPart);
					if(isFirst) {
						this.extraPartFirst = true;
					}
				}
				isFirst = false;


				let tempWidth = thisPart.getMaxWidth();
				if(tempWidth >= this.maxWidth) {
					this.maxWidth = tempWidth;
				}

				let tempHeight = thisPart.getMaxHeight();
				if(tempHeight >= this.maxHeight) {
					this.maxHeight = tempHeight;
				}
			}
		}
	}

	getWidth() {
		return(this.width);
	}

	getMaxHeight() {
		return(this.maxHeight);
	}

	getMaxWidth() {
		return(this.maxWidth);
	}

	getType() {
		return(this.type);
	}

	getMaterial() {
		return(this.material);
	}

	getExtraParts() {
		return(this.extraParts);
	}
}