export class ExtraPart {
	type: string;
	colours: string[];

	points: number[] = [];
	isCurve: boolean = false;

	constructor(jsonObject, colours: string[]) {
		this.type = jsonObject.type;
		this.colours = colours;
		switch (this.type) {
			case "curve":
			case "curve-fill":
				this.isCurve = true;
		}
		this.points = jsonObject.points;
	}
}