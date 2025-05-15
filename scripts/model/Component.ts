import {Part} from "./Part.ts";

export class Component {
	parts: Part[] = [];
	materials:string[] = [];
	colours:string[] = [ "white" ];
	type:string = "unknown";

	// the length of the component - which is when you are looking at it
	// sideways...
	length:number = 0;

	// the width
	maxWidth:number = 0;
	minWidth:number = 0;

	maxHeight:number = 0;
	minHeight:number = 0;

	extraParts:Part[] = [];
	extraPartFirst:boolean = false;
	hasInternal:boolean = false;
	hasEndInternal:boolean = false;
	internals:Part[] = [];
	endInternals:Part[] = [];

	constructor(jsonObject:any) {
		this.type = jsonObject.type ?? this.type;

		if(jsonObject.material) {
			this.materials.length = 0;
			this.materials.push(jsonObject.material);
		} else {
			this.materials.push("unknown");
		}

		this.colours = jsonObject.colours ?? this.colours;
		if(jsonObject.internal) {
			this.hasInternal = true;
		}
		if(jsonObject.end_internal) {
			this.hasEndInternal = true;
		}

		if(jsonObject.parts) {
			let isFirst = true;
			for(let part of jsonObject.parts) {
				const thisPart = new Part(part, this.colours);
				this.parts.push(thisPart);
				this.length += thisPart.length;

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


				let tempMaxWidth:number = thisPart.getMaxWidth();
				if(tempMaxWidth >= this.maxWidth) {
					this.maxWidth = tempMaxWidth;
				}

				let tempMinWidth:number = thisPart.getMinWidth();
				if(tempMinWidth >= this.minWidth) {
					this.minWidth = tempMinWidth;
				}

				let tempMaxHeight = thisPart.getMaxHeight();
				if(tempMaxHeight >= this.maxHeight) {
					this.maxHeight = tempMaxHeight;
				}

				let tempMinHeight = thisPart.getMinHeight();
				if(tempMinHeight >= this.minHeight) {
					this.minHeight = tempMinHeight;
				}
			}
		}

		if(jsonObject.internal) {
			for(let internal of jsonObject.internal) {
				const thisInternal = new Part(internal, this.colours);
				this.internals.push(thisInternal);
			}
		}

		if(jsonObject.end_internal) {
			for(let internal of jsonObject.end_internal) {
				const thisInternal = new Part(internal, this.colours);
				this.endInternals.push(thisInternal);
			}
		}

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