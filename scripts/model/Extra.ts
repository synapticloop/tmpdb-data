import {Part} from "./Part.ts";
import {ExtraPart} from "./ExtraPart.ts";

export class Extra {
	length: number;
	height: number;
	width: number;
	type: string;

	points: number[] = [];
	isCurve: boolean = false;
	extraParts:ExtraPart[] = [];
	offset: number[] = [];

	constructor(jsonObject, colours) {
		this.length = jsonObject.dimensions[0];
		this.width = jsonObject.dimensions[1];
		this.height = jsonObject.dimensions[2];
		this.offset = jsonObject.offset;

		for(const part of jsonObject.parts) {
			this.extraParts.push(new ExtraPart(part));
		}
	}
}