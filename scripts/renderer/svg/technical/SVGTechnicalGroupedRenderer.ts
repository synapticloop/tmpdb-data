import {Pencil} from "../../../model/Pencil.ts";
import {SVGRenderer} from "../SVGRenderer.ts";
import {
	dimensionsHorizontal,
	drawText,
	drawTextBoldCentred, drawTextCentred,
	lineHorizontal, lineVertical,
	TextOrientation
} from "../../../utils/svg-helper.ts";
import {formatToTwoPlaces} from "../../../utils/formatter.ts";
import {Component} from "../../../model/Component.ts";

/**
 * Render all the colour variants of a pencil
 */
export class SVGTechnicalGroupedRenderer extends SVGRenderer {
	SVG_WIDTH:number = 1000;
	SVG_HEIGHT:number = 200;

	constructor(pencil: Pencil, pencilDir: string) {
		super(pencil, 1000, 600, "SVGTechnicalGroupedRenderer", pencilDir);
	}

	/**
	 * <p>Generate the SVG as a string with the colour</p>
	 *
	 * @param colourIndex the pencil colour index
	 *
	 * @returns {string} The SVG data as a String
	 */

	// render(context: number): string {
	// 	this.SVG_HEIGHT = 660 + this.pencil.colourComponents.length * 120;
	// 	super.resize(1000, this.SVG_HEIGHT);
	// 	let svgString:string = super.getSvgStart();
	// 	svgString += super.renderOverviewText(false);
	//
	// 	let y: number = 140;
	//
	// 	svgString += this.renderTitle(240, y, 120, "Measurements")
	//
	// 	y += 160;
	// 	// now draw the grouped components
	// 	svgString += super.renderCentreLineHorizontal(y);
	// 	svgString += super.renderSideComponents(this._width/2 - (this.pencil.totalLength*5/2), y, -1);
	//
	// 	return(svgString);
	// }

	render(colourIndex: number):string {

		// the first thing that we are going to do is to render the pencil with
		// the grouped components
		// determine the this.SVG_HEIGHT
		this.SVG_HEIGHT = 660 + this.pencil.colourComponents.length * 120;
		super.resize(1000, this.SVG_HEIGHT);

		// start
		let svgString:string = super.getSvgStart();
		svgString += super.renderOverviewText(false);

		let y: number = 140;

		svgString += this.renderTitle(240, y, 120, "Measurements")

		y += 160;
		// now draw the grouped components
		svgString += super.renderCentreLineHorizontal(y);
		svgString += super.renderSideComponents(this._width/2 - (this.pencil.totalLength*5/2), y, -1);

		let partOffset: number = this.SVG_WIDTH/2 - this.pencil.totalLength*5/2
		let groupLength: number = 0;

		let drawComponents: Component[] = [];

		let currentOffset: number = 0;
		let gripComponent: Component = null;
		let gripOffset: number = 0;
		let clipComponent: Component = null;
		let clipOffset: number = 0;

		// TODO - put this into the pencil
		for(const component of this.pencil.components) {
			if(component.type === "tip") {
				// found the tip

				drawComponents.push(component);

				for(const drawComponent of drawComponents) {
					groupLength += drawComponent.length;
				}


				svgString += dimensionsHorizontal(partOffset,
					y - 60 - this.pencil.maxHeight/2 * 5,
					groupLength * 5,
					`${formatToTwoPlaces(groupLength)} mm`)
				svgString += dimensionsHorizontal(partOffset,
					y - 60 - this.pencil.maxHeight/2 * 5,
					groupLength * 5,
					`tip`,
					TextOrientation.BOTTOM,
					true);
				partOffset += groupLength * 5;
				drawComponents.length = 0;
				groupLength = 0;

				// remove the tip - as it will be added back in again
				drawComponents.pop();
				groupLength -= component.length;
			}

			if(component.type === "cap") {
				for(const drawComponent of drawComponents) {
					groupLength += drawComponent.length;
				}

				svgString += dimensionsHorizontal(partOffset,
					y - 60 - this.pencil.maxHeight/2 * 5,
					groupLength * 5,
					`${formatToTwoPlaces(groupLength)} mm`)
				svgString += dimensionsHorizontal(partOffset,
					y - 60 - this.pencil.maxHeight/2 * 5,
					groupLength * 5,
					`body`,
					TextOrientation.BOTTOM,
					true);

				partOffset += groupLength * 5;
				drawComponents.length = 0;
				groupLength = component.length;
			}

			if(component.type === "grip") {
				gripComponent = component;
				gripOffset = currentOffset;
			}

			if(component.type === "clip") {
				clipComponent = component;
				clipOffset = currentOffset;
			}

			drawComponents.push(component);
			currentOffset += component.length * 5;
		}

		let capLength: number = 0;
		for(const drawComponent of drawComponents) {
			capLength += drawComponent.length;
		}

		if(capLength > 0) {
			svgString += dimensionsHorizontal(partOffset,
				y - 60 - this.pencil.maxHeight/2 * 5,
				capLength * 5,
				`${formatToTwoPlaces(capLength)} mm`)
			svgString += dimensionsHorizontal(partOffset,
				y - 60 - this.pencil.maxHeight/2 * 5,
				capLength * 5,
				`cap`,
				TextOrientation.BOTTOM,
				true);
		}

		// render the total length
		svgString += dimensionsHorizontal(
			this.SVG_WIDTH/2 - this.pencil.totalLength*5/2,
			y + 90 + this.pencil.maxHeight/2 * 5,
			this.pencil.totalLength * 5,
			`${formatToTwoPlaces(this.pencil.totalLength)} mm`,
			TextOrientation.BOTTOM,
			true
		);

		svgString += dimensionsHorizontal(
			this.SVG_WIDTH/2 - this.pencil.totalLength*5/2,
			y + 90 + this.pencil.maxHeight/2 * 5,
			this.pencil.totalLength * 5,
			`Total Length`,
			TextOrientation.TOP,
			true
		);


		// draw the clip dimensions
		if(null != clipComponent) {
			svgString += dimensionsHorizontal(
				this.SVG_WIDTH/2 - this.pencil.totalLength*5/2 + clipOffset + clipComponent.allOffset * 5,
				y + 30 + this.pencil.maxHeight/2 * 5,
				clipComponent.allLength * 5,
				`${formatToTwoPlaces(clipComponent.allLength)} mm`,
				TextOrientation.TOP,
				true
			);

			svgString += dimensionsHorizontal(
				this.SVG_WIDTH/2 - this.pencil.totalLength*5/2 + clipOffset + clipComponent.allOffset * 5,
				y + 30 + this.pencil.maxHeight/2 * 5,
				clipComponent.allLength * 5,
				"clip",
				TextOrientation.BOTTOM,
				true
			);
		}

		// draw the grip dimensions
		if(null != gripComponent) {
			svgString += dimensionsHorizontal(
				this.SVG_WIDTH/2 - this.pencil.totalLength*5/2 + gripOffset,
				y + 30 + this.pencil.maxHeight/2 * 5,
				gripComponent.length * 5,
				`${formatToTwoPlaces(gripComponent.length)} mm`,
				TextOrientation.TOP,
				true
			);

			svgString += dimensionsHorizontal(
				this.SVG_WIDTH/2 - this.pencil.totalLength*5/2 + gripOffset,
				y + 30 + this.pencil.maxHeight/2 * 5,
				gripComponent.length * 5,
				"grip",
				TextOrientation.BOTTOM,
				true
			);
		}

		y = y + 240;

		svgString += this.renderTitle(240, y, 174, "Variants")

		// now we are going to draw the colour components
		y = y + 100;

		for (let i:number = 0; i < this.pencil.colourComponents.length; i++) {
			// now it is time to render the details of the pencil
			svgString += super.renderSideComponents(this._width/2 - (this.pencil.totalLength*5/2), y, i);

			// now draw the text
			let text: string = this.pencil.colourComponents[i].colourName;
			if(this.pencil.skus[i]) {
				text += ` (${this.pencil.skus[i]})`;
			}
			svgString += drawTextBoldCentred(text, this._width/2, y + 50, "1.2em");
			y = y + 120;
		}

		svgString += super.getSvgEnd();
		return(svgString);
	}

	private renderTitle(x: number, y: number, width: number, text: string): string {
		let svgString: string = "";
		svgString += lineVertical(x + width, y + - 16, 38, "2", "black");
		svgString += lineHorizontal(x, y, width, "2", "black");
		svgString += lineHorizontal(x + 6, y + 4, width - 6, "2", "black");
		svgString += drawTextBoldCentred(
				text,
				this._width/2,
				y,
				"2.4em"
		);
		svgString += lineHorizontal(this._width - x - width, y, width, "2", "black");
		svgString += lineHorizontal(this._width - x - width, y + 4, width - 6, "2", "black");
		svgString += lineVertical(this._width - x - width, y + - 16, 38, "2", "black");
		return(svgString);
	}
}