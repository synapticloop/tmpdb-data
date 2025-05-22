import {Pencil} from "../../../model/Pencil.ts";
import {SVGRenderer} from "../../SVGRenderer.ts";

/**
 * Render all the colour variants of a pencil
 */
export class SVGPencilAllRenderer extends SVGRenderer {
	SVG_WIDTH:number = 1000;
	SVG_HEIGHT:number = 200;

	constructor(pencil: Pencil) {
		super(pencil, 1000, 600, "SVGPencilAllRenderer");
	}

	/**
	 * <p>Generate the SVG as a string with the colour</p>
	 *
	 * @param colourIndex the pencil colour index
	 *
	 * @returns {string} The SVG data as a String
	 */
	render(colourIndex: number):string {

		// determine the this.SVG_HEIGHT
		this.SVG_HEIGHT = 120 + this.pencil.colourComponents.length * 120;
		super.resize(1000, this.SVG_HEIGHT);

		// start
		let svgString:string = super.getSvgStart();
		svgString += super.renderOverviewText(false);

		let midYOverride: number = 120;


		for (let i:number = 0; i < this.pencil.colourComponents.length; i++) {
			// now it is time to render the details of the pencil
			svgString += super.renderSideComponents(i, midYOverride);

			midYOverride = midYOverride + 120;
		}

		svgString += super.getSvgEnd();
		return(svgString);
	}
}