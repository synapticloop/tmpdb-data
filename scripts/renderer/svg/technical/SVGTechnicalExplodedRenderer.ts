import {Pencil} from "../../../model/Pencil.ts";
import {SVGRenderer} from "../SVGRenderer.ts";
import {
	arrowLeft,
	lineHorizontal,
	lineVertical,
} from "../../../utils/svg-helper.ts";
import {Part} from "../../../model/Part.ts";
import {formatToTwoPlaces} from "../../../utils/formatter.ts";
import {OpaqueColour} from "../../../model/OpaqueColour.ts";

class ComponentSplitter {
	x: number = 0;
	y: number = 0;
	length: number = 0;
	shouldDash: boolean;

	constructor(x, y, length: number, shouldDash: boolean) {
		this.x = x;
		this.y = y;
		this.length = length;
		this.shouldDash = shouldDash;
	}
}

export class SVGTechnicalExplodedRenderer extends SVGRenderer {
	SVG_WIDTH: number = 1200;
	SVG_HEIGHT: number = 200;


	constructor(pencil: Pencil) {
		super(pencil, 1200, 200, "SVGTechnicalExplodedRenderer");
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
		// determine the this.SVG_HEIGHT
		this.SVG_HEIGHT += this.pencil.maxHeight
		for(const [index, component] of this.pencil.components.entries()) {
			if(component.hasInternalStart || component.hasInternalEnd ) {
				this.SVG_HEIGHT += 120;
			}
			if(component.isHidden) {
				this.SVG_HEIGHT += 120;
			}
		}

		super.resize(this.SVG_WIDTH, this.SVG_HEIGHT);

		let svgString:string = this.getSvgStart();

		// overview text
		svgString += this.renderOverviewText(false);

		// now it is time to render the details of the pencil

		svgString += this.renderExplodedSideComponents(colourIndex);

		// end the end of the SVG
		svgString += this.getSvgEnd();

		return(svgString);
	}

	private renderExplodedSideComponents(colourIndex:number): string {
		let svgString: string = `\n\n<!-- renderExplodedSideComponents -->\n`;
		let x: number = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		let y: number = 120;

		let colour: OpaqueColour = new OpaqueColour(this.pencil.colourMap, "white");

		let componentSplitters: ComponentSplitter[] = [];

		// get the last part ( if we have an internal end with an offset, then we
		// re-draw the previous part..)  a little bit hacky...

		// draw the components
		let componentsLength: number = 0;
		for (let [index, component] of this.pencil.components.entries()) {
			let componentsLength: number = component.length * 5;

			if(index !== 0) {
				if(component.hasInternalStart) {
					svgString += arrowLeft(x + 10, y);

					y += 120;
					componentSplitters.push(new ComponentSplitter(x, y, componentsLength, true));
					componentsLength = 0;
				}
			}

			colour = component.getOpacityColour(colourIndex);

			// first thing is to render the internal start parts (which is offset)
			x -= component.internalStartLength * 5;

			for(const internalStart of component.internalStart) {
				svgString += super.renderPart(x, y, internalStart, colourIndex);
				x += internalStart.length * 5;
			}

			// render the parts
			svgString += this.renderSideComponent(x, y, component, colourIndex);

			x += component.length * 5;


			let previousPart: Part = null;
			for(const internalEnd of component.internalEnd) {
				x += internalEnd.internalOffset * 5;
				svgString += super.renderPart(x, y, internalEnd, colourIndex);


				x -= internalEnd.internalOffset * 5;

				if(previousPart !== null && internalEnd.internalOffset < 0) {
					// redraw the part
					x -= previousPart.length * 5;
					svgString += super.renderPart(x, y, previousPart, colourIndex);
					x += previousPart.length * 5;
				}

				x += internalEnd.internalOffset * 5;

				x += internalEnd.length * 5;
				previousPart = internalEnd;
			}

			if(component.hasInternalEnd) {
				svgString += arrowLeft(x - 10);
				y += 120;
				componentSplitters.push(new ComponentSplitter(x - (component.length + component.internalEndLength) * 5, y, componentsLength, false));
				componentsLength = 0;
			}

			if(component.hasInternalEnd) {
				x -= component.internalEndLength * 5;
			}
		}

		// now we are going to go through and draw the arrows and dashed lines
		for(const [ index, dashedLine ] of componentSplitters.entries()) {
			if(dashedLine.shouldDash) {
				svgString += lineVertical(dashedLine.x, dashedLine.y - 40, 80, "1.0", "white");
				svgString += lineVertical(dashedLine.x, dashedLine.y - 40, 80, "1.0", "black", "2,3");
			} else {
				svgString += lineVertical(dashedLine.x, dashedLine.y + 20, 80, "2.0", "pink");
			}
		}

		for (let [index, component] of this.pencil.components.entries()) {
			if(index !== 0) {
				if(component.hasInternalStart) {
					svgString += arrowLeft(x + 10, y);
					y += 120;
				}
			}

			x -= component.internalStartLength * 5;

			for(const internalStart of component.internalStart) {
				x += internalStart.length * 5;
			}

			x += component.length * 5;

			for(const internalEnd of component.internalEnd) {
				x += internalEnd.internalOffset * 5;
				x += internalEnd.length * 5;
			}

			if(component.hasInternalEnd) {
				svgString += arrowLeft(x, y);
				svgString += arrowLeft(x - 10);
				y += 120;
			}

			if(component.hasInternalEnd) {
				x -= component.internalEndLength * 5;
			}
		}

		return(svgString);
	}
}