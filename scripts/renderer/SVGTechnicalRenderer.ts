import {Pencil} from "../model/Pencil.ts";
import {SVGRenderer} from "./SVGRenderer.ts";
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
	lineVerticalGuide, rectangle, renderBackExtra,
	target,
	TextOrientation
} from "../utils/svg-helper.ts";
import {Part} from "../model/Part.ts";

export class SVGTechnicalRenderer extends SVGRenderer {
	SVG_WIDTH: number = 1500;
	SVG_HEIGHT: number = 600;

	constructor(pencil: Pencil) {
		super(pencil, 1500, 600, "SVGTechnicalRenderer");
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
		let svgString:string = this.getSvgStart(this.SVG_WIDTH, this.SVG_HEIGHT);

		// centre line
		svgString += super.renderCentreLines(this.SVG_WIDTH, this.SVG_HEIGHT);

		// overview text
		svgString += super.renderOverviewText();

		// colours
		svgString += super.renderPencilColours();

		// materials used
		svgString += super.renderMaterialList();

		// first up the grey guidelines
		svgString += this.renderGuidelines();

		// render the section titles (front/side/back)
		svgString += super.renderSectionTitles();

		// now we get into the dimensions

		// render the front dimensions
		svgString += this.renderFrontDimensions();

		//render the side dimensions
		svgString += this.renderSideDimensions();

		svgString += super.renderTotalLengthDimensions();

		//render the side materials
		svgString += super.renderSideMaterials();

		// render the back dimensions
		svgString += this.renderBackDimensions();

		// now it is time to render the details of the pencil
		svgString += super.renderSideComponents(colourIndex);
		svgString += this.renderFrontComponents(colourIndex);
		svgString += this.renderBackComponents(colourIndex);

		// end the end of the SVG
		svgString += this.getSvgEnd(this.SVG_WIDTH, this.SVG_HEIGHT);
		return(svgString);
	}

	private renderFrontDimensions(): string {
		let svgString: string = "";
		// THIS IS THE FRONT VIEW

		let extrasHeight: number = 0;
		let extrasOffset: number = 0;
		let extrasOffsetHeight: number = 0;
		// do we have any extras?

		let thisExtraPart: Part = null;
		for(const component of this.pencil.components) {
			if(component.extraParts.length > 0){

				for(const extraPart of component.extraParts){
					if(extraPart.extraHeight > extrasHeight){
						extrasHeight = extraPart.extraHeight;
						extrasOffset = extraPart.extraOffset[1];
						extrasOffsetHeight = component.maxHeight/2;
						thisExtraPart = extraPart;
					}
				}
			}
		}

		// we will be drawing the left dimension for the full body height - we need to take
		// into account whether there is an extra part
		if(thisExtraPart) {
			// draw the dimensions for the top part of the extra
			svgString += dimensionsHorizontal(160 - thisExtraPart.extraWidth/2 * 5,
				this.SVG_HEIGHT/2 - 60,
				thisExtraPart.extraWidth * 5,
				`${(Math.round((thisExtraPart.extraWidth) * 100) / 100).toFixed(2)} mm`,
				TextOrientation.TOP,
				true);

			svgString += dimensionsVertical(222,
				this.SVG_HEIGHT/2 - extrasOffset * 5 - extrasHeight * 5,
				extrasHeight * 5,
				`${(Math.round((thisExtraPart.extraHeight) * 100) / 100).toFixed(2)} mm`,
				TextOrientation.RIGHT);

			svgString += dimensionsVertical(210,
				this.SVG_HEIGHT/2 - this.pencil.maxHeight/2 * 5,
				this.pencil.maxHeight * 5,
				`${(Math.round((this.pencil.maxHeight) * 100) / 100).toFixed(2)} mm`,
				TextOrientation.RIGHT);


			const pencilExtraHeight: number  = this.pencil.maxHeight + extrasHeight - (extrasOffsetHeight - extrasOffset);
			// we have an extra part - the height is more than the simple body height
			svgString += dimensionsVertical(110,
				this.SVG_HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5,
				pencilExtraHeight * 5,
				`${pencilExtraHeight} mm`,
				TextOrientation.LEFT_ROTATED,
				true);
		} else {
			// no extra height here - so we can just draw the text
			svgString += dimensionsVertical(110,
				this.SVG_HEIGHT/2 - this.pencil.maxHeight/2*5,
				this.pencil.maxHeight * 5,
				`${(Math.round((this.pencil.maxHeight) * 100) / 100).toFixed(2)} mm`,
				TextOrientation.LEFT_ROTATED,
				true);
		}

		// This is the BOTTOM WIDTH of the pencil
		svgString += dimensionsHorizontal(160 - this.pencil.maxWidth/2 * 5,
			this.SVG_HEIGHT/2 + 30 + this.pencil.maxHeight/2 * 5,
			this.pencil.maxWidth * 5,
			`${(Math.round(this.pencil.maxWidth * 100) / 100).toFixed(2)} mm`,
			TextOrientation.BOTTOM,
			true);

		return(svgString);
	}

	private renderBackDimensions(): string {
		let svgString: string = "";


		for (let component of this.pencil.components) {
			if(component.type === "body") {
				svgString += dimensionsVertical(this.SVG_WIDTH - 150,
					this.SVG_HEIGHT/2 - component.maxHeight/2 * 5,
					component.maxHeight * 5,
					`${component.maxHeight} mm`,
					TextOrientation.LEFT_ROTATED,
					true);

				svgString += dimensionsVertical(this.SVG_WIDTH - 150,
					this.SVG_HEIGHT/2 - component.maxHeight/2 * 5,
					component.maxHeight * 5,
					"body",
					TextOrientation.BOTTOM_ROTATED,
					true);
			}

			if(component.type === "grip") {
				svgString += dimensionsVertical(this.SVG_WIDTH - 190,
					this.SVG_HEIGHT/2 - component.maxHeight/2 * 5,
					component.maxHeight * 5,
					`${component.maxHeight} mm`,
					TextOrientation.LEFT_ROTATED,
					true);

				svgString += dimensionsVertical(this.SVG_WIDTH - 190,
					this.SVG_HEIGHT/2 - component.maxHeight/2 * 5,
					component.maxHeight * 5,
					"grip",
					TextOrientation.BOTTOM_ROTATED,
					true);

			}
		}
		return(svgString);
	}

	private renderFrontComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX = 160;
		let midY = this.SVG_HEIGHT/2;

		let colour = "white";

		// we want to render them back to front so that the last component is on
		// the bottom

		this.pencil.components.reverse()

		// go through the components and render them
		for(const component of this.pencil.components) {
			colour = this.getMappedColour(component, colour, colourIndex);

			component.parts.reverse();
			for (let part of component.parts) {
				switch (part.type) {
					case "cylinder":
						svgString += circle(startX, midY, (part.startHeight / 2) * 5, "1", "dimgray", colour);
						break;
					case "cone":
						svgString += drawOutlineCircle((part.startHeight / 2) * 5, startX, midY, colour);
						svgString += drawOutlineCircle((part.endHeight / 2) * 5, startX, midY, colour);
						break;
					case "hexagonal":
						svgString += drawOutlineHexagon(startX, midY, part.startHeight, colour);
						break;
					case "octagonal":
						svgString += drawOutlineOctagon(startX, midY, part.startHeight, colour);
						break;
					case "extra":
						part.extraParts.reverse();
						svgString += renderBackExtra(
							startX,
							midY,
							part.extraOffset[0],
							part.extraOffset[1],
							part.extraWidth,
							part.extraParts,
							colour);
						part.extraParts.reverse();
						break;
				}
			}
			component.parts.reverse();
		}

		// now put it back in order
		this.pencil.components.reverse()

		for(let front of this.pencil.front) {
			// only care about the first dimension - which is the width
			let dimensions: number[] = front.dimensions;

			if (this.pencil.colourMap[front.fill]) {
				colour = this.pencil.colourMap[front.fill];
			}

			// render the front piece
			switch (front.type) {
				case "cylinder":
					svgString += circle(160, this.SVG_HEIGHT/2, dimensions[0]/2 * 5, "0.5", "dimgray", front.fill);
					break;
			}
		}

		return(svgString);
	}

	private renderBackComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX = this.SVG_WIDTH - 100;
		let midY = this.SVG_HEIGHT/2;


		let colour: string = "white";
		// go through the components and render them
		for(const component of this.pencil.components) {
			colour = this.getMappedColour(component, colour, colourIndex);

			for (let part of component.parts) {
				switch (part.type) {
					case "cylinder":
						svgString += circle(startX, midY, (part.startHeight / 2) * 5, "1", "dimgray", colour);
						break;
					case "cone":
						svgString += drawOutlineCircle((part.startHeight / 2) * 5, startX, midY, colour);
						svgString += drawOutlineCircle((part.endHeight / 2) * 5, startX, midY, colour);
						break;
					case "hexagonal":
						svgString += drawOutlineHexagon(startX, midY, part.startHeight, colour);
						break;
					case "octagonal":
						svgString += drawOutlineOctagon(startX, midY, part.startHeight, colour);
						break;
					case "extra":
						part.extraParts.reverse();
						svgString += renderBackExtra(
							startX,
							midY,
							part.extraOffset[0],
							part.extraOffset[1],
							part.extraWidth,
							part.extraParts,
							colour);
						part.extraParts.reverse();
						break;
				}
			}
		}

		for(let back of this.pencil.back) {
			if (this.pencil.colourMap[back.fill]) {
				colour = this.pencil.colourMap[back.fill];
			}

			// render the back piece
			switch (back.type) {
				case "cylinder":
					svgString += circle(this.SVG_WIDTH - 100, this.SVG_HEIGHT/2, back.dimensions[0]/2 * 5, "1", "dimgray", back.fill);
					break;
			}
		}

		return(svgString);
	}

}