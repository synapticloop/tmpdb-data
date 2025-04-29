export function svgTextCentred(text, x, y) {

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
