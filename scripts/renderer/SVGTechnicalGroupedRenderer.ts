import {Pencil} from "../model/Pencil.ts";
import {SVGRenderer} from "./SVGRenderer.ts";
import {dimensionsHorizontal, TextOrientation} from "../utils/svg-helper.ts";
import {formatToTwoPlaces} from "../utils/formatter.ts";
import {Component} from "../model/Component.ts";

/**
 * Render all the colour variants of a pencil
 */
export class SVGTechnicalGroupedRenderer extends SVGRenderer {
	SVG_WIDTH:number = 1000;
	SVG_HEIGHT:number = 200;

	constructor(pencil: Pencil) {
		super(pencil, 1000, 600, "SVGTechnicalGroupedRenderer");
	}

	/**
	 * <p>Generate the SVG as a string with the colour</p>
	 *
	 * @param colourIndex the pencil colour index
	 *
	 * @returns {string} The SVG data as a String
	 */
	render(colourIndex: number):string {

		// the first thing that we are going to do is to render the pencil with
		// the grouped components
		// determine the this.SVG_HEIGHT
		this.SVG_HEIGHT = 500 + this.pencil.colourComponents.length * 120;
		super.resize(1000, this.SVG_HEIGHT);

		// start
		let svgString:string = super.getSvgStart();
		svgString += super.renderOverviewText(false);

		let midYOverride: number = 200;

		// now draw the grouped components
		svgString += super.renderCentreLineHorizontal(midYOverride);
		svgString += super.renderSideComponents(-1, midYOverride);

		let partOffset: number = this.SVG_WIDTH/2 - this.pencil.totalLength*5/2
		let groupLength: number = 0;
		let drawComponents: Component[] = [];
		for(const component of this.pencil.components) {
			if(component.type === "body") {
				for(const drawComponent of drawComponents) {
					groupLength += drawComponent.length;
				}

				svgString += dimensionsHorizontal(partOffset,
					midYOverride - 40 - this.pencil.maxHeight/2 * 5,
					groupLength * 5,
					`${formatToTwoPlaces(groupLength)} mm`)
				svgString += dimensionsHorizontal(partOffset,
					midYOverride - 40 - this.pencil.maxHeight/2 * 5,
					groupLength * 5,
					`tip`,
					TextOrientation.BOTTOM,
					true);
				partOffset += groupLength * 5;
				drawComponents.length = 0;
				groupLength = 0;
			}

			if(component.type === "cap") {
				for(const drawComponent of drawComponents) {
					groupLength += drawComponent.length;
				}

				svgString += dimensionsHorizontal(partOffset,
					midYOverride - 40 - this.pencil.maxHeight/2 * 5,
					groupLength * 5,
					`${formatToTwoPlaces(groupLength)} mm`)
				svgString += dimensionsHorizontal(partOffset,
					midYOverride - 40 - this.pencil.maxHeight/2 * 5,
					groupLength * 5,
					`body`,
					TextOrientation.BOTTOM,
					true);

				partOffset += groupLength * 5;
				drawComponents.length = 0;
				groupLength = component.length;
			}

			drawComponents.push(component);
		}

		let capLength: number = 0;
		for(const drawComponent of drawComponents) {
			capLength += drawComponent.length;
		}

		if(capLength > 0) {
			svgString += dimensionsHorizontal(partOffset,
				midYOverride - 40 - this.pencil.maxHeight/2 * 5,
				capLength * 5,
				`${formatToTwoPlaces(capLength)} mm`)
			svgString += dimensionsHorizontal(partOffset,
				midYOverride - 40 - this.pencil.maxHeight/2 * 5,
				capLength * 5,
				`cap`,
				TextOrientation.BOTTOM,
				true);
		}

		// render the total length
		svgString += dimensionsHorizontal(
			this.SVG_WIDTH/2 - this.pencil.totalLength*5/2,
			midYOverride + 80 + this.pencil.maxHeight/2 * 5,
			this.pencil.totalLength * 5,
			`${formatToTwoPlaces(this.pencil.totalLength)} mm`,
			TextOrientation.BOTTOM,
			true
		);

		svgString += dimensionsHorizontal(
			this.SVG_WIDTH/2 - this.pencil.totalLength*5/2,
			midYOverride + 80 + this.pencil.maxHeight/2 * 5,
			this.pencil.totalLength * 5,
			`Total Length`,
			TextOrientation.TOP,
			true
		);

		// now we are going to draw the full length
		midYOverride = midYOverride + 200;

		for (let i:number = 0; i < this.pencil.colourComponents.length; i++) {
			// now it is time to render the details of the pencil
			svgString += super.renderSideComponents(i, midYOverride);

			midYOverride = midYOverride + 120;
		}

		svgString += super.getSvgEnd();
		return(svgString);
	}
}