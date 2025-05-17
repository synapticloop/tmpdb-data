import {Pencil} from "../model/Pencil.ts";
import {SVGRenderer} from "./SVGRenderer.ts";

/**
 * Render a single pencil
 */
export class SVGPencilRenderer extends SVGRenderer {
	// TODO remove - put into constructor
	SVG_WIDTH: number = 1000;
	SVG_HEIGHT: number = 200;

	constructor(pencil: Pencil) {
		super(pencil, 1000, 200, "SVGPencilRenderer");
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
		let svgString:string = super.getSvgStart(this.SVG_WIDTH, this.SVG_HEIGHT, true);

		// now it is time to render the details of the pencil
		svgString += super.renderSideComponents(colourIndex);

		// end the end of the SVG
		svgString += super.getSvgEnd(this.SVG_WIDTH, this.SVG_HEIGHT);
		return(svgString);
	}
}