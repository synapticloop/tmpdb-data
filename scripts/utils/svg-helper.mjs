export function drawTextBoldCentred(text, x, y, fontSize) {
	return(`<text x="${x}" ` +
			`y="${y}" ` +
			`font-size="${fontSize}" font-weight="bold" text-anchor="middle" ` +
			`dominant-baseline="central">${text}</text>`);
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
	// Hypotenuse
	let H = apothem/Math.cos(radians);
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
			`stroke="dimgray" stroke-width="1" fill="${fillColour}" />`);
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

export function drawExtra(offsetX, offsetY, parts, strokeColour) {
	let svgString = "";
	for(const part of parts) {
		if(part["line"]) {
			const points = part["line"].split(",");
			svgString += `<line x1="${offsetX + (points[0] * 5)}" ` +
					`y1="${offsetY + (points[1] * 5)}" ` +
					`x2="${offsetX + (points[2] * 5)}" ` +
					`y2="${offsetY + (points[3] * 5)}" ` +
					`stroke-width="4.0" stroke="dimgray" fill="dimgray" stroke-linecap="round" />\n/>`;
		} else if(part["curve"]) {
			const points = part["curve"].split(",");
			svgString += `<path d="M${offsetX + (points[0] * 5)} ${offsetY + (points[1] * 5)} ` +
					`Q${offsetX + (points[4] * 5)} ${offsetY + (points[5] * 5)} ` +
					`${offsetX + (points[2] * 5)} ${offsetY + (points[3] * 5)}" ` +
					`stroke-width="4" stroke="dimgray" fill="none" stroke-linecap="round" />\n`
		} else if(part["curve-fill"]) {
			const points = part["curve-fill"].split(",");
			svgString += `<path d="M${offsetX + (points[0] * 5)} ${offsetY + (points[1] * 5)} ` +
					`Q${offsetX + (points[4] * 5)} ${offsetY + (points[5] * 5)} ` +
					`${offsetX + (points[2] * 5)} ${offsetY + (points[3] * 5)}" ` +
					`stroke-width="4" stroke="dimgray" fill="dimgray" stroke-linecap="round" />\n`
		}
	}

	for(const part of parts) {
		if(part["line"]) {
			const points = part["line"].split(",");
			svgString += `<line x1="${offsetX + (points[0] * 5)}" ` +
					`y1="${offsetY + (points[1] * 5)}" ` +
					`x2="${offsetX + (points[2] * 5)}" ` +
					`y2="${offsetY + (points[3] * 5)}" ` +
					`stroke-width="3" stroke="${strokeColour}" fill="${strokeColour}" stroke-linecap="round" />\n/>`;
		} else if(part["curve"]) {
			const points = part["curve"].split(",");
			svgString += `<path d="M${offsetX + (points[0] * 5)} ${offsetY + (points[1] * 5)} ` +
					`Q${offsetX + (points[4] * 5)} ${offsetY + (points[5] * 5)} ` +
					`${offsetX + (points[2] * 5)} ${offsetY + (points[3] * 5)}" ` +
					`stroke-width="3" stroke="${strokeColour}" fill="none" stroke-linecap="round" />\n`
		} else if(part["curve-fill"]) {
			const points = part["curve-fill"].split(",");
			svgString += `<path d="M${offsetX + (points[0] * 5)} ${offsetY + (points[1] * 5)} ` +
					`Q${offsetX + (points[4] * 5)} ${offsetY + (points[5] * 5)} ` +
					`${offsetX + (points[2] * 5)} ${offsetY + (points[3] * 5)}" ` +
					`stroke-width="3" stroke="${strokeColour}" fill="${strokeColour}" stroke-linecap="round" />\n`
		}
	}
	return(svgString);
}

export function renderBackExtra(x, y, offsetX, offsetY, width, parts, fillColour) {
	let svgString = "";
	let points = [];
	for(const part of parts) {
		if(part["line"]) {
			points = part["line"].split(",");
		} else if(part["curve"]) {
			points = part["curve"].split(",");
		} else if(part["curve-fill"]) {
			points = part["curve-fill"].split(",");
		}
		// don't care what it is, always top to bottom
		let maxY = Math.max(points[1], points[3]);
		let minY = Math.min(points[1], points[3]);
		let height = Math.abs(maxY - minY);
		if(height === 0) {
			height = 3/5;
		}
		svgString += `<!-- ${width} ${height} -->`;
		svgString += `<rect x="${x - width/2*5}" ` +
				`y="${y - Math.abs(offsetY) * 5 - (height * 5)}" ` +
				`width="${width * 5}" ` +
				`height="${height * 5}" ` +
				`rx="1" ry="1" stroke-width="0.5" stroke="dimgray" fill="${fillColour}"/>\n`;
	}
	return(svgString);
}
