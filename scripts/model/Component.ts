import {Part} from "./Part.ts";
import {Extra} from "./Extra.ts";

export class Component {
	parts: Part[] = [];
	extras:Extra[] = [];

	// the materials that this component is made out of
	materials:string[] = [];
	// the colours of this component
	colours:string[] = [ "white" ];
	// the type of this component
	type:string = "unknown";

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

	internalStart:Part[] = [];
	internalEnd:Part[] = [];

	isHidden: boolean = false;

	constructor(jsonObject:any) {
		this.type = jsonObject.type ?? this.type;

		if(jsonObject.material) {
			this.materials.length = 0;
			this.materials.push(jsonObject.material);
		} else {
			this.materials.push("unknown");
		}

		this.colours = jsonObject.colours ?? this.colours;

		if(jsonObject.internal_start) {
			this.hasInternalStart = true;
		}

		if(jsonObject.internal_end) {
			this.hasInternalEnd = true;
		}

		if(jsonObject.parts) {
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

		if(jsonObject.extras) {
			for(let extra of jsonObject.extras) {
				const thisExtra: Extra = new Extra(extra, this.colours);

				this.extras.push(thisExtra);

				// if(thisExtra.material) {
				// 	this.materials.push(thisExtra.material);
				// }

				// if(thisExtra.colours) {
				// 	for(const colour of extraPart.colours) {
				// 		this.colours.push(colour);
				// 	}
				// }
			}
		}

		if(jsonObject.internal_start) {
			for(let internal of jsonObject.internal_start) {
				const thisInternal = new Part(internal, this.colours);
				this.internalStart.push(thisInternal);
			}
		}

		if(jsonObject.internal_end) {
			for(let internal of jsonObject.internal_end) {
				const thisInternal = new Part(internal, this.colours);
				this.internalEnd.push(thisInternal);
			}
		}

		// this component is only hidden if it has a length of 0 and one, or both
		// internal parts
		if(this.parts.length === 0 && (this.internalStart.length !== 0 || this.internalEnd.length !== 0)) {
			this.isHidden = true;
		}
	}
}