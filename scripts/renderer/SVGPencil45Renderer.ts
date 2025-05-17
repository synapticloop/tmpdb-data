import {Pencil} from "../model/Pencil.ts";
import {SVGRenderer} from "./SVGRenderer.ts";

export class SVGPencil45Renderer extends SVGRenderer {
	SVG_WIDTH: number = 1000;
	SVG_HEIGHT: number = 1000;

	constructor(pencil: Pencil) {
		super(pencil, 1000, 1000, "SVGPencil45Renderer");
	}

	/**
	 * <p>Generate the SVG as a string with the colour</p>
	 *
	 * @param colourIndex the pencil colour index
	 *
	 * @returns {string} The SVG data as a String
	 */
	render(colourIndex: number):string {
		// start
		let svgString:string = this.getSvgStart(this.SVG_WIDTH, this.SVG_HEIGHT, false, -45);

		// now it is time to render the details of the pencil
		svgString += this.renderSideComponents(colourIndex);

		// end the end of the SVG
		svgString += this.getSvgEnd(this.SVG_WIDTH, this.SVG_HEIGHT);

		return(svgString);
	}
}