export class ExtraPart {
	type: string;

	points: number[] = [];
	isCurve: boolean = false;

	constructor(jsonObject) {
		this.type = jsonObject.type;
		switch (this.type) {
			case "curve":
			case "curve-fill":
				this.isCurve = true;
		}
		this.points = jsonObject.points;
	}
}