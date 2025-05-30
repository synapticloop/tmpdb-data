import {Pencil} from "../../../model/Pencil.ts";
import {SVGRenderer} from "../SVGRenderer.ts";
import {
	arrowLeft, lineHorizontal,
	lineVertical,
} from "../../../utils/svg-helper.ts";
import {Part} from "../../../model/Part.ts";
import {Component} from "../../../model/Component.ts";

class ComponentMarker {
	xLeft: number;
	yLeft: number;
	lengthLeft: number;

	xRight: number;
	yRight: number;
	lengthRight: number;

	public addMarker(x: number, y: number, length: number): void {
		if(length <= 0) {
			this.xLeft = x;
			this.yLeft = y;
			if(length === -Infinity) {
				this.lengthLeft = 0;
			} else {
				this.lengthLeft = length;
			}
		} else {
			this.xRight = x;
			this.yRight = y;

			if(length === Infinity) {
				this.lengthRight = 0;
			} else {
				this.lengthRight = length;
			}
		}
	}

	toString(): string {
		return(`Left ${this.xLeft},${this.yLeft} [${this.lengthLeft}] => ${this.xRight},${this.yRight} [${this.lengthRight}] Right`);
	}
}

export class SVGTechnicalExplodedRenderer extends SVGRenderer {
	SVG_WIDTH: number = 1200;
	SVG_HEIGHT: number = 120;

	// this switch is to debug the component markers - which will draw lines
	// where needed in various colours
	debug: boolean = true;

	private markerMap: Map<number, ComponentMarker> = new Map<number, ComponentMarker>();

	constructor(pencil: Pencil, pencilDir: string) {
		super(pencil, 1200, 200, "SVGTechnicalExplodedRenderer", pencilDir);
	}

	/**
	 * <p>Generate the SVG as a string with the colour</p>
	 *
	 * @param colourIndex the pencil colour index
	 *
	 * @returns {string} The SVG data as a String
	 */
	render(colourIndex: number):string {
		// determine the this.SVG_HEIGHT

		let previousComponent: Component = null;
		for(const [index, component] of this.pencil.components.entries()) {
			if(index !== 0) {
				if ((component.hasInternalStart || component.isHidden) && !previousComponent.isHidden) {
					this.SVG_HEIGHT += 120;
				}
			}

			if(component.hasInternalEnd && !component.isHidden) {
				this.SVG_HEIGHT += 120;
			}

			if(component.isHidden) {
				this.SVG_HEIGHT += 120;
			}

			previousComponent = component;
		}

		// TODO - fix the above...

		this.SVG_HEIGHT += 120

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
		let y: number = 120;

		// draw the components
		let previousComponent: Component = null;

		let startNonInternal: boolean = false;

		for (let [index, component] of this.pencil.components.entries()) {
			let incremented: boolean = false;

			if(index !== 0) {
				if((component.hasInternalStart || component.isHidden) && !previousComponent.isHidden) {

					if(!previousComponent.hasInternal || component.hasInternalStart) {
						this.markComponent(y + 60, x, y, Infinity)
						if(this.debug) {
							svgString += lineHorizontal(x, y, 40, "5", "orange");
							svgString += lineVertical(x + 40, y, 60, "5", "orange");
						}
					}

					incremented = true;
					y += 120;
				}

				if(!component.hasInternal && !startNonInternal) {
					startNonInternal = true;
				}
			}

			if(component.hasInternal) {
				startNonInternal = false;
			}

			// first thing is to render the internal start parts (which is offset)
			x -= component.internalStartLength * 5;

			let internalStartOffset: number = 0;
			for(const [ index, internalStart ] of component.internalStart.entries()) {
				svgString += super.renderPart(x, y, internalStart, colourIndex);
				x += internalStart.length * 5;
				if(component.isHidden) {
					internalStartOffset += internalStart.internalOffset * 5
				}
				x += internalStart.internalOffset * 5;
			}

			if(component.hasInternalStart) {
				this.markComponent(y - 60, x, y, -component.internalStartLength);
				if(this.debug) {
					svgString += lineHorizontal(x, y, component.internalStartLength * -5 - 40, "2", "green");
					svgString += lineVertical(x - component.internalStartLength * 5 - 40 , y, -60, "2", "green");
				}
			}


			svgString += this.renderSideComponent(x, y, component, colourIndex);
			for(let part of component.parts) {
				svgString += this.renderTaper(x, y, part, colourIndex);
				x += part.length * 5;
			}

			let previousPart: Part = null;
			for(const [ index, internalEnd ] of component.internalEnd.entries()) {
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
						x -= previousPart.length * 5;
						x -= previousPart.internalOffset * 5;
						svgString += "\n\n<!-- Previous part white -->\n";
						svgString += super.renderPart(x, y, previousPart, colourIndex);
						x += previousPart.length * 5;
						x += previousPart.internalOffset * 5;
					}
				}

				x += internalEnd.length * 5;
				x += internalEnd.internalOffset * 5;
				previousPart = internalEnd;
			}

			if(component.hasInternalEnd) {
				this.markComponent(y + 60, x - component.internalEndLength * 5, y, component.internalEndLength);
				if(this.debug) {
					svgString += lineHorizontal(x - component.internalEndLength * 5, y, component.internalEndLength * 5 + 40, "2", "blue");
					svgString += lineVertical(x + 40, y, 60, "2", "blue");
				}
			}

			if(component.hasInternalEnd  && !component.isHidden) {
				x -= component.internalEndLength * 5;
				incremented = true;
				y += 120;
			}

			previousComponent = component;

			if(component.isHidden) {
				x -= component.internalEndLength * 5;
				x -= internalStartOffset;

				incremented = true;
				y += 120;
			}

			if(!component.hasInternalStart && incremented) {
				this.markComponent(y - 60, x, y, -Infinity)
				if(this.debug) {
					svgString += lineHorizontal(x - 40, y, 40, "2", "red");
					svgString += lineVertical(x - 40, y, -60, "2", "red");
				}
			}

			if(incremented && previousComponent.isHidden) {
				// is the next component hidden?
				const nextComponent: Component = this.pencil.components[index + 1];
				if(nextComponent && !nextComponent.isHidden && !nextComponent.hasInternalStart) {
					this.markComponent(y - 60, x, y, -Infinity);
					if(this.debug) {
						svgString += lineHorizontal(x - 40, y, 40, "2", "purple");
						svgString += lineVertical(x - 40, y, -60, "2", "purple");
					}
				}
			}
		}

		for (const key of this.markerMap.keys()) {
			const componentMarker:ComponentMarker = this.markerMap.get(key);
			svgString += this.drawExplodedConnectionDetails(componentMarker);
		}

		return(svgString);
	}

	private drawExplodedConnectionDetails(componentMarker: ComponentMarker): string {
		let svgString: string = "\n\n<!-- DASHED JOIN -->\n";
		svgString += `<path d="M ${componentMarker.xRight} ${componentMarker.yRight} ` +
				`L ${componentMarker.xRight + 40 + componentMarker.lengthRight * 5} ${componentMarker.yRight} ` + // top horizontal
				`L ${componentMarker.xRight + 40 + componentMarker.lengthRight * 5} ${componentMarker.yRight + 60} ` + // right vertical
				`L ${componentMarker.xLeft + componentMarker.lengthLeft * 5 - 40} ${componentMarker.yRight + 60} ` + // middle horizontal
				`L ${componentMarker.xLeft + componentMarker.lengthLeft * 5 - 40} ${componentMarker.yLeft} ` + // left vertical
				`L ${componentMarker.xLeft} ${componentMarker.yLeft} ` + // bottom horizontal
				`" ` +
				`fill="none" ` +
				`stroke="white" ` +
				`stroke-width="1" ` +
				`stroke-linecap="round" ` +
				` />\n`;
		svgString += `<path d="M ${componentMarker.xRight} ${componentMarker.yRight} ` +
				`L ${componentMarker.xRight + 40 + componentMarker.lengthRight * 5} ${componentMarker.yRight} ` + // top horizontal
				`L ${componentMarker.xRight + 40 + componentMarker.lengthRight * 5} ${componentMarker.yRight + 60} ` + // right vertical
				`L ${componentMarker.xLeft + componentMarker.lengthLeft * 5 - 40} ${componentMarker.yRight + 60} ` + // middle horizontal
				`L ${componentMarker.xLeft + componentMarker.lengthLeft * 5 - 40} ${componentMarker.yLeft} ` + // left vertical
				`L ${componentMarker.xLeft} ${componentMarker.yLeft} ` + // bottom horizontal
				`" ` +
				`fill="none" ` +
				`stroke="black" ` +
				`stroke-width="1" ` +
				`stroke-dasharray="8,4" ` +
				`stroke-linecap="round" ` +
				` />\n`;

		// add the arrows
		svgString += arrowLeft(componentMarker.xRight + 5, componentMarker.yRight);
		svgString += arrowLeft(componentMarker.xLeft - 20 + componentMarker.lengthLeft * 5, componentMarker.yLeft);

		if(componentMarker.lengthLeft < 0) {
			svgString += this.drawDashedJoin(componentMarker);
		}

		return(svgString);
	}

	private markComponent(yMarker: number, x: number, y: number, length: number) {
		if(this.markerMap.has(yMarker)) {
			const componentMarker: ComponentMarker = this.markerMap.get(yMarker);
			componentMarker.addMarker(x, y, length);
		} else {
			const componentMarker: ComponentMarker = new ComponentMarker();
			componentMarker.addMarker(x, y, length);
			this.markerMap.set(yMarker, componentMarker);
		}
	}

	private drawDashedJoin(componentMarker: ComponentMarker): string {
		let svgString: string = "";
		svgString += lineVertical(componentMarker.xLeft, componentMarker.yLeft - 40, 80, "1", "white");
		svgString += lineVertical(componentMarker.xLeft, componentMarker.yLeft - 40, 80, "1", "dimgray", "3,3");

		// svgString += lineVertical(componentMarker.xRight, componentMarker.yRight - 40, 80, "1", "white");
		// svgString += lineVertical(componentMarker.xRight, componentMarker.yRight - 40, 80, "1", "dimgray", "3,3");
		return(svgString);
	}
}