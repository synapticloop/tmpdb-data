import {Pencil} from "../../../model/Pencil.ts";
import {SVGRenderer} from "../SVGRenderer.ts";
import {
	circle,
	dimensionsHorizontal,
	dimensionsVertical, drawExtra, drawOutlineCircle, drawOutlineHexagon, drawOutlineOctagon, drawShapeDetails,
	drawText,
	drawTextBold,
	drawTextBoldCentred,
	lineHorizontal,
	lineHorizontalGuide,
	lineVertical,
	lineVerticalGuide, rectangle, renderExtra,
	target,
	TextOrientation
} from "../../../utils/svg-helper.ts";
import {Part} from "../../../model/Part.ts";
import {Extra} from "../../../model/Extra.ts";
import {OpaqueColour} from "../../../model/meta/OpaqueColour.ts";

export class SVGTechnicalRenderer extends SVGRenderer {
	renderCentralLine: number = 500;

	constructor(pencil: Pencil, pencilDir: string) {
		super(pencil, 1500, 800, "SVGTechnicalRenderer", pencilDir);
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
		let svgString:string = this.getSvgStart();

		// centre line for the entire pencil
		svgString += super.renderCentreLineHorizontal(this.renderCentralLine);
		// centre line for the side view
		svgString += super.renderCentreLineVertical(this._width/2, 90, 90);
		// centre line for the front view
		svgString += super.renderCentreLineVertical(160, 150, 90);
		// centre line for the back view
		svgString += super.renderCentreLineVertical(this._width - 100, 150, 90);

		// overview text
		svgString += super.renderOverviewText();

		// colours
		svgString += super.renderPencilColours();

		// materials used
		svgString += super.renderMaterialList();

		// first up the grey guidelines
		svgString += this.renderGuidelinesFull();

		// render the section titles (front/side/back)
		svgString += super.renderSectionTitles();

		// now we get into the dimensions

		// render the front dimensions
		svgString += super.renderFrontDimensions(160, 500);

		//render the side dimensions
		svgString += super.renderSideDimensions((this._width - this.pencil.totalLength * 5)/2, this.renderCentralLine);

		// render the back dimensions
		svgString += super.renderBackDimensions(this._width - 150, this.renderCentralLine);

		svgString += super.renderTotalLengthDimensions(this.renderCentralLine);

		//render the side materials
		svgString += super.renderSideMaterials(this.renderCentralLine);

		// now it is time to render the details of the pencil
		svgString += super.renderSideComponents(this._width/2 - (this.pencil.totalLength*5/2), this.renderCentralLine, colourIndex);

		svgString += super.renderFrontComponents(160, this.renderCentralLine, colourIndex);

		svgString += super.renderBackComponents(this._width - 100, this.renderCentralLine, colourIndex);

		// end the end of the SVG
		svgString += this.getSvgEnd();
		return(svgString);
	}

	private renderGuidelinesFull(): string {
		let svgString:string = "";
		// now we are going to go through each of the components and draw the shapes
		let offset:number;

		let hasExtra:boolean = false;
		// now for the extra side components guidelines
		for (let component of this.pencil.components) {
			for(const extra of component.extras) {
				// draw the straight-through line for guidance top of the extra parts
				const y = this.renderCentralLine - extra.yOffset * 5 - (extra.height) * 5;

				svgString += lineHorizontalGuide(100, y, this._width - 200);
				// draw the straight-through line for guidance bottom of the extra parts
				svgString += lineHorizontalGuide(160, this.renderCentralLine - extra.yOffset * 5, this._width - 260);
				// guidelines for the extra width - left side
				svgString += lineVerticalGuide(160 - extra.depth/2 * 5, this.renderCentralLine - 70, 70);
				// guidelines for the extra width - right side
				svgString += lineVerticalGuide(160 + extra.depth/2 * 5, this.renderCentralLine - 70, 70);

				hasExtra = true;
			}
		}

		// FRONT VIEW GUIDELINES

		// top horizontal line
		svgString += lineHorizontalGuide((hasExtra ? 160 : 100), this.renderCentralLine - this.pencil.maxHeight/2 * 5, this._width - 100 - (hasExtra ? 160 : 100));

		// bottom line of full pencil
		svgString += lineHorizontalGuide(100, this.renderCentralLine + this.pencil.maxHeight/2 * 5, this._width - 200);

		// Vertical line of width - left
		svgString += lineVerticalGuide(160 - this.pencil.maxWidth/2 * 5,
				this.renderCentralLine,
				20 + this.pencil.maxHeight/2 * 5);
		// Vertical line of width - right
		svgString += lineVerticalGuide(160 + this.pencil.maxWidth/2 * 5,
				this.renderCentralLine,
				20 + this.pencil.maxHeight/2 * 5);

		// SIDE VIEW GUIDELINES FOR THE COMPONENTS
		// reset the offset to redraw
		offset = this._width/2 - this.pencil.totalLength * 5/2;

		for (let component of this.pencil.components) {
			// vertical line
			svgString += lineVerticalGuide(offset, this.renderCentralLine - 120, 240);
			// now for extraParts
			for(const extra of component.extras) {
				svgString += lineVerticalGuide(offset + extra.xOffset * 5,
								this.renderCentralLine - 80,
								160);
				svgString += lineVerticalGuide(offset + extra.xOffset * 5 + extra.length * 5,
								this.renderCentralLine - 80,
								160);
			}

			offset += component.length * 5;
		}

		svgString += lineVerticalGuide(offset, this.renderCentralLine - 88 - this.pencil.maxHeight/2 * 5, 208);
		return(svgString);
	}
}