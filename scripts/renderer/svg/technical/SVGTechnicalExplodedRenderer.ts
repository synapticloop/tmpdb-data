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
import {Component} from "../../../model/Component.ts";

class ComponentSplitter {
	x: number = 0;
	component: Component;

	constructor(x: number, component: Component) {
		this.x = x;
		this.component = component;
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

		super.resize(1200, this.SVG_HEIGHT);

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
		let y: number = 160;

		let colour: OpaqueColour = new OpaqueColour(this.pencil.colourMap, "white");

		// draw the components

		let previousComponent: Component = null;
		for (let [index, component] of this.pencil.components.entries()) {

			if(index !== 0) {
				if(component.hasInternalStart) {
					if(previousComponent.isHidden) {
						svgString += this.drawJoinedLine(x + 5, y, component.internalStartLength, previousComponent.internalEndLength);
					} else {
						svgString += this.drawJoinedLine(x + 5, y, component.internalStartLength, 0);
					}
					svgString += arrowLeft(x + 5, y);
					y += 120;
					svgString += arrowLeft(x - 30 - component.internalStartLength * 5, y);
				}
			}

			colour = component.getOpacityColour(colourIndex);

			// first thing is to render the internal start parts (which is offset)
			x -= component.internalStartLength * 5;

			for(const internalStart of component.internalStart) {
				svgString += super.renderPart(x, y, internalStart, colourIndex);
				x += internalStart.length * 5;
			}

			if(component.hasInternalStart) {
				svgString += this.drawDashedLine(x, y);
			}

			// render the parts

			svgString += this.renderSideComponent(x, y, component, colourIndex);
			for(let part of component.parts) {
				svgString += this.renderTaper(x, y, part, colourIndex);

				x += part.length * 5;
			}

			let previousPart: Part = null;
			for(const internalEnd of component.internalEnd) {
				svgString += super.renderPart(x, y, internalEnd, colourIndex);

				if(previousPart !== null && internalEnd.internalOffset < 0) {
					// only draw the part if this part is not opaque and the previous one is

					const isPreviousOpaque: boolean = previousPart.getOpacityColour(colourIndex).opacity !== 1;
					const isInternalOpaque: boolean = internalEnd.getOpacityColour(colourIndex).opacity !== 1;

					if(!isInternalOpaque && isPreviousOpaque) {
						// redraw the part
						x -= previousPart.length * 5;
						svgString += super.renderPart(x, y, previousPart, colourIndex);
						x += previousPart.length * 5;
					}

					if(colourIndex === -1) {
						// x -= internalEnd.length * 5;
						x -= previousPart.length * 5;
						x -= previousPart.internalOffset * 5;
						svgString += "\n\n<!-- Previous part white -->\n";
						svgString += super.renderPart(x, y, previousPart, colourIndex);
						x += previousPart.length * 5;
						x += previousPart.internalOffset * 5;
						// x += previousPart.length - previousPart.internalOffset * 5;
					}
				}

				x += internalEnd.length * 5;
				x += internalEnd.internalOffset * 5;
				previousPart = internalEnd;
			}

			if(component.hasInternalEnd  && !component.isHidden) {
				x -= component.internalEndLength * 5;
				svgString += this.drawDashedLine(x, y);
				svgString += this.drawJoinedLine(x, y, 0, component.internalEndLength);
				svgString += arrowLeft(x + 10, y);
				y += 120;
				svgString += arrowLeft(x - 30, y);
			}

			if(component.isHidden) {
				x -= component.internalEndLength * 5;
			}

			previousComponent = component;
		}

		return(svgString);
	}

	private drawJoinedLine(x: number, y: number, startLength: number, endLength: number): string {
		let svgString: string = "\n\n<!-- DASHED JOIN -->\n";
		svgString += `<path d="M ${x + 10} ${y} ` +
				`L ${x + 30 + endLength * 5} ${y} ` + // top horizontal
				`L ${x + 30 + endLength * 5} ${y + 60} ` + // right vertical
				`L ${x - 50 - startLength * 5 } ${y + 60} ` + // middle horizontal
				`L ${x - 50 - startLength * 5 } ${y + 120} ` + // left vertical
				`L ${x - 5 - startLength * 5} ${y + 120} ` + // bottom horizontal
				`" ` +
				`fill="none" ` +
				`stroke="white" ` +
				`stroke-width="2" ` +
				`stroke-dasharray="8,4" ` +
				`stroke-linecap="round" ` +
				` />\n`;
		svgString += `<path d="M ${x + 10} ${y} ` +
				`L ${x + 30 + endLength * 5} ${y} ` + // top horizontal
				`L ${x + 30 + endLength * 5} ${y + 60} ` + // right vertical
				`L ${x - 50 - startLength * 5 } ${y + 60} ` + // middle horizontal
				`L ${x - 50 - startLength * 5 } ${y + 120} ` + // left vertical
				`L ${x - 5 - startLength * 5} ${y + 120} ` + // bottom horizontal
				`" ` +
				`fill="none" ` +
				`stroke="black" ` +
				`stroke-width="1" ` +
				`stroke-dasharray="8,4" ` +
				`stroke-linecap="round" ` +
				` />\n`;

		return(svgString);
	}

	private drawDashedLine(x: number, y: number): string {
		let svgString: string = "";
		svgString += lineVertical(x, y - 40, 80, "1", "white");
		svgString += lineVertical(x, y - 40, 80, "1", "black", "4,2");
		return(svgString);
	}
}