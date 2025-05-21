import {JsonIgnore, JsonProperty} from "json-object-mapper";
import "reflect-metadata";

export class ExtraPart extends Base{
	@JsonProperty({ name: "shape", required: true })
	shape: string;
	@JsonProperty({ name: "points", required: true })
	points: number[] = [];

	@JsonProperty({ name: "colours", required: false })
	private colours: string[];

	width: number = 3.0
	isCurve: boolean = false;

	postConstruct(colours: string[], colourMap: { [id: string]: string; }): void {
		// TODO
	}

	oldconstructor(jsonObject, colours: string[]) {
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