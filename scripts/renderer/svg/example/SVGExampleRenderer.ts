import {Pencil} from "../../../model/Pencil.ts";
import {SVGRenderer} from "../../SVGRenderer.ts";
import {
	dimensionsHorizontal,
	drawText,
	drawTextBoldCentred,
	lineHorizontal, lineVertical,
	TextOrientation
} from "../../../utils/svg-helper.ts";
import {formatToTwoPlaces} from "../../../utils/formatter.ts";
import {Component} from "../../../model/Component.ts";

/**
 * Render all the colour variants of a pencil
 */
export class SVGExampleRenderer extends SVGRenderer {
	SVG_WIDTH:number = 1000;
	SVG_HEIGHT:number = 200;

	constructor(pencil: Pencil) {
		super(pencil, 1000, 600, "SVGExampleRenderer");

	}

	/**
	 * <p>Generate the SVG as a string with the colour</p>
	 *
	 * @param colourIndex the pencil colour index
	 *
	 * @returns {string} The SVG data as a String
	 */
	render(colourIndex: number):string {

		// NOW GO THROUGH AND COUNT THE CLIPS
		super.resize(1000, 200 + this.pencil.components.length * 120);


		let svgString:string = super.getSvgStart();
		svgString += super.renderOverviewText(false);
		svgString += super.renderCentreLineVertical(this._width/2);

		let midY: number = 150;
		for(const component of this.pencil.components){
			svgString += drawTextBoldCentred(component.type, this._width/2, midY - 60, "1.0em");
			svgString += super.renderComponent(this._width/2 + (component.allLength + component.allOffset)/2 * 5, midY, component, colourIndex);
			midY += 120;
		}

		svgString += super.getSvgEnd();
		return(svgString);
	}
}