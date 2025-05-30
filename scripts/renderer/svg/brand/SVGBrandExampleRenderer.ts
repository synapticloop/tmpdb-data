import {Pencil} from "../../../model/Pencil.ts";
import {SVGRenderer} from "../SVGRenderer.ts";
import {
	dimensionsHorizontal,
	drawText,
	drawTextBoldCentred,
	lineHorizontal, lineVertical,
	TextOrientation
} from "../../../utils/svg-helper.ts";
import {formatToOnePlace, formatToTwoPlaces} from "../../../utils/formatter.ts";
import {Component} from "../../../model/Component.ts";

/**
 * Render all the colour variants of a pencil
 */
export class SVGBrandExampleRenderer extends SVGRenderer {
	SVG_WIDTH:number = 1000;
	SVG_HEIGHT:number = 200;

	pencils: Pencil[];

	constructor(pencil: Pencil) {
		super(pencil, 1400, 600, "SVGBrandExampleRenderer");
	}

	static constructWithPencils(pencils: Pencil[]):SVGBrandExampleRenderer {
		const svgBrandExampleRenderer = new SVGBrandExampleRenderer(pencils[0]);
		svgBrandExampleRenderer.pencils = pencils;
		return(svgBrandExampleRenderer);
	}

	/**
	 * <p>Generate the SVG as a string with the colour</p>
	 *
	 * @param colourIndex the pencil colour index
	 *
	 * @returns {string} The SVG data as a String
	 */
	render(colourIndex: number):string {

		super.resize(this._width, 200 + this.pencils.length * 120);


		let svgString:string = super.getSvgStart();
		svgString += drawTextBoldCentred(`${this.pencil.brand} Pencils`, this._width/2, 60, "2.4em");

		let y: number = 160;

		for(const pencilTemp of this.pencils) {
			this.pencil = pencilTemp;
			svgString += super.renderCentreLineHorizontal(y, 40, 40);
			svgString += super.renderSideComponents(this._width/2 - this.pencil.totalLength/2 * 5, y, -1)
			svgString += drawTextBoldCentred(`${this.pencil.modelName} - ${this.pencil.modelNumber} (${formatToOnePlace(this.pencil.leadSize)} mm)`, this._width/2, y + 40, "1.2em");
			y += 120;
		}

		svgString += super.getSvgEnd();
		return(svgString);
	}
}