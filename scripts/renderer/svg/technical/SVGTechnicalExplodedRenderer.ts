import {Pencil} from "../../../model/Pencil.ts";
import {SVGRenderer} from "../SVGRenderer.ts";
import {
	arrowLeft,
	lineHorizontal,
	lineVertical,
} from "../../../utils/svg-helper.ts";
import {Part} from "../../../model/Part.ts";
import {Component} from "../../../model/Component.ts";


export class SVGTechnicalExplodedRenderer extends SVGRenderer {
	SVG_WIDTH: number = 1200;
	SVG_HEIGHT: number = 200;

	private markers: [x: number, y: number, start:number, end:number][] = [];
	private markerSet: Set<string> = new Set();

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
		let y: number = 120;

		// draw the components
		let previousComponent: Component = null;
		let hiddenOffset: number = 0;

		let startNonInternal: boolean = false;

		for (let [index, component] of this.pencil.components.entries()) {

			if(index !== 0) {
				if((component.hasInternalStart || component.isHidden) && !previousComponent.isHidden) {
					// if(previousComponent.isHidden) {
					// 	svgString += this.drawJoinedLine(x + 5, y, component.internalStartLength, previousComponent.internalEndLength, hiddenOffset);
					// } else {
					// 	svgString += this.drawJoinedLine(x + 5, y, component.internalStartLength, 0);
					// }
					// svgString += arrowLeft(x + 5, y);
					this.markInternal(x, y, component.internalStartLength, component.internalEndLength);
					y += 120;
					// svgString += arrowLeft(x - 30 - component.internalStartLength * 5, y);
				}

				if(!component.hasInternal && !startNonInternal) {
					startNonInternal = true;
					this.markInternal(x, y, component.internalStartLength, component.internalEndLength);
				}
			}

			if(component.hasInternal) {
				startNonInternal = false;
			}

			// first thing is to render the internal start parts (which is offset)
			x -= component.internalStartLength * 5;

			let internalStartOffset: number = 0;
			for(const internalStart of component.internalStart) {
				svgString += super.renderPart(x, y, internalStart, colourIndex);
				x += internalStart.length * 5;
				if(component.isHidden) {
					internalStartOffset += internalStart.internalOffset * 5
				}
				x += internalStart.internalOffset * 5;
			}

			if(component.hasInternalStart) {
				this.markInternal(x, y, component.internalStartLength, component.internalEndLength);
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
				// svgString += this.drawJoinedLine(x, y, 0, component.internalEndLength);
				// svgString += arrowLeft(x + 10, y);
				this.markInternal(x, y, 0, component.internalEndLength);
				y += 120;
				this.markInternal(x, y, 0, component.internalEndLength);
				// svgString += arrowLeft(x - 30, y);
			}

			previousComponent = component;

			if(component.isHidden) {
				x -= component.internalEndLength * 5;

				if(component.hasInternalEnd) {
					// x += component.internalEnd[0].internalOffset * 5;
					// markers.push([x, y]);
					// svgString += this.drawDashedLineTest(x, y);
					// x -= component.internalEnd[0].internalOffset * 5;
				} else {
					this.markInternal(x, y, component.internalStartLength, component.internalEndLength);
					svgString += this.drawDashedLine(x, y);
				}
				x -= internalStartOffset;

				// svgString += this.drawJoinedLineStart(x, y, 0, component.internalEndLength, hiddenOffset);
				// svgString += arrowLeft(x + 10, y);
				y += 120;
			}
		}

		// console.log(this.markers);
		// now go through the markers
		const sortedMarkers:[x: number, y: number, start: number, end: number][] = this.markers.sort(function(a:[x: number, y: number, start: number, end: number], b:[x: number, y: number, start: number, end: number ]){
			if (a[1] === b[1]) {
				return a[0] - b[0];
			}
			return a[1] - b[1];
		});

		for (let i: number = 0; i < sortedMarkers.length; i++) {
			const startMarker: number[] = sortedMarkers[i];
			svgString += lineHorizontal(startMarker[0], startMarker[1], 20, "5", "pink");
			i++;
			if(i >= sortedMarkers.length) {
				break;
			}

			const endMarker: number[] = this.markers[i];
			svgString += lineHorizontal(endMarker[0], endMarker[1], 20, "5", "pink");
			i--;

			svgString += this.drawJoinedLine(startMarker[0], endMarker[0], startMarker[1], endMarker[1], endMarker[3], startMarker[2]);
		}

		return(svgString);
	}

	private drawJoinedLine(x1: number, x2: number, y1: number, y2: number, start: number, end: number): string {
		let svgString: string = "\n\n<!-- DASHED JOIN -->\n";
		if(y1 === y2) {
			return("");
		}

		svgString += `<path d="M ${x1 + 10} ${y1} ` +
			`L ${x1 + 50 + end * 5} ${y1} ` + // top horizontal
			`L ${x1 + 50 + end * 5} ${y1 + 60} ` + // right vertical
			`L ${x1 - 50 - (x1 - x2) - start} ${y1 + 60} ` + // middle horizontal
			`L ${x1 - 50 - (x1 - x2) - start} ${y1 + 120} ` + // left vertical
			`L ${x1 - 5 - (x1 - x2)} ${y1 + 120} ` + // bottom horizontal
			`" ` +
			`fill="none" ` +
			`stroke="black" ` +
			`stroke-width="1" ` +
			`stroke-dasharray="8,4" ` +
			`stroke-linecap="round" ` +
			` />\n`;
			// svgString += `<path d="M ${x1 + 10} ${y1} ` +
			// 	`L ${x1 + 30 + (x1 - x2)} ${y1} ` + // top horizontal
			// 	`L ${x1 + 30 + (x1 - x2)} ${y1 + 60} ` + // right vertical
			// 	// `L ${x1 - 50 - startLength * 5 + hiddenOffset * 5} ${y1 + 60} ` + // middle horizontal
			// 	// `L ${x1 - 50 - startLength * 5 + hiddenOffset * 5} ${y1 + 120} ` + // left vertical
			// 	// `L ${x1 - 5 - startLength * 5 + hiddenOffset * 5} ${y1 + 120} ` + // bottom horizontal
			// 	`" ` +
			// 	`fill="none" ` +
			// 	`stroke="black" ` +
			// 	`stroke-width="1" ` +
			// 	`stroke-dasharray="8,4" ` +
			// 	`stroke-linecap="round" ` +
			// 	` />\n`;

		return(svgString);
	}

	private markInternal(x: number, y: number, start: number, end: number): void {
		const testValue = x + ":" + y;
		if(!this.markerSet.has(testValue)) {
			this.markers.push([x, y, start, end]);
			this.markerSet.add(testValue);
		}
	}

	private drawJoinedLineStart(x: number, y: number, startLength: number, endLength: number, hiddenOffset: number=0): string {
		let svgString: string = "\n\n<!-- DASHED JOIN -->\n";
		svgString += `<path d="M ${x + 10} ${y} ` +
			`L ${x + 30 + endLength * 5} ${y} ` + // top horizontal
			`L ${x + 30 + endLength * 5} ${y + 60} ` + // right vertical
			`L ${x - 50 - startLength * 5 + hiddenOffset * 5} ${y + 60} ` + // middle horizontal
			`L ${x - 50 - startLength * 5  + hiddenOffset * 5} ${y + 120} ` + // left vertical
			`L ${x - 5 - startLength * 5 + hiddenOffset * 5} ${y + 120} ` + // bottom horizontal
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
			`L ${x - 50 - startLength * 5 + hiddenOffset * 5} ${y + 60} ` + // middle horizontal
			`L ${x - 50 - startLength * 5 + hiddenOffset * 5} ${y + 120} ` + // left vertical
			`L ${x - 5 - startLength * 5 + hiddenOffset * 5} ${y + 120} ` + // bottom horizontal
			`" ` +
			`fill="none" ` +
			`stroke="green" ` +
			`stroke-width="1" ` +
			`stroke-dasharray="8,4" ` +
			`stroke-linecap="round" ` +
			` />\n`;

		return(svgString);
	}

	private drawDashedLine(x: number, y: number): string {
		let svgString: string = "";
		svgString += lineVertical(x, y - 40, 80, "1", "white");
		svgString += lineVertical(x, y - 40, 80, "1", "dimgray", "3,3");
		return(svgString);
	}
}