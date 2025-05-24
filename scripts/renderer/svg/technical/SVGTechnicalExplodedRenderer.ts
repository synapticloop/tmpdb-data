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

	private olderrenderExplodedSideComponents(colourIndex:number): string {
		let svgString: string = `\n\n<!-- renderExplodedSideComponents -->\n`;
		let startX: number = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		let midY: number = 120;

		let colour: OpaqueColour = new OpaqueColour(this.pencil.colourMap, "white");

		for (let [index, component] of this.pencil.components.entries()) {
			if(index !== 0) {
				// if we have an internal_start part, then increment the y
				if(component.hasInternalStart) {
					midY += 100;
				}
			}

			colour = component.getOpacityColour(colourIndex);
			// colour = this.getMappedColour(component.colours, colourIndex, colour.colour);

			let partLength:number = 0;
			let endPartLength: number = 0;

			// render a hidden component - i.e. there are no parts, just internal
			// start and end parts

			if(component.isHidden) {
				let totalLength: number = component.length;
				if (component.hasInternalStart) {
					startX -= partLength;

					for (let internalPart of component.internalStart) {
						startX -= internalPart.length * 5;
					}

					svgString += lineHorizontal(startX - 40, midY, 30, "1.0", "#0f0f0f");
					svgString += arrowLeft(startX - 30, midY);
					svgString += lineVertical(startX - 40, midY - 50, 50, "1.0", "#0f0f0f");


					let prevStartX = startX;

					for (let internalPart of component.internalStart) {
						colour = internalPart.getOpacityColour(colourIndex);
						svgString += super.renderPart(startX, midY, internalPart, colourIndex);
						startX += internalPart.length * 5
					}


					svgString += `<line x1="${prevStartX - 40}" ` +
						`y1="${midY - 50}" ` +
						`x2="${startX + 40}" ` +
						`y2="${midY - 50}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;

					svgString += lineVertical(startX, midY - 40, 80, "1.0", "white");
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "black", "2,3");

					svgString += lineVertical(startX + 40, midY - 100, 50, "1.0", "#0f0f0f");

					svgString += lineHorizontal(startX + 10, midY - 100, 30, "1.0", "#0f0f0f");
					svgString += arrowLeft(startX + 10, midY - 100);
				}

				if (component.hasInternalEnd) {
					// now draw the dotted line
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "white");
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "black", "2,3");

					let previousPart:Part = null;
					for (let internalPart of component.internalEnd) {
						colour = internalPart.getOpacityColour(colourIndex);
						svgString += super.renderPart(startX, midY, internalPart, colourIndex);
						totalLength += internalPart.length;
						startX += internalPart.length * 5

						// if we have an offset (which we only have on an end internal)
						// we want to re-write the previous part - hacky, but will cover this
						// part if it is not opaque
						if(previousPart !== null && internalPart.internalOffset !== 0) {
							startX -= internalPart.length * 5;
							startX -= previousPart.length * 5;
							svgString += super.renderPart(startX, midY, previousPart, colourIndex);
							startX += previousPart.length * 5;
							startX += internalPart.length * 5;
						}
						previousPart = internalPart;
					}

					startX -= totalLength * 5;

					// and for the arrows
					svgString += lineHorizontal(startX + 10, midY, 30  + totalLength * 5, "1.0", "#0f0f0f");
					svgString += arrowLeft(startX + 10, midY);

					svgString += lineVertical(startX + 40 + totalLength * 5, midY, 50, "1.0", "#0f0f0f");

					// in between the component line
					svgString += `<line x1="${startX - 40}" ` +
						`y1="${midY + 50}" ` +
						`x2="${startX + 40  + totalLength * 5}" ` +
						`y2="${midY + 50}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;


					// next part horizontal line
					svgString += lineHorizontal(startX - 40, midY + 100, 30, "1.0", "#0f0f0f");

					svgString += arrowLeft(startX - 30, midY + 100);

					svgString += lineVertical(startX - 40, midY + 50, 50, "1.0", "#0f0f0f");

					midY += 100;
				}
			} else {

				startX -= component.internalStartLength * 5;

				// render the internal start
				for(const internalStart of component.internalStart) {
					colour = internalStart.getOpacityColour(colourIndex);

					startX += internalStart.internalOffset * 5;
					svgString += super.renderPart(startX, midY, internalStart, colourIndex);
					startX += internalStart.length;
					endPartLength += internalStart.internalOffset * 5;
				}

				svgString += this.renderSideComponent(startX, midY, component, colourIndex);
				startX += component.length * 5;

				for (let internalEnd of component.internalEnd) {
					colour = internalEnd.getOpacityColour(colourIndex);
					startX += internalEnd.internalOffset * 5;
					svgString += super.renderPart(startX, midY,  internalEnd, colourIndex);
					startX += internalEnd.length * 5;
					endPartLength += internalEnd.length * 5;
					endPartLength += internalEnd.internalOffset * 5;
				}

				// This part is not hidden - i.e. a hidden component is only rendered internally
				// for (let part of component.parts) {
				// 	// render the visible part
				// 	svgString += `<!-- part ${part.shape} -->`;
				// 	svgString += super.renderPart(startX, midY, part, colourIndex);
				//
				// 	colour = part.getOpacityColour(colourIndex);
				// 	// colour = this.getMappedColour(part.colours, colourIndex, colour.colour);
				// 	// TODO - why is the taper off
				// 	svgString += super.renderTaper(startX, midY, part, colourIndex, colour.colour);
				//
				// 	startX += part.length * 5;
				// 	// for internal start parts we will need this value to go back
				// 	partLength += part.length * 5;
				// }
				// we are going to render
				// for (let internalEnd of component.internalEnd) {
				// 	colour = internalEnd.getOpacityColour(colourIndex);
				// 	// colour = this.getMappedColour(internalEnd.colours, colourIndex, colour.colour);
				// 	startX += internalEnd.internalOffset * 5;
				// 	svgString += `<!-- end ${internalEnd.shape} -->`;
				// 	svgString += super.renderPart(startX, midY,  internalEnd, colourIndex);
				// 	startX += internalEnd.length * 5;
				// 	endPartLength += internalEnd.length * 5;
				// 	endPartLength += internalEnd.internalOffset * 5;
				// }

				if (component.hasInternalEnd) {
					startX -= endPartLength;

					// now draw the dotted line
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "white");
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "black", "2,3");

					// and for the arrows
					svgString += lineHorizontal(startX + 10, midY, 30 + endPartLength, "2.0", "white");
					svgString += lineHorizontal(startX + 10, midY, 30 + endPartLength, "1.0", "#0f0f0f");

					svgString += arrowLeft(startX + 10, midY);

					svgString += lineVertical(startX + 40 + endPartLength, midY, 50, "2.0", "white");
					svgString += lineVertical(startX + 40 + endPartLength, midY, 50, "1.0", "#0f0f0f");

					// in between the component line
					svgString += lineHorizontal(startX - 40, midY + 50, (startX + 40 + endPartLength) - (startX - 40), "2.0", "white");
					svgString += lineHorizontal(startX - 40, midY + 50, (startX + 40 + endPartLength) - (startX - 40), "1.0", "#0f0f0f");


					// next part horizontal line
					svgString += lineHorizontal(startX - 40, midY + 100, 30, "2.0", "white");
					svgString += lineHorizontal(startX - 40, midY + 100, 30, "1.0", "#0f0f0f");

					svgString += arrowLeft(startX - 30, midY + 100);

					svgString += lineVertical(startX - 40, midY + 50, 50, "2.0", "white");
					svgString += lineVertical(startX - 40, midY + 50, 50, "1.0", "#0f0f0f");

					midY += 100;

				}

				if (component.hasInternalStart) {
					startX -= partLength;

					for (let internalPart of component.internalStart) {
						startX -= internalPart.length * 5;
					}

					svgString += lineHorizontal(startX - 40, midY, 30, "2.0", "white");
					svgString += lineHorizontal(startX - 40, midY, 30, "1.0", "#0f0f0f");
					svgString += arrowLeft(startX - 30, midY);
					svgString += lineVertical(startX - 40, midY - 50, 50, "2.0", "white");
					svgString += lineVertical(startX - 40, midY - 50, 50, "1.0", "#0f0f0f");


					let prevStartX = startX;
					let totalLength: number = component.length;

					for (let internalPart of component.internalStart) {
						colour = internalPart.getOpacityColour(colourIndex);
						// colour = this.getMappedColour(internalPart.colours, colourIndex, colour.colour);
						svgString += super.renderPart(startX, midY, internalPart, colourIndex);
						totalLength += internalPart.length;
						startX += internalPart.length * 5
					}

					svgString += lineHorizontal(prevStartX - 40, midY - 50, (startX + 40) - (prevStartX - 40), "2.0", "white");
					svgString += lineHorizontal(prevStartX - 40, midY - 50, (startX + 40) - (prevStartX - 40), "1.0", "#0f0f0f");

					svgString += lineVertical(startX, midY - 40, 80, "1.0", "white");
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "black", "2,3");

					svgString += lineVertical(startX + 40, midY - 100, 50, "2.0", "#ffffff");
					svgString += lineVertical(startX + 40, midY - 100, 50, "1.0", "#0f0f0f");

					svgString += lineHorizontal(startX + 10, midY - 100, 30, "1.0", "#0f0f0f");
					svgString += arrowLeft(startX + 10, midY - 100);

					startX += partLength;
				}
			}
		}

		startX = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		midY = 120;

		for (let [index, component] of this.pencil.components.entries()) {
			if((index !== 0 && component.hasInternalStart)) {
				midY += 120;
			}
		}

		return(svgString);
	}

	private oldrenderExplodedSideComponents(colourIndex:number): string {
		let svgString: string = "";
		let startX: number = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		let midY: number = 120;

		let colour: OpaqueColour = new OpaqueColour(this.pencil.colourMap, "white");

		for (let [index, component] of this.pencil.components.entries()) {
			if(index !== 0) {
				// if we have an internal_start part, then increment the
				if(component.hasInternalStart) {
					midY += 100;
				}
			}

			colour = component.getOpacityColour(colourIndex);
			// colour = this.getMappedColour(component.colours, colourIndex, colour.colour);

			let partLength:number = 0;
			let endPartLength: number = 0;

			if(component.isHidden) {
				let totalLength: number = component.length;
				if (component.hasInternalStart) {
					startX -= partLength;

					for (let internalPart of component.internalStart) {
						startX -= internalPart.length * 5;
					}

					svgString += lineHorizontal(startX - 40, midY, 30, "1.0", "#0f0f0f");
					svgString += arrowLeft(startX - 30, midY);
					svgString += lineVertical(startX - 40, midY - 50, 50, "1.0", "#0f0f0f");


					let prevStartX = startX;

					for (let internalPart of component.internalStart) {
						colour = internalPart.getOpacityColour(colourIndex);
						svgString += super.renderPart(startX, midY, internalPart, colourIndex);
						startX += internalPart.length * 5
					}


					svgString += `<line x1="${prevStartX - 40}" ` +
						`y1="${midY - 50}" ` +
						`x2="${startX + 40}" ` +
						`y2="${midY - 50}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;

					svgString += lineVertical(startX, midY - 40, 80, "1.0", "white");
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "black", "2,3");

					svgString += lineVertical(startX + 40, midY - 100, 50, "1.0", "#0f0f0f");

					svgString += lineHorizontal(startX + 10, midY - 100, 30, "1.0", "#0f0f0f");
					svgString += arrowLeft(startX + 10, midY - 100);
				}

				if (component.hasInternalEnd) {
					// now draw the dotted line
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "white");
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "black", "2,3");

					let previousPart:Part = null;
					for (let internalPart of component.internalEnd) {
						colour = internalPart.getOpacityColour(colourIndex);
						svgString += super.renderPart(startX, midY, internalPart, colourIndex);
						totalLength += internalPart.length;
						startX += internalPart.length * 5

						// if we have an offset (which we only have on an end internal)
						// we want to re-write the previous part - hacky, but will cover this
						// part if it is not opaque
						if(previousPart !== null && internalPart.internalOffset !== 0) {
							startX -= internalPart.length * 5;
							startX -= previousPart.length * 5;
							svgString += super.renderPart(startX, midY, previousPart, colourIndex);
							startX += previousPart.length * 5;
							startX += internalPart.length * 5;
						}
						previousPart = internalPart;
					}

					startX -= totalLength * 5;

					// and for the arrows
					svgString += lineHorizontal(startX + 10, midY, 30  + totalLength * 5, "1.0", "#0f0f0f");
					svgString += arrowLeft(startX + 10, midY);

					svgString += lineVertical(startX + 40 + totalLength * 5, midY, 50, "1.0", "#0f0f0f");

					// in between the component line
					svgString += `<line x1="${startX - 40}" ` +
						`y1="${midY + 50}" ` +
						`x2="${startX + 40  + totalLength * 5}" ` +
						`y2="${midY + 50}" ` +
						`stroke-linecap="round" ` +
						`stroke="#0f0f0f" ` +
						`stroke-width="1.0" />\n`;


					// next part horizontal line
					svgString += lineHorizontal(startX - 40, midY + 100, 30, "1.0", "#0f0f0f");

					svgString += arrowLeft(startX - 30, midY + 100);

					svgString += lineVertical(startX - 40, midY + 50, 50, "1.0", "#0f0f0f");

					midY += 100;
				}
			} else {

				svgString += this.renderSideComponent(startX, midY, component, colourIndex);
				// This part is not hidden - i.e. a hidden component is only rendered internally
				// for (let part of component.parts) {
				// 	// render the visible part
				// 	svgString += `<!-- part ${part.shape} -->`;
				// 	svgString += super.renderPart(startX, midY, part, colourIndex);
				//
				// 	colour = part.getOpacityColour(colourIndex);
				// 	// colour = this.getMappedColour(part.colours, colourIndex, colour.colour);
				// 	// TODO - why is the taper off
				// 	svgString += super.renderTaper(startX, midY, part, colourIndex, colour.colour);
				//
				// 	startX += part.length * 5;
				// 	// for internal start parts we will need this value to go back
				// 	partLength += part.length * 5;
				// }
				// we are going to render
				// for (let internalEnd of component.internalEnd) {
				// 	colour = internalEnd.getOpacityColour(colourIndex);
				// 	// colour = this.getMappedColour(internalEnd.colours, colourIndex, colour.colour);
				// 	startX += internalEnd.internalOffset * 5;
				// 	svgString += `<!-- end ${internalEnd.shape} -->`;
				// 	svgString += super.renderPart(startX, midY,  internalEnd, colourIndex);
				// 	startX += internalEnd.length * 5;
				// 	endPartLength += internalEnd.length * 5;
				// 	endPartLength += internalEnd.internalOffset * 5;
				// }

				if (component.hasInternalEnd) {
					startX -= endPartLength;

					// now draw the dotted line
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "white");
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "black", "2,3");

					// and for the arrows
					svgString += lineHorizontal(startX + 10, midY, 30 + endPartLength, "2.0", "white");
					svgString += lineHorizontal(startX + 10, midY, 30 + endPartLength, "1.0", "#0f0f0f");

					svgString += arrowLeft(startX + 10, midY);

					svgString += lineVertical(startX + 40 + endPartLength, midY, 50, "2.0", "white");
					svgString += lineVertical(startX + 40 + endPartLength, midY, 50, "1.0", "#0f0f0f");

					// in between the component line
					svgString += lineHorizontal(startX - 40, midY + 50, (startX + 40 + endPartLength) - (startX - 40), "2.0", "white");
					svgString += lineHorizontal(startX - 40, midY + 50, (startX + 40 + endPartLength) - (startX - 40), "1.0", "#0f0f0f");


					// next part horizontal line
					svgString += lineHorizontal(startX - 40, midY + 100, 30, "2.0", "white");
					svgString += lineHorizontal(startX - 40, midY + 100, 30, "1.0", "#0f0f0f");

					svgString += arrowLeft(startX - 30, midY + 100);

					svgString += lineVertical(startX - 40, midY + 50, 50, "2.0", "white");
					svgString += lineVertical(startX - 40, midY + 50, 50, "1.0", "#0f0f0f");

					midY += 100;

				}

				if (component.hasInternalStart) {
					startX -= partLength;

					for (let internalPart of component.internalStart) {
						startX -= internalPart.length * 5;
					}

					svgString += lineHorizontal(startX - 40, midY, 30, "2.0", "white");
					svgString += lineHorizontal(startX - 40, midY, 30, "1.0", "#0f0f0f");
					svgString += arrowLeft(startX - 30, midY);
					svgString += lineVertical(startX - 40, midY - 50, 50, "2.0", "white");
					svgString += lineVertical(startX - 40, midY - 50, 50, "1.0", "#0f0f0f");


					let prevStartX = startX;
					let totalLength: number = component.length;

					for (let internalPart of component.internalStart) {
						colour = internalPart.getOpacityColour(colourIndex);
						// colour = this.getMappedColour(internalPart.colours, colourIndex, colour.colour);
						svgString += super.renderPart(startX, midY, internalPart, colourIndex);
						totalLength += internalPart.length;
						startX += internalPart.length * 5
					}

					svgString += lineHorizontal(prevStartX - 40, midY - 50, (startX + 40) - (prevStartX - 40), "2.0", "white");
					svgString += lineHorizontal(prevStartX - 40, midY - 50, (startX + 40) - (prevStartX - 40), "1.0", "#0f0f0f");

					svgString += lineVertical(startX, midY - 40, 80, "1.0", "white");
					svgString += lineVertical(startX, midY - 40, 80, "1.0", "black", "2,3");

					svgString += lineVertical(startX + 40, midY - 100, 50, "2.0", "#ffffff");
					svgString += lineVertical(startX + 40, midY - 100, 50, "1.0", "#0f0f0f");

					svgString += lineHorizontal(startX + 10, midY - 100, 30, "1.0", "#0f0f0f");
					svgString += arrowLeft(startX + 10, midY - 100);

					startX += partLength;
				}
			}
		}

		startX = this.SVG_WIDTH/2 - (this.pencil.totalLength*5/2);
		midY = 120;

		for (let [index, component] of this.pencil.components.entries()) {
			if((index !== 0 && component.hasInternalStart)) {
				midY += 120;
			}
		}

		return(svgString);
	}

}