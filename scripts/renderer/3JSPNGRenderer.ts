import {SVGRenderer} from "./SVGRenderer.ts";
import sharp from "sharp";
import {Pencil} from "../model/Pencil.ts";

export class PNGRenderer {
	private pencil: Pencil;

	constructor(pencil: Pencil) {
		this.pencil = pencil;
	}

	render(): void {
	}
}