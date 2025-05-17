// the height/width of the dimension marker
import {Part} from "../model/Part.ts";
import {Extra} from "../model/Extra.ts";
import {ExtraPart} from "../model/ExtraPart.ts";

const DIMENSION_MARKER_LENGTH = 22;

export function drawTextBoldCentred(text: string, x: number, y:number, fontSize:string) {
	return(`<text x="${x}" ` +
			`y="${y}" ` +
			`font-size="${fontSize}" font-weight="bold" text-anchor="middle" ` +
			`dominant-baseline="central">${text}</text>\n`);
}

export function drawTextBold(text, x, y, fontSize) {
	return(`<text x="${x}" ` +
			`y="${y}" ` +
			`font-size="${fontSize}" font-weight="bold"> ` +
			`${text}</text>\n`);

}

export function drawText(text, x, y, fontSize) {
	return(`<text x="${x}" ` +
			`y="${y}" ` +
			`font-size="${fontSize}"> ` +
			`${text}</text>\n`);
}

export function drawOutlineHexagon(x, y, height, fillColour) {
	// do some mathematics for the hexagon
	let apothem = height/2 * 5;
	// going around the points from top left - clockwise
	let radians = 30 * Math.PI/180
	let A = apothem * Math.tan(radians);
	// Hypotenuse
	let H = apothem/Math.cos(radians);
	return(`<polygon points="` +
			`${x - A},${y - height/2 * 5} ` + // A
			`${x + A},${y - height/2 * 5} ` + // B
			`${x + H},${y} ` +  // C
			`${x + A},${y + height/2 * 5} ` + // D
			`${x - A},${y + height/2 * 5} ` + // E
			`${x - H},${y} ` + // F
			`" stroke="dimgray" stroke-width="1" fill="${fillColour}"/>\n`);
}

export function drawOutlineOctagon(x, y, height, fillColour) {
	// do some mathematics for the octagon
	let apothem = height/2 * 5;
	// going around the points from top left - clockwise
	let radians = 22.5 * Math.PI/180
	let A = apothem * Math.tan(radians);
	return(`<polygon points="` +
			`${x - A},${y - height/2 * 5} ` + // A
			`${x + A},${y - height/2 * 5} ` + // B
			`${x + height/2 * 5},${y - A} ` +  // C
			`${x + height/2 * 5},${y + A} ` +  // D
			`${x + A},${y + height/2 * 5} ` + // E
			`${x - A},${y + height/2 * 5} ` + // F
			`${x - height/2 * 5},${y + A} ` +  // G
			`${x - height/2 * 5},${y - A} ` +  // H
			`" stroke="dimgray" stroke-width="1" fill="${fillColour}"/>\n`);
}

export function drawOutlineCircle(radius, x, y, fillColour) {
	return(`<circle r="${radius}" `+
			`cx="${x}" ` +
			`cy="${y}" ` +
			`stroke="dimgray" stroke-width="1" fill="${fillColour}" />\n`);
}

export function drawShapeDetails(xStart, y, width) {
	return(`<line x1="${xStart}" ` +
			`y1="${y}" ` +
			`x2="${xStart + width}" ` +
			`y2="${y}" ` +
			`stroke-width="1.5" stroke="black" fill="none" stroke-opacity="0.5"/>\n` +
			`<line x1="${xStart}" ` +
			`y1="${y}" ` +
			`x2="${xStart + width}" ` +
			`y2="${y}" ` +
			`stroke-width="0.5" stroke="gray" fill="none" stroke-opacity="0.5"/>\n`);
}

export function drawExtra(offsetX: number, offsetY: number, parts: Part[], strokeColour: string):string {
	let thisStrokeColour = "black";
	if(strokeColour === "black") {
		thisStrokeColour = "dimgray";
	}
	let svgString = "";
	for(const part of parts) {
		if(part["line"]) {
			const points = part["line"];
			svgString += `<line x1="${offsetX + (points[0] * 5)}" ` +
					`y1="${offsetY + (points[1] * 5)+ 1}" ` +
					`x2="${offsetX + (points[2] * 5)}" ` +
					`y2="${offsetY + (points[3] * 5)+ 1}" ` +
					`stroke-width="3" stroke="${thisStrokeColour}" fill="dimgray" stroke-linecap="round" />\n/>`;
		} else if(part["curve"]) {
			const points = part["curve"];
			svgString += `<path d="M${offsetX + (points[0] * 5)} ${offsetY + (points[1] * 5) + 1} ` +
					`Q${offsetX + (points[4] * 5)} ${offsetY + (points[5] * 5) + 1} ` +
					`${offsetX + (points[2] * 5)} ${offsetY + (points[3] * 5) + 1}" ` +
					`stroke-width="3" stroke="${thisStrokeColour}" fill="none" stroke-linecap="round" />\n`
		} else if(part["curve-fill"]) {
			const points = part["curve-fill"];
			svgString += `<path d="M${offsetX + (points[0] * 5)} ${offsetY + (points[1] * 5)} ` +
					`Q${offsetX + (points[4] * 5)} ${offsetY + (points[5] * 5) + 1} ` +
					`${offsetX + (points[2] * 5)} ${offsetY + (points[3] * 5)} Z" ` +
					`stroke-width="3" stroke="${thisStrokeColour}" fill="dimgray" stroke-linecap="round" />\n`
		}
	}

	for(const part of parts) {
		if(part["line"]) {
			const points = part["line"];
			svgString += `<line x1="${offsetX + (points[0] * 5)}" ` +
					`y1="${offsetY + (points[1] * 5) + 1}" ` +
					`x2="${offsetX + (points[2] * 5)}" ` +
					`y2="${offsetY + (points[3] * 5) + 1}" ` +
					`stroke-width="2" stroke="${strokeColour}" fill="${strokeColour}" stroke-linecap="round" />\n/>`;
		} else if(part["curve"]) {
			const points = part["curve"];
			svgString += `<path d="M${offsetX + (points[0] * 5)} ${offsetY + (points[1] * 5) + 1} ` +
					`Q${offsetX + (points[4] * 5)} ${offsetY + (points[5] * 5) + 1} ` +
					`${offsetX + (points[2] * 5)} ${offsetY + (points[3] * 5) + 1}" ` +
					`stroke-width="2" stroke="${strokeColour}" fill="none" stroke-linecap="round" />\n`
		} else if(part["curve-fill"]) {
			const points = part["curve-fill"];
			svgString += `<path d="M${offsetX + (points[0] * 5)} ${offsetY + (points[1] * 5)} ` +
					`Q${offsetX + (points[4] * 5)} ${offsetY + (points[5] * 5)} ` +
					`${offsetX + (points[2] * 5)} ${offsetY + (points[3] * 5)} Z" ` +
					`stroke-width="2" stroke="${strokeColour}" fill="${strokeColour}" stroke-linecap="round" />\n`
		}
	}
	return(svgString);
}

export function drawExtraBackground(offsetX: number, offsetY: number, extraParts: ExtraPart[]):string {
	let thisStrokeColour = "dimgray";

	let svgString: string = "";
	for(const extraPart of extraParts) {
		const points: number[] = extraPart.points;
		switch (extraPart.type) {
			case "line":
				svgString += `<line x1="${offsetX + (points[0] * 5)}" ` +
						`y1="${offsetY + (points[1] * 5)+ 1}" ` +
						`x2="${offsetX + (points[2] * 5)}" ` +
						`y2="${offsetY + (points[3] * 5)+ 1}" ` +
						`stroke-width="3" stroke="${thisStrokeColour}" fill="dimgray" stroke-linecap="round" />\n`;
				break;
			case "curve":
				svgString += `<path d="M${offsetX + (points[0] * 5)} ${offsetY + (points[1] * 5) + 1} ` +
					`Q${offsetX + (points[4] * 5)} ${offsetY + (points[5] * 5) + 1} ` +
					`${offsetX + (points[2] * 5)} ${offsetY + (points[3] * 5) + 1}" ` +
					`stroke-width="3" stroke="${thisStrokeColour}" fill="none" stroke-linecap="round" />\n`
				break;
			case "curve-fill": {
				svgString += `<path d="M${offsetX + (points[0] * 5)} ${offsetY + (points[1] * 5)} ` +
						`Q${offsetX + (points[4] * 5)} ${offsetY + (points[5] * 5) + 1} ` +
						`${offsetX + (points[2] * 5)} ${offsetY + (points[3] * 5)} Z" ` +
						`stroke-width="3" stroke="${thisStrokeColour}" fill="dimgray" stroke-linecap="round" />\n`
			}
		}
	}

	return(svgString);
}

export function drawExtraForeground(offsetX: number, offsetY: number, extraParts: ExtraPart[], fillColour: string):string {

	let svgString: string = "<!--julian-->";

	for(const extraPart of extraParts) {
		const points: number[] = extraPart.points;
		switch (extraPart.type) {
			case "line":
			svgString += `<line x1="${offsetX + (points[0] * 5)}" ` +
					`y1="${offsetY + (points[1] * 5) + 1}" ` +
					`x2="${offsetX + (points[2] * 5)}" ` +
					`y2="${offsetY + (points[3] * 5) + 1}" ` +
					`stroke-width="2" stroke="${fillColour}" fill="${fillColour}" stroke-linecap="round" />\n`;
			break;
			case "curve":
			svgString += `<path d="M${offsetX + (points[0] * 5)} ${offsetY + (points[1] * 5) + 1} ` +
					`Q${offsetX + (points[4] * 5)} ${offsetY + (points[5] * 5) + 1} ` +
					`${offsetX + (points[2] * 5)} ${offsetY + (points[3] * 5) + 1}" ` +
					`stroke-width="2" stroke="${fillColour}" fill="none" stroke-linecap="round" />\n`
				break;
			case "curve-fill":
			svgString += `<path d="M${offsetX + (points[0] * 5)} ${offsetY + (points[1] * 5)} ` +
					`Q${offsetX + (points[4] * 5)} ${offsetY + (points[5] * 5)} ` +
					`${offsetX + (points[2] * 5)} ${offsetY + (points[3] * 5)} Z" ` +
					`stroke-width="2" stroke="${fillColour}" fill="${fillColour}" stroke-linecap="round" />\n`
				break;
		}
	}
	return(svgString);
}

export function renderBackExtra(x, y, offsetX, offsetY, width, parts, fillColour) {
	let svgString = "";
	let points = [];
	let isCurve = false;
	for(const part of parts) {
		if(part["line"]) {
			points = part["line"];
		} else if(part["curve"]) {
			points = part["curve"];
			isCurve = true;
		} else if(part["curve-fill"]) {
			points = part["curve-fill"];
			isCurve = true;
		}

		// don't care what it is, always top to bottom
		let maxY = Math.max(points[1], points[3]);
		let minY = Math.min(points[1], points[3]);
		let height = Math.abs(maxY - minY);
		if(height === 0) {
			height = 3/5;
		}
		svgString += `<!-- WxH ${width} ${height} -->`;
		svgString += `<rect x="${x - width/2*5}" ` +
				`y="${y - Math.abs(offsetY) * 5 - (height * 5)}" ` +
				`width="${width * 5}" ` +
				`height="${height * 5}" ` +
				`rx="1" ry="1" stroke-width="1.0" stroke="dimgray" fill="${fillColour}"/>\n`;

		if(isCurve) {
			let from = y - Math.abs(offsetY) * 5 - (height * 5);
			let to = from + (height * 5);
			svgString += `<line x1="${x - width/2*5}" x2="${x + width/2*5}" y1="${from}" y2="${from+3}" stroke-width="0.5" stroke="#cfcfcf" />\n`;

			for (let i = from + 3; i < to; i = i + 3) {
				svgString += `<line x1="${x - width/2*5}" x2="${x + width/2*5}" y1="${i}" y2="${i}" stroke-width="0.5" stroke="#cfcfcf" />\n`;
				svgString += `<line x1="${x - width/2*5}" x2="${x + width/2*5}" y1="${i}" y2="${i + 3}" stroke-width="0.5" stroke="#cfcfcf" />\n`;
			}
		}

		svgString += `<rect x="${x - width/2*5}" ` +
				`y="${y - Math.abs(offsetY) * 5 - (height * 5)}" ` +
				`width="${width * 5}" ` +
				`height="${height * 5}" ` +
				`rx="1" ry="1" stroke-width="1.0" stroke="dimgray" fill="none"/>\n`;

	}
	return(svgString);
}

export function lineHorizontalGuide(x: number, y: number, width: number): string {
	return(lineHorizontal(x, y, width, "1", "#cfcfcf"));
}

export function lineHorizontal(x: number, y: number, width: number, strokeWidth: string, strokeColour: string, strokeDash:string=null): string {
	let svgString: string = `<line x1="${x}" ` +
		`y1="${y}" ` +
		`x2="${x + width}" ` +
		`y2="${y}" ` +
		`stroke-linecap="round" ` +
		`stroke="${strokeColour}" ` +
		`${(null !== strokeDash ? `stroke-dasharray="${strokeDash}" ` : " ")}` +
		`stroke-width="${strokeWidth}" />\n`;
	return(svgString);
}

export function lineVerticalGuide(x: number, y: number, height: number, strokeWidth:string="1"): string {
	return(lineVertical(x, y, height, strokeWidth, "#cfcfcf"));
}

export function circle(x: number, y: number, radius: number, strokeWidth: string, strokeColour: string, fillColour:String="none"): string {
	return(`<circle r="${radius}" `+
			`cx="${x}" ` +
			`cy="${y}" ` +
			`fill="${fillColour}" ` +
			`stroke="${strokeColour}" ` +
			`stroke-width="${strokeWidth}"  />\n`);

}
export function lineVertical(x: number, y: number, height: number, strokeWidth: string, strokeColour: string, strokeDashArray: string=null): string {
	let svgString: string = "";
	svgString += `<line x1="${x}" ` +
		`y1="${y}" ` +
		`x2="${x}" ` +
		`y2="${y + height}" ` +
		`stroke="${strokeColour}" ` +
		`stroke-linecap="round" ` +
		`${(null !== strokeDashArray ? `stroke-dasharray="${strokeDashArray}" ` : " ")}` +
		`stroke-width="${strokeWidth}" />\n`;
	return(svgString);
}

export function target(x:number, y:number, length:number, radius:number):string {
	let svgString = "";
	svgString += lineHorizontal(x - length/2, y, length, "1", "#000000");
	svgString += lineVertical(x, y - length/2, length, "1", "#000000");
	svgString += circle(x, y, radius, "1", "#000000");
	return(svgString);
}

export enum TextOrientation {
	CENTER,
	TOP,
	TOP_ROTATED,
	RIGHT,
	RIGHT_ROTATED,
	BOTTOM,
	BOTTOM_ROTATED,
	LEFT,
	LEFT_ROTATED
}

/**
 * <p>Generate Horizontal dimension markers</p>
 *
 * <pre>
 *       (x,y)
 *         |
 *         |
 *        \|/
 *       --+--
 *         |
 *         |
 *         |
 *       --+--
 * </pre>
 *
 * @param x The start X position
 * @param y The start Y position
 * @param height The width of the dimension marker
 * @param text The text to display (can be null)
 * @param textOrientation The text orientation for the displayed text (default: TextOrientation.TOP)
 * @param shouldBold Optional, whether the text should be bold (default 'true')
 */
export function dimensionsVertical(x: number, y:number, height:number, text: string=null, textOrientation: TextOrientation=TextOrientation.TOP, shouldBold: boolean=true): string {
	let svgString: string = "";
	// first we are going to draw the top horizonal line
	svgString += `<line x1="${x - DIMENSION_MARKER_LENGTH/2}" ` +
		`y1="${y}" ` +
		`x2="${x + DIMENSION_MARKER_LENGTH/2}" ` +
		`y2="${y}" ` +
		`stroke="black" stroke-width="1" />\n`;

	// now for the vertical line

	svgString += `<line x1="${x}" ` +
		`y1="${y}" ` +
		`x2="${x}" ` +
		`y2="${y + height}" ` +
		`stroke="black" stroke-width="1" />\n`;

	// the bottom horizontal line
	svgString += `<line x1="${x - DIMENSION_MARKER_LENGTH/2}" ` +
		`y1="${y + height}" ` +
		`x2="${x + DIMENSION_MARKER_LENGTH/2}" ` +
		`y2="${y + height}" ` +
		`stroke="black" stroke-width="1" />\n`;

	// lastly the text
	if(text) {
		switch (textOrientation) {
			case TextOrientation.TOP:
				svgString += `<text ` +
						`x="${x}" ` +
						`y="${y - 8}" ` +
						`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
						`font-size="1.2em" ` +
						`text-anchor="middle" ` +
						`dominant-baseline="auto" ` +
						`fill="black">` +
						`${text}` +
						`</text>\n`;
				break;
			case TextOrientation.TOP_ROTATED:
				svgString += `<text ` +
						`x="${x}" ` +
						`y="${y - 8}" ` +
						`transform="rotate(-90, ${x}, ${y - 8})" ` +
						`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
						`font-size="1.2em" ` +
						`text-anchor="start" ` +
						`dominant-baseline="middle" ` +
						`fill="black">` +
						`${text}` +
						`</text>\n`
				break;
			case TextOrientation.RIGHT:
				svgString += `<text ` +
					`x="${x + 2 + DIMENSION_MARKER_LENGTH/2}" ` +
					`y="${y + height/2}" ` +
					`font-size="1.2em" ` +
					`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
					`text-anchor="start" ` +
					`dominant-baseline="central" fill="black">` +
					`${text}` +
					`</text>\n`;
				break;
			case TextOrientation.RIGHT_ROTATED:
				break;
			case TextOrientation.BOTTOM:
				svgString += `<text ` +
						`x="${x}" ` +
						`y="${y + height + 8}" ` +
						`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
						`font-size="1.2em" ` +
						`text-anchor="end" ` +
						`dominant-baseline="middle" ` +
						`fill="black">` +
						`${text}` +
						`</text>\n`
				break;
			case TextOrientation.BOTTOM_ROTATED:
				svgString += `<text ` +
						`x="${x}" ` +
						`y="${y + height + 8}" ` +
						`transform="rotate(-90, ${x}, ${y + height + 8})" ` +
						`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
						`font-size="1.2em" ` +
						`text-anchor="end" ` +
						`dominant-baseline="middle" ` +
						`fill="black">` +
						`${text}` +
						`</text>\n`
				break;
			case TextOrientation.LEFT:
				svgString += `<text ` +
						`x="${x - 8 - DIMENSION_MARKER_LENGTH/2}" ` +
						`y="${y + height/2}" ` +
						`font-size="1.2em" ` +
						`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
						`text-anchor="end" ` +
						`dominant-baseline="central" fill="black">` +
						`${text}` +
						`</text>\n`;
				break;
			case TextOrientation.LEFT_ROTATED:
				svgString += `<text ` +
					`x="${x - 8 - DIMENSION_MARKER_LENGTH/2}" ` +
					`y="${y + height/2}" ` +
					`transform="rotate(-90, ${x - 8 - DIMENSION_MARKER_LENGTH/2}, ${y + height/2})" ` +
					`font-size="1.2em" ` +
					`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
					`text-anchor="middle" ` +
					`dominant-baseline="central" fill="black">` +
					`${text}` +
					`</text>\n`;
				break;
		}
	}
	return(svgString);
}

/**
 * <p>Generate Horizontal dimension markers</p>
 *
 * <pre>
 *            |                     |
 * (x,y) -->  +---------------------+
 *            |                     |
 * </pre>
 *
 * @param x The start X position
 * @param y The start Y position
 * @param width The width of the dimension marker
 * @param text The text to display (can be null)
 * @param textOrientation The text orientation for the displayed text (default: TextOrientation.TOP)
 * @param shouldBold Optional, whether the text should be bold (default 'true')
 */
export function dimensionsHorizontal(x: number, y:number, width:number, text: string=null, textOrientation: TextOrientation=TextOrientation.TOP, shouldBold: boolean=true): string {
	let svgString: string = "";
	// first we are going to draw the left vertical line
	svgString += `<line x1="${x}" ` +
		`y1="${y - DIMENSION_MARKER_LENGTH/2}" ` +
		`x2="${x}" ` +
		`y2="${y + DIMENSION_MARKER_LENGTH/2}" ` +
		`stroke="black" stroke-width="1" />\n`;

	// now for the horizonal line

	svgString += `<line x1="${x}" ` +
		`y1="${y}" ` +
		`x2="${x + width}" ` +
		`y2="${y}" ` +
		`stroke="black" stroke-width="1" />\n`;

	// the right vertical line
	svgString += `<line x1="${x + width}" ` +
		`y1="${y - DIMENSION_MARKER_LENGTH/2}" ` +
		`x2="${x + width}" ` +
		`y2="${y + DIMENSION_MARKER_LENGTH/2}" ` +
		`stroke="black" stroke-width="1" />\n`;

	// lastly the text
	if(text) {
		let linedText:string = "";
		let strings = text.split("\n");
		for (const [index, string] of strings.entries()) {
			linedText += `<tspan x="${x + width/2 - ((strings.length - 1) * 8)}" dy="${index === 0 ? "0" : "1em"}">${string}</tspan>`;
		}

		switch (textOrientation) {
			case TextOrientation.CENTER:
				svgString += `<text ` +
						`x="${x + width/2}" ` +
						`y="${y - ((strings.length - 1) * 8)}" ` +
						`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
						`font-size="1.2em" ` +
						`text-anchor="middle" ` +
						`dominant-baseline="middle" ` +
						`fill="black">` +
						`${linedText}` +
						`</text>\n`;
				break;
			case TextOrientation.TOP:
				svgString += `<text ` +
					`x="${x + width/2}" ` +
					`y="${y  - 8 - DIMENSION_MARKER_LENGTH/2}" ` +
					`font-size="1.2em" ` +
					`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
					`text-anchor="middle" ` +
					`dominant-baseline="central" fill="black">` +
					`${linedText}` +
					`</text>\n`
				break;
			case TextOrientation.BOTTOM:
				svgString += `<text ` +
					`x="${x + width/2}" ` +
					`y="${y  + 8 + DIMENSION_MARKER_LENGTH/2}" ` +
					`font-size="1.2em" ` +
					`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
					`text-anchor="middle" ` +
					`dominant-baseline="central" fill="black">` +
					`${linedText}` +
					`</text>\n`
				break;
			case TextOrientation.BOTTOM_ROTATED:
				svgString += `<text ` +
						`x="${x + width/2}" ` +
						`y="${y + 8 + DIMENSION_MARKER_LENGTH/2}" ` +
						`font-size="1.2em" ` +
						`transform="rotate(-90, ${x + width/2 - ((strings.length-1) * 12)}, ${y + 8 + DIMENSION_MARKER_LENGTH/2})" ` +
						`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
						`text-anchor="end" ` +
						`dominant-baseline="middle" fill="black">` +
						`${linedText}` +
						`</text>\n`
				break;			case TextOrientation.TOP_ROTATED:
				svgString += `<text ` +
					`x="${x + width/2}" ` +
					`y="${y - 8 - DIMENSION_MARKER_LENGTH/2}" ` +
					`font-size="1.2em" ` +
					`transform="rotate(-90, ${x + width/2 - ((strings.length-1) * 12)}, ${y - 8 - DIMENSION_MARKER_LENGTH/2})" ` +
					`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
					`text-anchor="start" ` +
					`dominant-baseline="central" fill="black">` +
					`${linedText}` +
					`</text>\n`
				break;
		}
	}
	return(svgString);
}
export function rectangle(x:number, y:number, width:number, height:number, strokeColour:string, fillColour:string): string {
	let svgString = "";
	svgString += `<rect x="${x}" ` +
		`y="${y}" ` +
		`width="${width}" ` +
		`height="${height}" ` +
		`rx="1" ry="1" stroke-width="0.5" stroke="${strokeColour}" fill="${fillColour}"/>\n`
	return(svgString);

}

// export function textSmall(x: number, y:number, text: string, textColour: string, textOrientation: TextOrientation=TextOrientation.TOP, shouldBold: boolean=true) {
// 	let svgString: string = "";
// 	switch (textOrientation) {
// 		case TextOrientation.LEFT_ROTATED:
// 			svgString += `<text ` +
// 				`x="${x - 8 - DIMENSION_MARKER_LENGTH/2}" ` +
// 				`y="${y + height/2}" ` +
// 				`transform="rotate(-90, ${x - 8 - DIMENSION_MARKER_LENGTH/2}, ${y + height/2})" ` +
// 				`font-size="1.2em" ` +
// 				`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
// 				`text-anchor="middle" ` +
// 				`dominant-baseline="central" fill="black">` +
// 				`${text}` +
// 				`</text>\n`
// 			break;
// 		case TextOrientation.RIGHT:
// 			svgString += `<text ` +
// 				`x="${x + 2 + DIMENSION_MARKER_LENGTH/2}" ` +
// 				`y="${y + height/2}" ` +
// 				`font-size="1.2em" ` +
// 				`${(shouldBold ? "font-weight=\"bold\"" : "")} ` +
// 				`text-anchor="start" ` +
// 				`dominant-baseline="central" fill="black">` +
// 				`${text}` +
// 				`</text>\n`
// 			break;
// 	}
// 	return(svgString);
// }
