import {Pencil} from "../../../model/Pencil.ts";
import {SVGRenderer} from "../SVGRenderer.ts";
import {
	lineVerticalGuide,
} from "../../../utils/svg-helper.ts";

export class SVGTechnicalComponentRenderer extends SVGRenderer {
	constructor(pencil: Pencil, pencilDir: string) {
		super(pencil, 1200, 500, "SVGTechnicalComponentRenderer", pencilDir);
	}

	/**
	 * <p>Generate the SVG as a string with the colour</p>
	 *
	 * @param colourIndex the pencil colour index
	 *
	 * @returns {string} The SVG data as a String
	 */
	render(colourIndex: number):string {

		let componentOffset: number = 300;
		let hiddenOffset: number = 500;
		let xMid: number = this._width/2;

		if(this.pencil.hasHidden) {
			super.resize(1200, 740);
		}

		// start
		let svgString:string = super.getSvgStart();

		// centre line for the entire pencil
		svgString += super.renderCentreLineHorizontal(componentOffset);

		if(this.pencil.hasHidden) {
			svgString += super.renderCentreLineHorizontal(hiddenOffset);
		}

		// centre line for the side view
		svgString += super.renderCentreLineVertical(xMid, 90, 90);

		// overview text
		svgString += super.renderOverviewText(false);

		// first up the grey guidelines
		svgString += this.renderGuidelinesFull(this._width/2 - this.pencil.totalLength/2 * 5, componentOffset);

		// now we get into the dimensions

		//render the side dimensions
		svgString += super.renderSideDimensions(this._width/2 - this.pencil.totalLength/2 * 5, componentOffset);

		// now it is time to render the details of the pencil
		svgString += super.renderSideComponents(this._width/2 - (this.pencil.totalLength*5/2), componentOffset, colourIndex);

		if(this.pencil.hasHidden) {
			// find out the offset for the hidden part
			let xHiddenOffset: number = 0;
			let foundHidden: boolean = false;
			for(const component of this.pencil.components) {
				if(component.isHidden) {
					if(component.hasInternalStart) {
						for(const part of component.internalStart) {
							xHiddenOffset -= part.length * 5;
						}
					}
					break;
				}

				xHiddenOffset += component.length * 5;
			}

			svgString += super.renderHiddenSideComponents(this._width/2 - (this.pencil.totalLength*5/2) + xHiddenOffset, hiddenOffset, colourIndex);
		}

		// end the end of the SVG
		svgString += super.getSvgEnd();

		return(svgString);
	}

	private renderGuidelinesFull(x: number, y: number): string {
		let svgString:string = "";
		// SIDE VIEW GUIDELINES FOR THE COMPONENTS
		// reset the offset to redraw

		svgString += lineVerticalGuide(x, y - 88 - this.pencil.maxHeight/2 * 5, 88 + this.pencil.maxHeight/2 * 5);

		for (let component of this.pencil.components) {
			// vertical line
			svgString += lineVerticalGuide(x, y - 120, 120);

			// now for extraParts
			for(const extra of component.extras) {
				svgString += lineVerticalGuide(x + extra.xOffset * 5,
					y - 80,
					80);
				svgString += lineVerticalGuide(x + extra.xOffset * 5 + extra.length*5,
					y - 80,
					80);
			}

			x += component.length * 5;

		}

		svgString += lineVerticalGuide(x, y - 88 - this.pencil.maxHeight/2 * 5, 88 + this.pencil.maxHeight/2 * 5);
		return(svgString);
	}
}