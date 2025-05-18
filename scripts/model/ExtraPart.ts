export class ExtraPart {
	shape: string;
	colours: string[];
	width: number = 3.0

	points: number[] = [];
	isCurve: boolean = false;

	constructor(jsonObject, colours: string[]) {
		this.shape = jsonObject.shape;
		this.colours = colours;
		this.width = jsonObject.width ?? this.width;

		switch (this.shape) {
			case "curve":
			case "curve-fill":
				this.isCurve = true;
		}
		this.points = jsonObject.points;
	}
}