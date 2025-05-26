import { circle, dimensionsHorizontal, dimensionsVertical, drawExtraBackground, drawExtraForeground, drawOutlineCircle, drawOutlineHexagon, drawOutlineOctagon, drawShapeDetails, drawText, drawTextBold, drawTextBoldCentred, lineHorizontal, lineJoined, lineVertical, lineVerticalGuide, rectangle, renderExtra, target, TextOrientation } from "../utils/svg-helper.ts";
import { formatToTwoPlaces } from "../utils/formatter.ts";
import { OpaqueColour } from "../model/OpaqueColour.ts";
import { Pattern } from "../model/Pattern.ts";
import { listFiles } from "../utils/filesystem.ts";
import fs from "fs";
import { ObjectMapper } from "json-object-mapper";
export class SVGRenderer {
    static patternMap = new Map();
    static defaultPatternLoaded = false;
    importedPatterns = new Set();
    pencil;
    _width;
    _height;
    _rendererName;
    static loadDefaultPatterns() {
        // load all the patterns
        for (const listFile of listFiles("./patterns")) {
            const patternName = listFile.substring(0, listFile.lastIndexOf("."));
            const pattern = ObjectMapper.deserialize(Pattern, JSON.parse(fs.readFileSync("./patterns/" + listFile, "utf8")));
            this.patternMap.set(patternName, pattern);
        }
        this.defaultPatternLoaded = true;
    }
    constructor(pencil, width, height, rendererName = "") {
        if (!SVGRenderer.defaultPatternLoaded) {
            SVGRenderer.loadDefaultPatterns();
        }
        this.pencil = pencil;
        this._width = width;
        this._height = height;
        this._rendererName = rendererName;
    }
    /**
     * Resize the SVG - this is used when the size of the SVG is dynamically calculated,
     * e.g. when multiple pencils will be drawn based on colour.
     *
     * @param width The new width for the SVG
     * @param height The new height for the SVG
     *
     * @protected
     */
    resize(width, height) {
        this._width = width;
        this._height = height;
    }
    addOutlineBox(width, height, transparent) {
        if (!transparent) {
            return (`<rect x="0" y="0" width="${width}" height="${height}" fill="white" stroke="black" stroke-width="4" />\n` +
                `<rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="white" stroke="dimgray" stroke-width="1" />\n`);
        }
        return ("");
    }
    getSvgStart(transparent = false, rotate = 0) {
        let svgString = `<svg xmlns="http://www.w3.org/2000/svg" ` +
            `width="${this._width}" ` +
            `height="${this._height}">\n ` +
            `<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">\n` +
            `<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,8"/>\n` +
            `<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,8"/>\n` +
            `<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,0" />\n` +
            `<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,0" />\n` +
            `</pattern>\n` +
            `<pattern id="ridged" patternUnits="userSpaceOnUse" width="3" height="3">\n` +
            `<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 0,0 L 0,3"/>\n` +
            `</pattern>\n` +
            `<pattern id="lined" patternUnits="userSpaceOnUse" width="3" height="3">\n` +
            `<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 0,0 L 3,0"/>\n` +
            `</pattern>\n` +
            `<pattern id="spring" patternUnits="userSpaceOnUse" width="8" height="100">\n` +
            `<path stroke="dimgray" stroke-linecap="round" stroke-width="2" d="M 1,1 L 9,99"/>\n` +
            `<path stroke="white" stroke-linecap="round" stroke-width="1" d="M 1,1 L 8,99"/>\n` +
            `</pattern>\n` +
            this.addOutlineBox(this._width, this._height, transparent) +
            `<g transform="rotate(${rotate} ${(rotate !== 0 ? this._width / 2 : 0)} ${(rotate !== 0 ? this._height / 2 : 0)})">\n`;
        return (svgString);
    }
    getSvgEnd() {
        // todo - need to switch on height
        if (this._width <= 1000) {
            return (`</g><text x="50%" y="${this._height - 40}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // The Mechanical Pencil Database (tmpdb)</text>\n` +
                `<text x="50%" y="${this._height - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
                `<text x="${this._width - 10}" y="${this._height - 10}" font-size="0.5em" font-weight="bold" text-anchor="end" dominant-baseline="middle">${this._rendererName}</text>\n` +
                `</svg>`);
        }
        let svgString = `</g><text x="50%" y="${this._height - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
            `<text x="${this._width - 10}" y="${this._height - 10}" font-size="0.5em" font-weight="bold" text-anchor="end" dominant-baseline="middle">${this._rendererName}</text>\n` +
            `</svg>`;
        return (svgString);
    }
    renderCentreLineHorizontal(y, xInsetLeft = 40, xInsetRight = 40) {
        let svgString = "";
        svgString += lineHorizontal(xInsetLeft, y, this._width - xInsetLeft - xInsetRight, "1", "#5f5f5f", "2");
        svgString += target(xInsetLeft, y, 40, 10);
        svgString += target(this._width - xInsetRight, y, 40, 10);
        return (svgString);
    }
    renderCentreLineVertical(x, yInsetTop = 40, yInsetBottom = 40) {
        let svgString = "";
        svgString += lineVertical(x, yInsetTop, this._height - yInsetTop - yInsetBottom, "1", "#5f5f5f", "2");
        svgString += target(x, yInsetTop, 40, 10);
        svgString += target(x, this._height - yInsetBottom, 40, 10);
        return (svgString);
    }
    renderOverviewText(full = true) {
        let svgString = "";
        svgString += drawTextBold(`${this.pencil.brand}` +
            ` // ` +
            `${this.pencil.modelName} ` +
            `${(this.pencil.modelNumber ? "(Model #: " + this.pencil.modelNumber + ")" : "")}`, 30, 50, "2.0em");
        if (full) {
            svgString += drawText(`${this.pencil.text}`, 30, 80, "1.1em");
            if (this.pencil.leadSize) {
                svgString += drawText(`Lead size: ${this.pencil.leadSize} mm`, 30, 100, "1.1em");
            }
            if (this.pencil.weight) {
                svgString += drawText(`Weight: ${this.pencil.weight}g`, 30, 120, "1.1em");
            }
        }
        return (svgString);
    }
    renderPencilColours() {
        let svgString = "";
        // lets draw the pencil colours
        let colourOffset = this._width - 60;
        svgString += `<text ` +
            `x="${colourOffset + 40}" ` +
            `y="30" ` +
            `font-size="1.6em" font-weight="bold" text-anchor="end" dominant-baseline="central">` +
            `Colour variants of the ${this.pencil.colourComponent}` +
            `</text>\n`;
        for (let colourComponent of this.pencil.colourComponents) {
            svgString += `<rect x="${colourOffset}" y="55" width="40" rx="50%" ry="50%" height="40" stroke="black" stroke-width="2" fill="${colourComponent.colour}" fill-opacity="${colourComponent.opacity}"/>\n`;
            svgString += `<text x="${colourOffset + 20}" ` +
                `y="100" ` +
                `transform="rotate(-90, ${colourOffset + 20}, 100)" ` +
                `font-size="1.2em" font-weight="bold" text-anchor="end" dominant-baseline="central">` +
                `${colourComponent.colourName}` +
                `</text>\n`;
            colourOffset -= 60;
        }
        return (svgString);
    }
    renderMaterialList() {
        let svgString = "";
        let offset = 136;
        svgString += `<text ` +
            `x="30" ` +
            `y="${offset}" ` +
            `font-size="1.2em" font-weight="bold" text-anchor="start" dominant-baseline="central">` +
            `Materials:` +
            `</text>\n`;
        offset += 20;
        for (const material of this.pencil.materials) {
            svgString += `<text ` +
                `x="50" ` +
                `y="${offset}" ` +
                `font-size="1.2em" text-anchor="start" dominant-baseline="central">` +
                ` - ${material}` +
                `</text>\n`;
            offset += 20;
        }
        return (svgString);
    }
    renderSectionTitles() {
        let svgString = "";
        // Front view heading
        svgString += drawTextBoldCentred("Front", 160, this._height - 60, "1.8em");
        // Side View Heading
        svgString += drawTextBoldCentred("Side view", this._width / 2, this._height - 60, "1.8em");
        // Back View Heading
        svgString += drawTextBoldCentred("Back", this._width - 100, this._height - 60, "1.8em");
        return (svgString);
    }
    renderTaper(startX, midY, part, colourIndex, colour) {
        // TODO - need a nice way to determine what shade of black/grey -
        //   thinking grayscale inverse
        // TODO - need to add in the colourIndex and remove the colour string
        let strokeColor = "black";
        if (colour === "black") {
            strokeColor = "dimgray";
        }
        let svgString = "";
        if (!(part.taperStart || part.taperEnd)) {
            return ("");
        }
        let xOffsetTaperStart = 0;
        let xOffsetTaperStartScale = 1;
        if (part.taperStart?.xOffset) {
            xOffsetTaperStart = part.taperStart.xOffset;
        }
        if (part.taperStart?.xScale) {
            xOffsetTaperStartScale = part.taperStart.xScale;
        }
        if (part.taperStart) {
            let backgroundColour = part.taperStart.getBackgroundOpacityColour(colourIndex);
            // now we get to draw the taper
            switch (part.shape) {
                case "hexagonal":
                    // rectangle first
                    svgString += rectangle(startX, midY - part.endHeight / 2 * 5 + 0.25, xOffsetTaperStart * 5 - 0.5, part.startHeight * 5 - 0.5, "none", backgroundColour);
                    svgString += `<path d="M ${startX + xOffsetTaperStart * 5} ${midY - part.endHeight / 2 * 5} ` +
                        `C ${startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5)} ${midY - part.endHeight / 2 * 5 * 3 / 4}, ` +
                        `${startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5)} ${midY - part.endHeight / 2 * 5 / 4}, ` +
                        `${startX + xOffsetTaperStart * 5} ${midY}" ` +
                        `stroke-width="0.5" ` +
                        `stroke="${strokeColor}" ` +
                        `stroke-linecap="round" ` +
                        `fill="${colour}" />`;
                    svgString += `<path d="M ${startX + xOffsetTaperStart * 5} ${midY + part.endHeight / 2 * 5} ` +
                        `C ${startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5)} ${midY + part.endHeight / 2 * 5 * 3 / 4}, ` +
                        `${startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5)} ${midY + part.endHeight / 2 * 5 / 4}, ` +
                        `${startX + xOffsetTaperStart * 5} ${midY}" ` +
                        `stroke-width="0.5" stroke="${strokeColor}" stroke-linecap="round" fill="${colour}" />`;
                    break;
                case "cylinder":
                    svgString += rectangle(startX, midY - part.endHeight / 2 * 5 + 0.25, xOffsetTaperStart * 5 - 0.5, part.startHeight * 5 - 0.5, "none", backgroundColour);
                    svgString += `<path d="M ${startX + xOffsetTaperStart * 5} ${midY - part.endHeight / 2 * 5} ` +
                        `C ${startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5)} ${midY - part.endHeight / 2 * 5}, ` +
                        `${startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5)} ${midY + part.endHeight / 2 * 5}, ` +
                        `${startX + xOffsetTaperStart * 5} ${midY + part.endHeight / 2 * 5}, " ` +
                        `stroke-width="0.5" ` +
                        `stroke="${strokeColor}" ` +
                        `stroke-linecap="round" ` +
                        `fill="${colour}" />`;
                    break;
            }
        }
        let xOffsetTaperEnd = 0;
        let xOffsetTaperEndScale = 1;
        if (part.taperEnd?.xOffset) {
            xOffsetTaperEnd = part.taperEnd.xOffset;
        }
        if (part.taperEnd?.xScale) {
            xOffsetTaperEndScale = part.taperEnd.xScale;
        }
        if (part.taperEnd) {
            let backgroundColour = part.taperEnd.getBackgroundOpacityColour(colourIndex);
            // now we get to draw the taper
            switch (part.shape) {
                case "hexagonal":
                    svgString += `<path d="M ${startX + xOffsetTaperEnd * 5} ${midY - part.endHeight / 2 * 5} ` +
                        `C ${startX + ((part.length + xOffsetTaperEnd) * 5 * xOffsetTaperEndScale)} ${midY - part.endHeight / 2 * 5 * 3 / 4}, ` +
                        `${startX + ((part.length + xOffsetTaperEnd) * 5 * xOffsetTaperEndScale)} ${midY - part.endHeight / 2 * 5 / 4}, ` +
                        `${startX + xOffsetTaperEnd * 5} ${midY}" ` +
                        `stroke-width="0.5" ` +
                        `stroke="${strokeColor}" ` +
                        `stroke-linecap="round" ` +
                        `fill="${colour}" />\n`;
                    svgString += `<path d="M ${startX + xOffsetTaperEnd * 5} ${midY + part.endHeight / 2 * 5} ` +
                        `C ${startX + ((part.length + xOffsetTaperEnd) * 5 * xOffsetTaperEndScale)} ${midY + part.endHeight / 2 * 5 * 3 / 4}, ` +
                        `${startX + ((part.length + xOffsetTaperEnd) * 5 * xOffsetTaperEndScale)} ${midY + part.endHeight / 2 * 5 / 4}, ` +
                        `${startX + xOffsetTaperEnd * 5} ${midY}" ` +
                        `stroke-width="0.5" ` +
                        `stroke="${strokeColor}" ` +
                        `stroke-linecap="round" ` +
                        `fill="${colour}" />\n`;
                    break;
                case "cylinder":
                    svgString += rectangle(startX + part.length * 5 + xOffsetTaperEnd * 5, midY - part.endHeight / 2 * 5 + 0.25, xOffsetTaperEnd * -5 - 0.5, part.startHeight * 5 - 0.5, "none", backgroundColour);
                    svgString += `<path d="M ${startX + part.length * 5 + xOffsetTaperEnd * 5} ${midY - part.endHeight / 2 * 5} ` +
                        `C ${startX + ((part.length) * 5 + (xOffsetTaperEndScale * xOffsetTaperEnd) * 5)} ${midY - part.endHeight / 2 * 5}, ` +
                        `${startX + ((part.length) * 5 + (xOffsetTaperEndScale * xOffsetTaperEnd) * 5)} ${midY + part.endHeight / 2 * 5}, ` +
                        `${startX + part.length * 5 + xOffsetTaperEnd * 5} ${midY + part.endHeight / 2 * 5}, " ` +
                        `stroke-width="0.5" ` +
                        `stroke="${strokeColor}" ` +
                        `stroke-linecap="round" ` +
                        `fill="${colour}" />\n`;
                    break;
            }
        }
        return (svgString);
    }
    renderFrontDimensions(x, y) {
        let svgString = "";
        // THIS IS THE FRONT VIEW
        let extrasHeight = 0;
        let extrasOffset = 0;
        let extrasOffsetHeight = 0;
        // do we have any extras?
        let thisExtraPart = null;
        for (const component of this.pencil.components) {
            if (component.extras.length > 0) {
                for (const extra of component.extras) {
                    if (extra.height > extrasHeight) {
                        extrasHeight = extra.height;
                        extrasOffset = extra.offset[1];
                        extrasOffsetHeight = component.maxHeight / 2;
                        thisExtraPart = extra;
                    }
                }
            }
        }
        // we will be drawing the left dimension for the full body height - we need to take
        // into account whether there is an extra part
        if (thisExtraPart) {
            // draw the dimensions for the top part of the extra
            svgString += dimensionsHorizontal(x - thisExtraPart.width / 2 * 5, y - 60, thisExtraPart.width * 5, `${formatToTwoPlaces(thisExtraPart.width)} mm`, TextOrientation.TOP, true);
            svgString += dimensionsVertical(x + 62, y - extrasOffset * 5 - extrasHeight * 5, extrasHeight * 5, `${(Math.round((thisExtraPart.height) * 100) / 100).toFixed(2)} mm`, TextOrientation.RIGHT);
            svgString += dimensionsVertical(x + 50, y - this.pencil.maxHeight / 2 * 5, this.pencil.maxHeight * 5, `${formatToTwoPlaces(this.pencil.maxHeight)} mm`, TextOrientation.RIGHT);
            const pencilExtraHeight = this.pencil.maxHeight + extrasHeight - (extrasOffsetHeight - extrasOffset);
            // we have an extra part - the height is more than the simple body height
            svgString += dimensionsVertical(x - 50, y - extrasOffset * 5 - extrasHeight * 5, pencilExtraHeight * 5, `${pencilExtraHeight} mm`, TextOrientation.LEFT_ROTATED, true);
        }
        else {
            // no extra height here - so we can just draw the text
            svgString += dimensionsVertical(x - 50, y - this.pencil.maxHeight / 2 * 5, this.pencil.maxHeight * 5, `${formatToTwoPlaces(this.pencil.maxHeight)} mm`, TextOrientation.LEFT_ROTATED, true);
        }
        // This is the BOTTOM WIDTH of the pencil
        svgString += dimensionsHorizontal(x - this.pencil.maxWidth / 2 * 5, y + 30 + this.pencil.maxHeight / 2 * 5, this.pencil.maxWidth * 5, `${formatToTwoPlaces(this.pencil.maxWidth)} mm`, TextOrientation.BOTTOM, true);
        return (svgString);
    }
    renderFrontComponents(x, y, colourIndex) {
        let svgString = "";
        let colour = new OpaqueColour(this.pencil.colourMap, "white%0");
        // we want to render them back to front so that the last component is on
        // the bottom
        this.pencil.components.reverse();
        // go through the components and render them
        for (const component of this.pencil.components) {
            svgString += `\n<!-- FRONT COMPONENT: ${component.type} -->\n`;
            component.parts.reverse();
            for (let part of component.parts) {
                colour = part.getOpacityColour(colourIndex);
                switch (part.shape) {
                    case "cylinder":
                        svgString += circle(x, y, (part.startHeight / 2) * 5, "0.5", "black", colour);
                        break;
                    case "cone":
                    case "convex":
                    case "concave":
                        svgString += drawOutlineCircle((part.startHeight / 2) * 5, x, y, colour);
                        svgString += drawOutlineCircle((part.endHeight / 2) * 5, x, y, colour);
                        break;
                    case "hexagonal":
                        svgString += drawOutlineHexagon(x, y, part.startHeight, colour);
                        break;
                    case "octagonal":
                        svgString += drawOutlineOctagon(x, y, part.startHeight, colour);
                        break;
                }
            }
            for (const extra of component.extras) {
                svgString += renderExtra(x, y, extra.offset[0], extra.offset[1], extra.width, extra.extraParts, extra.getBackgroundOpacityColour(colourIndex));
            }
            component.parts.reverse();
        }
        // now put it back in order
        this.pencil.components.reverse();
        for (let front of this.pencil.front) {
            // only care about the first dimension - which is the width
            let frontFillColour = front.getOpacityColour(colourIndex);
            // render the front piece
            switch (front.shape) {
                case "cylinder":
                    svgString += circle(x, y, front.width / 2 * 5, "0.5", "dimgray", frontFillColour);
                    break;
            }
        }
        return (svgString);
    }
    renderSideDimensions() {
        let svgString = "";
        let startX = (this._width - this.pencil.totalLength * 5) / 2;
        let midY = this._height / 2;
        // render the component dimensions
        for (let component of this.pencil.components) {
            if (component.isHidden) {
                continue;
            }
            // draw all the dimensions
            svgString += dimensionsHorizontal(startX, midY - 120, component.length * 5, `${formatToTwoPlaces(component.length)} mm${(component.length * 5 > 30 ? "\n" : " ")}${component.type}`, TextOrientation.TOP_ROTATED, true);
            // now for the extra dimensions
            // is the extra the first component, or the last
            // now for extraParts
            for (const extra of component.extras) {
                // draw the straight-through line for guidance
                svgString += dimensionsHorizontal(startX + extra.offset[0] * 5, midY - 80, extra.length * 5, `${formatToTwoPlaces(extra.length)} mm\n${component.type} (extra)`, TextOrientation.CENTER, true);
            }
            startX += component.length * 5;
        }
        return (svgString);
    }
    renderBackDimensions(x, y) {
        let svgString = "";
        for (let component of this.pencil.components) {
            switch (component.type) {
                case "body":
                    svgString += dimensionsVertical(x, y - component.maxHeight / 2 * 5, component.maxHeight * 5, `${component.maxHeight} mm`, TextOrientation.LEFT_ROTATED, true);
                    svgString += dimensionsVertical(x, y - component.maxHeight / 2 * 5, component.maxHeight * 5, "body", TextOrientation.BOTTOM_ROTATED, true);
                    break;
                case "grip":
                    svgString += dimensionsVertical(x - 40, y - component.maxHeight / 2 * 5, component.maxHeight * 5, `${component.maxHeight} mm`, TextOrientation.LEFT_ROTATED, true);
                    svgString += dimensionsVertical(x - 40, y - component.maxHeight / 2 * 5, component.maxHeight * 5, "grip", TextOrientation.BOTTOM_ROTATED, true);
                    break;
            }
        }
        return (svgString);
    }
    renderBackComponents(x, y, colourIndex) {
        let svgString = "";
        let colour = new OpaqueColour(this.pencil.colourMap, "white");
        // go through the components and render them
        for (const component of this.pencil.components) {
            colour = component.getOpacityColour(colourIndex);
            for (let part of component.parts) {
                switch (part.shape) {
                    case "cylinder":
                        svgString += circle(x, y, (part.startHeight / 2) * 5, "0.5", "black", colour);
                        break;
                    case "cone":
                        svgString += drawOutlineCircle((part.startHeight / 2) * 5, x, y, colour);
                        svgString += drawOutlineCircle((part.endHeight / 2) * 5, x, y, colour);
                        break;
                    case "hexagonal":
                        svgString += drawOutlineHexagon(x, y, part.startHeight, colour);
                        break;
                    case "octagonal":
                        svgString += drawOutlineOctagon(x, y, part.startHeight, colour);
                        break;
                }
            }
        }
        for (let back of this.pencil.back) {
            let backFillColour = back.getOpacityColour(colourIndex);
            // render the back piece
            switch (back.shape) {
                case "cylinder":
                    svgString += circle(x, y, back.width / 2 * 5, "1", "dimgray", backFillColour);
                    break;
            }
        }
        return (svgString);
    }
    renderSideMaterials() {
        let svgString = "";
        let xOffset = (this._width - this.pencil.totalLength * 5) / 2;
        for (let component of this.pencil.components) {
            if (component.isHidden) {
                continue;
            }
            // extra parts are always rendered first
            for (const extra of component.extras) {
                svgString += dimensionsHorizontal(xOffset + extra.offset[0] * 5, this._height / 2 + 80, extra.length * 5, `${component.materials.join("\n")}`, TextOrientation.BOTTOM, false);
            }
            // draw all the dimensions
            svgString += dimensionsHorizontal(xOffset, this._height / 2 + 120, component.length * 5, `${(component.materials.join("\n"))}`, TextOrientation.BOTTOM_ROTATED, false);
            xOffset += component.length * 5;
        }
        return (svgString);
    }
    renderSideComponents(colourIndex, midYOverride = null) {
        let svgString = "";
        let startX = this._width / 2 - (this.pencil.totalLength * 5 / 2);
        let midY = this._height / 2;
        if (null != midYOverride) {
            midY = midYOverride;
        }
        let colourOpacity = new OpaqueColour(this.pencil.colourMap, "white");
        for (let component of this.pencil.components) {
            colourOpacity = component.getOpacityColour(colourIndex);
            for (let part of component.parts) {
                svgString += this.renderPart(startX, midY, component, part, colourIndex, colourOpacity);
                startX += part.length * 5;
            }
        }
        // reset to draw the taper lines last
        startX = this._width / 2 - (this.pencil.totalLength * 5 / 2);
        for (let component of this.pencil.components) {
            colourOpacity = component.getOpacityColour(colourIndex);
            for (let part of component.parts) {
                svgString += this.renderTaper(startX, midY, part, colourIndex, colourOpacity.colour);
                startX += part.length * 5;
            }
        }
        return (svgString);
    }
    renderTotalLengthDimensions() {
        return (dimensionsHorizontal(this._width / 2 - this.pencil.totalLength * 5 / 2, this._height / 2 + 30 + this.pencil.maxHeight / 2 * 5, this.pencil.totalLength * 5, `${formatToTwoPlaces(this.pencil.totalLength)} mm`, TextOrientation.CENTER, true));
    }
    renderComponent(startX, midY, component, colourIndex) {
        let svgString = "";
        for (const part of component.parts) {
            svgString += this.renderPart(startX, midY, component, part, colourIndex, null);
        }
        return (svgString);
    }
    renderPart(startX, midY, component, part, colourIndex, defaultOpaqueColour) {
        let svgString = "";
        // get the stroke colour
        let strokeColour = "black";
        if (part.getOpacityColour(colourIndex).colour === "black") {
            strokeColour = "dimgray";
        }
        for (const extra of component.extras) {
            let backgroundColour = "black";
            // TODO - do we need this
            if (component.getOpacityColour(colourIndex).colour === "black") {
                backgroundColour = "dimgray";
            }
            svgString += drawExtraBackground(startX + extra.offset[0] * 5, midY - extra.offset[1] * 5, extra.extraParts, backgroundColour);
            break;
        }
        // maybe we have an over-ride colour and material
        let opaqueColour = part.getOpacityColour(colourIndex);
        switch (part.shape) {
            case "cylinder":
            case "hexagonal":
            case "octagonal":
            case "cone":
                svgString += `<path d="M${startX} ` +
                    `${midY - (part.startHeight / 2 * 5)} ` +
                    `L${startX + part.length * 5} ${midY - (part.endHeight / 2 * 5)} ` +
                    `L${startX + part.length * 5} ${midY + (part.endHeight / 2 * 5)} ` +
                    `L${startX} ${midY + (part.startHeight / 2 * 5)} Z" ` +
                    `stroke-width="0.5" stroke="${strokeColour}" stroke-linejoin="round" fill="${opaqueColour.colour}" fill-opacity="${opaqueColour.opacity}" />\n`;
                // svgString += `<path d="M${startX + part.internalOffset * 5} ` +
                // 	`${midY - (part.startHeight / 2 * 5)} ` +
                // 	`L${startX + part.internalOffset * 5 + part.length * 5} ${midY - (part.endHeight / 2 * 5)} ` +
                // 	`L${startX + part.internalOffset * 5 + part.length * 5} ${midY + (part.endHeight / 2 * 5)} ` +
                // 	`L${startX + part.internalOffset * 5} ${midY + (part.startHeight / 2 * 5)} Z" ` +
                // 	`stroke-width="0.5" stroke="${strokeColour}" stroke-linejoin="round" fill="${opaqueColour.colour}" fill-opacity="${opaqueColour.opacity}" />\n`
                if (part.joined) {
                    svgString += lineJoined(startX, midY - (part.endHeight / 2 * 5) + 0.25, part.startHeight * 5 - 0.5, "3", opaqueColour.colour);
                    // svgString += lineJoined(startX + part.internalOffset * 5,
                    // 	midY - (part.endHeight / 2 * 5) + 0.25,
                    // 	part.startHeight * 5 - 0.5, "3", opaqueColour.colour);
                }
                break;
            case "convex":
                let offsetX = part.length * 5;
                if (part.offset[0] !== 0) {
                    offsetX = part.offset[0] * 5;
                }
                let offsetY = part.startHeight / 2 * 5;
                if (part.offset[1] !== 0) {
                    offsetY = (part.startHeight / 2 - part.offset[1]) * 5;
                }
                // svgString += `<path d="M${startX + part.internalOffset * 5} ${midY - (part.startHeight / 2 * 5)} ` +
                // 	`Q${startX + part.internalOffset * 5 + offsetX} ${midY - offsetY} ` +
                // 	`${startX + part.internalOffset * 5} ${midY + (part.startHeight / 2 * 5)}" ` +
                // 	`stroke-width="0.5" stroke="${strokeColour}" stroke-linejoin="round" fill="${opaqueColour.colour}" fill-opacity="${opaqueColour.opacity}"/>\n`
                svgString += `<path d="M${startX} ${midY - (part.startHeight / 2 * 5)} ` +
                    `Q${startX + offsetX} ${midY - offsetY} ` +
                    `${startX} ${midY + (part.startHeight / 2 * 5)}" ` +
                    `stroke-width="0.5" stroke="${strokeColour}" stroke-linejoin="round" fill="${opaqueColour.colour}" fill-opacity="${opaqueColour.opacity}"/>\n`;
                break;
            case "concave":
                svgString += `<path d="M${startX} ${midY - (part.startHeight / 2 * 5)} ` +
                    `Q${startX + part.length * 5} ${midY} ` +
                    `${startX} ${midY + (part.startHeight / 2 * 5)}" ` +
                    `stroke-width="0.5" stroke="${strokeColour}" stroke-linejoin="round" fill="${opaqueColour.colour}" fill-opacity="${opaqueColour.opacity}"/>\n`;
                // svgString += `<path d="M${startX + part.internalOffset * 5} ${midY - (part.startHeight / 2 * 5)} ` +
                // 	`Q${startX + part.internalOffset * 5 + part.length * 5} ${midY} ` +
                // 	`${startX + part.internalOffset * 5} ${midY + (part.startHeight / 2 * 5)}" ` +
                // 	`stroke-width="0.5" stroke="${strokeColour}" stroke-linejoin="round" fill="${opaqueColour.colour}" fill-opacity="${opaqueColour.opacity}"/>\n`
                break;
        }
        switch (part.shape) {
            case "hexagonal":
                svgString += drawShapeDetails(startX, midY, (part.length) * 5);
                // svgString += drawShapeDetails(startX + part.internalOffset * 5, midY, (part.length) * 5);
                break;
            case "octagonal":
                svgString += drawShapeDetails(startX, midY - ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
                svgString += drawShapeDetails(startX, midY + ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
                // svgString += drawShapeDetails(startX + part.internalOffset * 5, midY - ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
                // svgString += drawShapeDetails(startX + part.internalOffset * 5, midY + ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
                break;
        }
        // now for the finish - although this only really works for cylinder types
        // the question becomes whether there will be other finishes on different
        // objects
        for (const finish of part.finish.split(",")) {
            let xStart = startX + (part.internalOffset) * 5;
            let xEnd = startX + part.length * 5;
            let yStartTop = midY - (part.startHeight / 2 * 5);
            let yStartBottom = midY + (part.startHeight / 2 * 5);
            let yEndTop = midY - (part.endHeight / 2 * 5);
            let yEndBottom = midY + (part.endHeight / 2 * 5);
            switch (finish) {
                case "ferrule":
                    let offset = ((part.length / 13) * 5) / 2;
                    for (let i = 0; i < 13; i++) {
                        if (i !== 0 && i !== 6 && i < 12) {
                            svgString += `<line x1="${startX + part.internalOffset * 5 + offset}" ` +
                                `y1="${midY + 1.0 - part.startHeight / 2 * 5}" ` +
                                `x2="${startX + part.internalOffset * 5 + offset}" ` +
                                `y2="${midY - 1.0 + part.startHeight / 2 * 5}" ` +
                                `stroke-width="1" stroke="gray" />\n`;
                        }
                        offset += (part.length / 13) * 5;
                    }
                    svgString += drawOutlineCircle(4, startX + part.internalOffset * 5 + 15, midY - part.startHeight / 4 * 5, new OpaqueColour(null, "dimgray"));
                    break;
                case "knurled":
                    svgString += `<path d="M${xStart} ${yStartTop} ` +
                        `L${xEnd} ${yEndTop} ` +
                        `L${xEnd} ${yEndBottom} ` +
                        `L${xStart} ${yStartBottom} Z" stroke-width="1.0" stroke="black" fill="url(#diagonalHatch)"/>\n`;
                    break;
                case "ridged":
                    svgString += `<path d="M${xStart} ${yStartTop} ` +
                        `L${xEnd} ${yEndTop} ` +
                        `L${xEnd} ${yEndBottom} ` +
                        `L${xStart} ${yStartBottom} Z" stroke-width="1.0" stroke="black" fill="url(#ridged)"/>\n`;
                    break;
                case "spring":
                    svgString += `<rect x="${startX + part.internalOffset * 5 + 5}" ` +
                        `y="${midY - (part.endHeight / 2 * 5) - 5}" ` +
                        `width="${part.length * 5 - 10}" ` +
                        `height="${part.startHeight * 5 + 10}" ` +
                        `stroke-width="0.0" stroke="black" fill="url(#spring)"/>\n`;
                    for (let i = 0; i < 4; i++) {
                        svgString += `<line x1="${startX + part.internalOffset * 5 + i * 2 + 0.5}" y1="${midY - (part.endHeight / 2 * 5) - 5}" ` +
                            `x2="${startX + part.internalOffset * 5 + i * 2 + 0.5}" y2="${midY + (part.endHeight / 2 * 5) + 5}" stroke="dimgray" stroke-linecap="round" stroke-width="2" />\n`;
                        svgString += `<line x1="${startX + part.internalOffset * 5 + i * 2 + 0.5}" y1="${midY - (part.endHeight / 2 * 5) - 5}" ` +
                            `x2="${startX + part.internalOffset * 5 + i * 2 + 0.5}" y2="${midY + (part.endHeight / 2 * 5) + 5}" stroke="white" stroke-linecap="round" stroke-width="1" />\n`;
                        svgString += `<line x1="${startX + part.internalOffset * 5 + part.length * 5 - i * 2 - 0.5}" y1="${midY - (part.endHeight / 2 * 5) - 5}" ` +
                            `x2="${startX + part.internalOffset * 5 + part.length * 5 - i * 2 - 0.5}" y2="${midY + (part.endHeight / 2 * 5) + 5}" stroke="dimgray" stroke-linecap="round" stroke-width="2" />\n`;
                        svgString += `<line x1="${startX + part.internalOffset * 5 + part.length * 5 - i * 2 - 0.5}" y1="${midY - (part.endHeight / 2 * 5) - 5}" ` +
                            `x2="${startX + part.internalOffset * 5 + part.length * 5 - i * 2 - 0.5}" y2="${midY + (part.endHeight / 2 * 5) + 5}" stroke="white" stroke-linecap="round" stroke-width="1" />\n`;
                    }
                    break;
                case "threaded":
                    for (let i = 0; i < part.length; i++) {
                        if ((i + 1) > part.length) {
                            // TODO - half a line
                            break;
                        }
                        svgString += `<line x1="${startX + part.internalOffset * 5 + i * 5}" y1="${midY - (part.endHeight / 2 * 5) - 2}" ` +
                            `x2="${startX + part.internalOffset * 5 + (i + 1) * 5}" y2="${midY + (part.endHeight / 2 * 5) + 2}" stroke="dimgray" stroke-linecap="round" stroke-width="2" />\n`;
                        svgString += `<line x1="${startX + part.internalOffset * 5 + i * 5}" y1="${midY - (part.endHeight / 2 * 5) - 2}" ` +
                            `x2="${startX + part.internalOffset * 5 + (i + 1) * 5}" y2="${midY + (part.endHeight / 2 * 5) + 2}" stroke="${opaqueColour}" stroke-linecap="round" stroke-width="1" />\n`;
                    }
                    break;
                case "indicator":
                    // let backgoundColour: OpaqueColour = defaultOpaqueColour;
                    let backgoundColour = part.getBackgroundOpacityColour(colourIndex);
                    // now draw the indicator
                    svgString += `<rect x="${startX + part.internalOffset * 5 + 10}" ` +
                        `y="${midY - (part.endHeight / 4 * 5)}" ` +
                        `width="${part.length * 5 - 20}" ` +
                        `height="${part.startHeight / 2 * 5}" ` +
                        `rx="3" ry="3" stroke-width="1" stroke="black" fill="${backgoundColour.colour}"/>\n`;
                    svgString += `<text x="${startX + part.internalOffset * 5 + (part.length * 5) / 2}" ` +
                        `y="${midY}" ` +
                        `text-anchor="middle" dominant-baseline="central">` +
                        `<tspan stroke="dimgray" stroke-width="0.5" font-family="sans-serif" fill="black" textLength="{this.width * 5 - 24}" > ` +
                        `HB` +
                        `</tspan>` +
                        `</text>`;
                    break;
                case "indicator-split":
                    // now draw the indicator
                    // TODO - this should be at the top of the method
                    let backgroundColour = part.getBackgroundOpacityColour(colourIndex);
                    // horizontal
                    svgString += `<rect x="${startX + part.internalOffset * 5}" ` +
                        `y="${midY - 4}" ` +
                        `width="${part.length * 5}" ` +
                        `height="${8}" ` +
                        `rx="0" ry="0" stroke-width="1" stroke="black" fill="${backgroundColour.colour}"/>\n`;
                    svgString += `<rect x="${startX + part.internalOffset * 5 + 6}" ` +
                        `y="${midY - (part.endHeight / 4 * 5)}" ` +
                        `width="${part.length * 5 - 12}" ` +
                        `height="${part.startHeight / 2 * 5}" ` +
                        `rx="3" ry="3" stroke-width="1" stroke="black" fill="${backgroundColour.colour}"/>\n`;
                    svgString += `<rect x="${startX + part.internalOffset * 5 + 0.25}" ` +
                        `y="${midY - 3.75}" ` +
                        `width="${part.length * 5 - 0.5}" ` +
                        `height="${7.5}" ` +
                        `rx="0" ry="0" stroke-width="1" stroke="none" fill="${backgroundColour.colour}"/>\n`;
                    svgString += `<text x="${startX + part.internalOffset * 5 + (part.length * 5) / 2}" ` +
                        `y="${midY}" ` +
                        `text-anchor="middle" dominant-baseline="central">` +
                        `<tspan stroke="dimgray" stroke-width="0.5" font-family="sans-serif" fill="black" textLength="{this.width * 5 - 14}" > ` +
                        `HB` +
                        `</tspan>` +
                        `</text>`;
                    break;
                case "indicator-etched":
                    svgString += `<text x="${startX + part.internalOffset * 5 + (part.length * 5) / 2}" ` +
                        `y="${midY}" ` +
                        `text-anchor="middle" dominant-baseline="central">` +
                        `<tspan stroke="dimgray" stroke-width="0.5" font-family="sans-serif" fill="black" textLength="{this.width * 5 - 12}" > ` +
                        `HB` +
                        `</tspan>` +
                        `</text>`;
                    break;
                case "lined":
                    for (let i = 0; i < part.startHeight * 5 / 2 - 1; i++) {
                        svgString += `<line x1="${startX + part.internalOffset * 5 + 1}" y1="${midY - (part.startHeight / 2 * 5) + i * 2 + 1}" ` +
                            `x2="${startX + (part.internalOffset + part.length) * 5 - 1}" y2="${midY - (part.startHeight / 2 * 5) + i * 2 + 1}" stroke="dimgray" stroke-linecap="round" stroke-width="1" />\n`;
                    }
                    break;
            }
        }
        for (const extra of component.extras) {
            let colour = extra.getOpacityColour(colourIndex);
            svgString += drawExtraForeground(startX + extra.offset[0] * 5, midY - extra.offset[1] * 5, extra.extraParts, colour.colour);
            break;
        }
        return (svgString);
    }
    renderGuidelines() {
        let svgString = "";
        // now we are going to go through each of the components and draw the shapes
        let offset;
        // SIDE VIEW GUIDELINES FOR THE COMPONENTS
        // reset the offset to redraw
        offset = this._width / 2 - this.pencil.totalLength * 5 / 2;
        svgString += lineVerticalGuide(offset, this._height / 2 - 88 - this.pencil.maxHeight / 2 * 5, 140 + this.pencil.maxHeight / 2 * 5);
        for (let component of this.pencil.components) {
            // vertical line
            svgString += lineVerticalGuide(offset, this._height / 2 - 120, 120);
            offset += component.length * 5;
            // now for extraParts
            for (const extra of component.extras) {
                svgString += lineVerticalGuide(offset + extra.offset[0] * 5, this._height / 2 - 80, 80);
                svgString += lineVerticalGuide(offset + extra.offset[0] * 5 + extra.length * 5, this._height / 2 - 80, 80);
            }
        }
        svgString += lineVerticalGuide(offset, this._height / 2 - 88 - this.pencil.maxHeight / 2 * 5, 140 + this.pencil.maxHeight / 2 * 5);
        return (svgString);
    }
}
//# sourceMappingURL=SVGRenderer.js.map