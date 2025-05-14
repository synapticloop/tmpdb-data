import {Part} from "./Part.ts";

export class Component {
	parts: Part[] = [];
	materials:string[] = [];
	colours:string[] = [ "white" ];
	type:string = "unknown";

	width:number = 0;
	maxWidth:number = 0;
	minWidth:number = 0;
	maxHeight:number = 0;
	minHeight:number = 0;

	extraParts = [];
	extraPartFirst:boolean = false;

	constructor(jsonObject:any) {
		this.type = jsonObject.type ?? this.type;

		if(jsonObject.material) {
			this.materials.length = 0;
			this.materials.push(jsonObject.material);
		} else {
			this.materials.push("unknown");
		}

		this.colours = jsonObject.colours ?? this.colours;

		if(jsonObject.parts) {
			let isFirst = true;
			for(let part of jsonObject.parts) {
				const thisPart = new Part(part, this.colours);
				this.parts.push(thisPart);
				this.width += thisPart.width;

				if(part.material) {
					this.materials.push(part.material);
				}

				if(part.colours) {
					for(const colour of part.colours) {
						this.colours.push(colour);
					}
				}

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

	getExtraParts() {
		return(this.extraParts);
	}
}