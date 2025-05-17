import {SVGTechnicalRenderer} from "./SVGTechnicalRenderer.ts";
import sharp from "sharp";
import {Pencil} from "../model/Pencil.ts";

export class OpenSCADRenderer {
	private pencil: Pencil;

	constructor(pencil: Pencil) {
		this.pencil = pencil;
	}

	render(): string {
		let scadString: string = "rotate([90, 0, 0]) {\n";
		let x:number = 0;
		for(const [index, component] of this.pencil.components.entries()) {
			for(const part of component.parts) {
				scadString += `translate([0, 0, ${x}]) \n`
				scadString += `  color("${component.colours[0]}") \n`
				switch (part.shape) {
					case "cylinder":
						scadString += `    cylinder(${part.length}, ${part.startHeight}, ${part.endHeight}, $fn=360);\n`;
						x = x + part.length;
						break;
					case "hexagonal":
						scadString += `    cylinder(${part.length}, ${part.startHeight}, ${part.endHeight}, $fn=6, false);\n`;
						x = x + part.length;
						break;
				}
			}
		}

		scadString += `}\n`;
		return(scadString);
	}
}