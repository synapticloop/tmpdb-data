import {Part} from "./Part.ts";
import {ExtraPart} from "./ExtraPart.ts";

export class Extra {
	length: number;
	height: number;
	width: number;
	type: string;
	colours: string[] = []

	points: number[] = [];
	extraParts:ExtraPart[] = [];
	offset: number[] = [];

	oldconstructor(jsonObject, colours) {
		this.length = jsonObject.dimensions[0];
		this.width = jsonObject.dimensions[1];
		this.height = jsonObject.dimensions[2];
		this.offset = jsonObject.offset;

		if(jsonObject.colours) {
			this.colours = jsonObject.colours;
		} else {
			this.colours = colours;
		}

		for(const part of jsonObject.parts) {
			// this.extraParts.push(new ExtraPart(part, this.colours));
		}
	}
}