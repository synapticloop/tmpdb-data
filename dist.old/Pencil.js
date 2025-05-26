"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pencil = void 0;
const Component_mjs_1 = require("./component/Component.mjs");
const svg_helper_mjs_1 = require("../utils/svg-helper.mjs");
class Pencil {
    /**
     * <p></p>
     *
     * @param pencilDataString The JSON data of the Pencil
     */
    constructor(pencilDataString) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.name = "";
        this.brand = "";
        this.leadSize = "";
        this.components = [];
        // width = 0;
        this.text = "";
        this.maxWidth = 0;
        this.maxHeight = 0;
        this.totalLength = 0;
        this.materials = [];
        this.materialsSet = new Set();
        this.colourComponent = "";
        this.colourComponents = ["white"];
        this.weight = 0.0;
        this.modelNumber = null;
        this.front = [];
        this.back = [];
        this.colourMap = {};
        this.model = {};
        const pencilJSONData = JSON.parse(pencilDataString);
        this.colourComponent = (_a = pencilJSONData.colour_component) !== null && _a !== void 0 ? _a : this.colourComponent;
        this.colourMap = (_b = pencilJSONData.colour_map) !== null && _b !== void 0 ? _b : this.colourMap;
        this.modelNumber = (_c = pencilJSONData.model_number) !== null && _c !== void 0 ? _c : this.modelNumber;
        this.front = (_d = pencilJSONData.front) !== null && _d !== void 0 ? _d : this.front;
        this.back = (_e = pencilJSONData.back) !== null && _e !== void 0 ? _e : this.back;
        for (const component of pencilJSONData.components) {
            const thisComponent = new Component_mjs_1.Component(component);
            this.components.push(thisComponent);
            this.totalLength += thisComponent.getWidth();
            if (thisComponent.type === this.colourComponent) {
                this.colourComponents = thisComponent.colours;
            }
            let tempWidth = thisComponent.getMaxWidth();
            if (tempWidth >= this.maxWidth) {
                this.maxWidth = tempWidth;
            }
            let tempHeight = thisComponent.getMaxHeight();
            if (tempHeight >= this.maxHeight) {
                this.maxHeight = tempHeight;
            }
            const componentMaterial = component.material;
            if (!this.materialsSet.has(componentMaterial)) {
                this.materials.push(componentMaterial);
                this.materialsSet.add(componentMaterial);
            }
        }
        this.brand = (_f = pencilJSONData.brand) !== null && _f !== void 0 ? _f : this.brand;
        this.model = (_g = pencilJSONData.model) !== null && _g !== void 0 ? _g : this.model;
        this.leadSize = (_h = pencilJSONData.lead_size) !== null && _h !== void 0 ? _h : this.leadSize;
        this.text = (_j = pencilJSONData.text) !== null && _j !== void 0 ? _j : this.text;
    }
    renderSvg(shouldColour, colourIndex, colourComponent) {
        let thisColourIndex = colourIndex !== null && colourIndex !== void 0 ? colourIndex : 0;
        let thisColourComponent = colourComponent !== null && colourComponent !== void 0 ? colourComponent : "";
        let svgString = Pencil.SVG_START;
        let xPosition = (svg_helper_mjs_1.SVG_WIDTH - this.totalLength) / 2;
        svgString += (0, svg_helper_mjs_1.drawTextBold)(`${this.brand} // ${this.model} ${(this.modelNumber ? "(Model #: " + this.modelNumber + ")" : "")}`, 30, 50, "2.0em");
        svgString += (0, svg_helper_mjs_1.drawText)(`${this.text}`, 30, 80, "1.1em");
        svgString += this.drawSvgGuidelines();
        svgString += this.drawFrontDimensions();
        // now we are going to go through each of the components and draw the shapes
        let offset = svg_helper_mjs_1.SVG_WIDTH / 2 - this.getTotalLength() / 2;
        // is the extra the first component, or the last
        for (let component of this.components) {
            // vertical line
            svgString += (0, svg_helper_mjs_1.drawVerticalLine)(offset, svg_helper_mjs_1.SVG_HEIGHT / 2 - 99 - this.maxHeight / 2 * 5, 22, "black");
            let currentOffset = offset;
            offset += component.getWidth();
            if (component.getWidth() / 5 > 8) {
                svgString += `<text x="${(offset + currentOffset) / 2 - 3}" ` +
                    `y="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 102 - this.maxHeight / 2 * 5}" ` +
                    `transform="rotate(-90, ${(offset + currentOffset) / 2 - 3}, ${svg_helper_mjs_1.SVG_HEIGHT / 2 - 102 - this.maxHeight / 2 * 5})" ` +
                    `font-size="1.2em" font-weight="bold" dominant-baseline="auto">` +
                    `${(Math.round(component.getWidth() / 5 * 100) / 100).toFixed(2)} mm` +
                    `</text>\n`;
                svgString += `<text x="${(offset + currentOffset) / 2 + 3}" ` +
                    `y="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 102 - this.maxHeight / 2 * 5}" ` +
                    `transform="rotate(-90, ${(offset + currentOffset) / 2 + 3}, ${svg_helper_mjs_1.SVG_HEIGHT / 2 - 102 - this.maxHeight / 2 * 5})" ` +
                    `font-size="1.2em" font-weight="bold" dominant-baseline="hanging">` +
                    `${component.getType()}` +
                    `</text>\n`;
            }
            else {
                svgString += `<text x="${(offset + currentOffset) / 2}" ` +
                    `y="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 102 - this.maxHeight / 2 * 5}" ` +
                    `transform="rotate(-90, ${(offset + currentOffset) / 2}, ${svg_helper_mjs_1.SVG_HEIGHT / 2 - 102 - this.maxHeight / 2 * 5})" ` +
                    `font-size="1.2em" font-weight="bold" dominant-baseline="middle">` +
                    `${(Math.round(component.getWidth() / 5 * 100) / 100).toFixed(2)} mm ${component.getType()}` +
                    `</text>\n`;
            }
            // now for extraParts
            for (const extraPart of component.getExtraParts()) {
                // draw the straight-through line for guidance
                // draw the start vertical
                svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 24 - this.maxHeight / 2 * 5}" ` +
                    `x2="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 46 - this.maxHeight / 2 * 5}" ` +
                    `stroke="black" stroke-width="1" />\n`;
                // draw the start vertical
                svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 120}" ` +
                    `x2="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 96}" ` +
                    `stroke="black" stroke-width="1" />\n`;
                svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 96}" ` +
                    `x2="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 120}" ` +
                    `stroke="black" stroke-width="1" />\n`;
                // draw the vertical line
                svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 24 - this.maxHeight / 2 * 5}" ` +
                    `x2="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 46 - this.maxHeight / 2 * 5}" ` +
                    `stroke="black" stroke-width="1" />\n`;
                // draw the horizontal line
                svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 35 - this.maxHeight / 2 * 5}" ` +
                    `x2="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 35 - this.maxHeight / 2 * 5}" ` +
                    `stroke="black" stroke-width="1" />\n`;
                // draw the end vertical
                svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 132 - this.maxHeight / 2 * 5}" ` +
                    `x2="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 132 - this.maxHeight / 2 * 5}" ` +
                    `stroke="black" stroke-width="1" />\n`;
                svgString += `<text x="${offset + extraPart.extraOffset[0] * 5 + (extraPart.extraWidth / 2 * 5) - (component.extraPartFirst ? component.getWidth() : 0)}" y="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 70 + this.maxHeight / 2 * 5}" font-size="1.2em" text-anchor="middle" dominant-baseline="central">${component.getMaterial()}</text>\n`;
                svgString += `<text x="${offset + extraPart.extraOffset[0] * 5 + (extraPart.extraWidth / 2 * 5) - (component.extraPartFirst ? component.getWidth() : 0)}" y="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 46 - this.maxHeight / 2 * 5}" font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="central">${(Math.round(extraPart.extraWidth * 100) / 100).toFixed(2)} mm</text>\n`;
                svgString += `<text x="${offset + extraPart.extraOffset[0] * 5 + (extraPart.extraWidth / 2 * 5) - (component.extraPartFirst ? component.getWidth() : 0)}" y="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 26 - this.maxHeight / 2 * 5}" font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="central">${component.getType()} (extra)</text>\n`;
            }
        }
        svgString += `<line ` +
            `x1="${offset}" ` +
            `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 77 - this.maxHeight / 2 * 5}" ` +
            `x2="${offset}" ` +
            `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 99 - this.maxHeight / 2 * 5}" ` +
            `stroke="black" stroke-width="1" />\n`;
        // horizontal line
        svgString += `<line x1="${svg_helper_mjs_1.SVG_WIDTH / 2 - this.totalLength / 2}" ` +
            `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 88 - this.maxHeight / 2 * 5}" ` +
            `x2="${svg_helper_mjs_1.SVG_WIDTH / 2 + this.totalLength / 2}" ` +
            `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 88 - this.maxHeight / 2 * 5}" ` +
            `stroke="black" stroke-width="1" />\n`;
        // THIS IS FOR THE SIDE VIEW
        // now for the total
        // horizontal
        svgString += `<line x1="${svg_helper_mjs_1.SVG_WIDTH / 2 - this.totalLength / 2}" y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 30 + this.maxHeight / 2 * 5}" ` +
            `x2="${svg_helper_mjs_1.SVG_WIDTH / 2 + this.totalLength / 2}" y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 30 + this.maxHeight / 2 * 5}" ` +
            `stroke="black" stroke-width="1" />\n`;
        // left
        svgString += `<line x1="${svg_helper_mjs_1.SVG_WIDTH / 2 - this.totalLength / 2}" y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 20 + this.maxHeight / 2 * 5}" ` +
            `x2="${svg_helper_mjs_1.SVG_WIDTH / 2 - this.totalLength / 2}" y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 40 + this.maxHeight / 2 * 5}" ` +
            `stroke="black" stroke-width="1" />\n`;
        // right
        svgString += `<line x1="${svg_helper_mjs_1.SVG_WIDTH / 2 + this.totalLength / 2}" y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 20 + this.maxHeight / 2 * 5}" ` +
            `x2="${svg_helper_mjs_1.SVG_WIDTH / 2 + this.totalLength / 2}" y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 40 + this.maxHeight / 2 * 5}" ` +
            `stroke="black" stroke-width="1" />\n`;
        // pencil length
        svgString += (0, svg_helper_mjs_1.drawTextBoldCentred)(`${(Math.round(this.totalLength / 5 * 100) / 100).toFixed(2)} mm`, svg_helper_mjs_1.SVG_WIDTH / 2, svg_helper_mjs_1.SVG_HEIGHT / 2 + 50 + this.maxHeight / 2 * 5, "1.2em");
        // Side View Heading
        svgString += (0, svg_helper_mjs_1.drawTextBoldCentred)("Side view", svg_helper_mjs_1.SVG_WIDTH / 2, svg_helper_mjs_1.SVG_HEIGHT - 60, "1.8em");
        // Back View Heading
        svgString += (0, svg_helper_mjs_1.drawTextBoldCentred)("Back", svg_helper_mjs_1.SVG_WIDTH - 100, svg_helper_mjs_1.SVG_HEIGHT - 60, "1.8em");
        offset = svg_helper_mjs_1.SVG_WIDTH / 2 - this.getTotalLength() / 2;
        for (let component of this.components) {
            if (component.type === "body") {
                svgString += `<line x1="${svg_helper_mjs_1.SVG_WIDTH - 160}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - component.maxHeight / 2 * 5}" ` +
                    `x2="${svg_helper_mjs_1.SVG_WIDTH - 140}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - component.maxHeight / 2 * 5}" ` +
                    `stroke="black" stroke-width="1" />\n`;
                svgString += `<line x1="${svg_helper_mjs_1.SVG_WIDTH - 160}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + component.maxHeight / 2 * 5}" ` +
                    `x2="${svg_helper_mjs_1.SVG_WIDTH - 140}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + component.maxHeight / 2 * 5}" ` +
                    `stroke="black" stroke-width="1" />\n`;
                svgString += `<line x1="${svg_helper_mjs_1.SVG_WIDTH - 150}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + component.maxHeight / 2 * 5}" ` +
                    `x2="${svg_helper_mjs_1.SVG_WIDTH - 150}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - component.maxHeight / 2 * 5}" ` +
                    `stroke="black" stroke-width="1" />\n`;
                svgString += `<text ` +
                    `x="${svg_helper_mjs_1.SVG_WIDTH - 168}" ` +
                    `y="${svg_helper_mjs_1.SVG_HEIGHT / 2}" ` +
                    `transform="rotate(-90, ${svg_helper_mjs_1.SVG_WIDTH - 168}, ${svg_helper_mjs_1.SVG_HEIGHT / 2})" ` +
                    `font-size="1.2em" text-anchor="middle" dominant-baseline="middle">${component.maxHeight} mm</text>\n`;
                svgString += `<text ` +
                    `x="${svg_helper_mjs_1.SVG_WIDTH - 150}" ` +
                    `y="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 8 + component.maxHeight / 2 * 5}" ` +
                    `transform="rotate(-90, ${svg_helper_mjs_1.SVG_WIDTH - 150}, ${svg_helper_mjs_1.SVG_HEIGHT / 2 + 8 + component.maxHeight / 2 * 5})" ` +
                    `font-size="1.2em" text-anchor="end" dominant-baseline="middle">body</text>\n`;
            }
            if (component.type === "grip") {
                svgString += `<line x1="${svg_helper_mjs_1.SVG_WIDTH - 200}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - component.maxHeight / 2 * 5}" ` +
                    `x2="${svg_helper_mjs_1.SVG_WIDTH - 180}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - component.maxHeight / 2 * 5}" ` +
                    `stroke="black" stroke-width="1" />\n`;
                svgString += `<line x1="${svg_helper_mjs_1.SVG_WIDTH - 200}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + component.maxHeight / 2 * 5}" ` +
                    `x2="${svg_helper_mjs_1.SVG_WIDTH - 180}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + component.maxHeight / 2 * 5}" ` +
                    `stroke="black" stroke-width="1" />\n`;
                svgString += `<line x1="${svg_helper_mjs_1.SVG_WIDTH - 190}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + component.maxHeight / 2 * 5}" ` +
                    `x2="${svg_helper_mjs_1.SVG_WIDTH - 190}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - component.maxHeight / 2 * 5}" ` +
                    `stroke="black" stroke-width="1" />\n`;
                svgString += `<text ` +
                    `x="${svg_helper_mjs_1.SVG_WIDTH - 208}" ` +
                    `y="${svg_helper_mjs_1.SVG_HEIGHT / 2}" ` +
                    `transform="rotate(-90, ${svg_helper_mjs_1.SVG_WIDTH - 208}, ${svg_helper_mjs_1.SVG_HEIGHT / 2})" ` +
                    `font-size="1.2em" text-anchor="middle" dominant-baseline="middle">${component.maxHeight} mm</text>\n`;
                svgString += `<text ` +
                    `x="${svg_helper_mjs_1.SVG_WIDTH - 190}" ` +
                    `y="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 8 + component.maxHeight / 2 * 5}" ` +
                    `transform="rotate(-90, ${svg_helper_mjs_1.SVG_WIDTH - 190}, ${svg_helper_mjs_1.SVG_HEIGHT / 2 + 8 + component.maxHeight / 2 * 5})" ` +
                    `font-size="1.2em" text-anchor="end" dominant-baseline="middle">grip</text>\n`;
            }
            svgString += `<line x1="${offset}" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 100 + this.maxHeight / 2 * 5}" ` +
                `x2="${offset}" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 124 + this.maxHeight / 2 * 5}" ` +
                `stroke="black" stroke-width="1" />\n`;
            let currentOffset = offset;
            offset += component.getWidth();
            svgString += `<text x="${(offset + currentOffset) / 2}" y="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 126 + this.maxHeight / 2 * 5}" transform="rotate(-90, ${(offset + currentOffset) / 2}, ${svg_helper_mjs_1.SVG_HEIGHT / 2 + 126 + this.maxHeight / 2 * 5})" font-size="1.2em" text-anchor="end" dominant-baseline="middle">${component.getMaterial()}</text>\n`;
        }
        svgString += `<line x1="${offset}" y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 100 + this.maxHeight / 2 * 5}" ` +
            `x2="${offset}" y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 124 + this.maxHeight / 2 * 5}" ` +
            `stroke="black" stroke-width="1" />\n`;
        svgString += `<line x1="${svg_helper_mjs_1.SVG_WIDTH / 2 - this.totalLength / 2}" y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 112 + this.maxHeight / 2 * 5}" ` +
            `x2="${svg_helper_mjs_1.SVG_WIDTH / 2 + this.totalLength / 2}" y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 112 + this.maxHeight / 2 * 5}" ` +
            `stroke="black" stroke-width="1" />\n`;
        for (let component of this.components) {
            svgString += component.renderBack(shouldColour, svg_helper_mjs_1.SVG_WIDTH - 100, this.colourMap, thisColourIndex, thisColourComponent);
        }
        // last thing we do is to draw the back section in order
        for (let back of this.back) {
            let dimensionsTemp = back.dimensions.split("x");
            let dimensions = [];
            for (const dimension of dimensionsTemp) {
                dimensions.push(dimension);
            }
            switch (back.type) {
                case "circle":
                    svgString += `<circle cx="${svg_helper_mjs_1.SVG_WIDTH - 100}" cy="${svg_helper_mjs_1.SVG_HEIGHT / 2}" r="${dimensions[0] / 2 * 5}" stroke="dimgray" stroke-width="0.5" fill="${back.fill}" />`;
                    break;
            }
        }
        this.components.reverse();
        for (let component of this.components) {
            svgString += component.renderFront(shouldColour, 160, this.colourMap, thisColourIndex, thisColourComponent);
        }
        for (let front of this.front) {
            let dimensionsTemp = front.dimensions.split("x");
            let dimensions = [];
            for (const dimension of dimensionsTemp) {
                dimensions.push(dimension);
            }
            switch (front.type) {
                case "circle":
                    svgString += `<circle cx="160" cy="${svg_helper_mjs_1.SVG_HEIGHT / 2}" r="${dimensions[0] / 2 * 5}" stroke="dimgray" stroke-width="0.5" fill="${front.fill}" />`;
                    break;
            }
        }
        this.components.reverse();
        // now go through each component and render the parts
        for (let component of this.components) {
            svgString += component.renderSvg(shouldColour, xPosition, this.colourMap, thisColourIndex);
            xPosition += component.getWidth();
        }
        svgString += this.drawSvgColours();
        svgString += this.drawSvgMaterials();
        svgString += Pencil.SVG_END;
        // now draw the colours
        return (svgString);
    }
    /**
     * Draw the guidelines for the total drawing - this should be done close to
     * first as you want them in the background.
     *
     * @returns {string} The SVG representation of the guidelines
     */
    drawSvgGuidelines() {
        // now we are going to go through each of the components and draw the shapes
        let offset = svg_helper_mjs_1.SVG_WIDTH / 2 - this.getTotalLength() / 2;
        let svgString = "";
        let hasExtra = false;
        // now for the extra components guidelines
        for (let component of this.components) {
            for (const extraPart of component.getExtraParts()) {
                // draw the straight-through line for guidance top of the extra parts
                svgString += `<line x1="100" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extraPart.extraOffset[1] * 5 - (extraPart.extraHeight) * 5}" ` +
                    `x2="${svg_helper_mjs_1.SVG_WIDTH - 100}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extraPart.extraOffset[1] * 5 - (extraPart.extraHeight) * 5}" ` +
                    `stroke="#cfcfcf" stroke-width="1" />\n`;
                // draw the straight-through line for guidance bottom of the extra parts
                svgString += `<line x1="160" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extraPart.extraOffset[1] * 5}" ` +
                    `x2="${svg_helper_mjs_1.SVG_WIDTH - 100}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extraPart.extraOffset[1] * 5}" ` +
                    `stroke="#cfcfcf" stroke-width="1" />\n`;
                // guidelines for the extra width - left side
                svgString += `<line x1="${160 - extraPart.extraDepth / 2 * 5}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 70}" ` +
                    `x2="${160 - extraPart.extraDepth / 2 * 5}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2}" ` +
                    `stroke="#cfcfcf" stroke-width="1" />\n`;
                // guidelines for the extra width - right side
                svgString += `<line x1="${160 + extraPart.extraDepth / 2 * 5}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 70}" ` +
                    `x2="${160 + extraPart.extraDepth / 2 * 5}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2}" ` +
                    `stroke="#cfcfcf" stroke-width="1" />\n`;
                hasExtra = true;
            }
        }
        // FRONT VIEW GUIDELINES
        // top line
        svgString += `<line x1="${hasExtra ? 160 : 100}" ` +
            `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - this.maxHeight / 2 * 5}" ` +
            `x2="${svg_helper_mjs_1.SVG_WIDTH - 100}" ` +
            `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - this.maxHeight / 2 * 5}" ` +
            `stroke="#cfcfcf" stroke-width="1" />\n`;
        // bottom line of full pencil
        svgString += `<line x1="100" y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
            `x2="${svg_helper_mjs_1.SVG_WIDTH - 100}" y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
            `stroke="#cfcfcf" stroke-width="1" />\n`;
        // Vertical line of width - left
        svgString += `<line x1="${160 - this.maxWidth / 2 * 5}" y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 20 + this.maxHeight / 2 * 5}" ` +
            `x2="${160 - this.maxWidth / 2 * 5}" y2="${svg_helper_mjs_1.SVG_HEIGHT / 2}" ` +
            `stroke="#cfcfcf" stroke-width="1" />\n`;
        // Vertical line of width - right
        svgString += `<line x1="${160 + this.maxWidth / 2 * 5}" y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 20 + this.maxHeight / 2 * 5}" ` +
            `x2="${160 + this.maxWidth / 2 * 5}" y2="${svg_helper_mjs_1.SVG_HEIGHT / 2}" ` +
            `stroke="#cfcfcf" stroke-width="1" />\n`;
        // SIDE VIEW GUIDELINES FOR THE COMPONENTS
        // reset the offset to redraw
        offset = svg_helper_mjs_1.SVG_WIDTH / 2 - this.getTotalLength() / 2;
        for (let component of this.components) {
            // vertical line
            svgString += `<line x1="${offset}" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 88 - this.maxHeight / 2 * 5}" ` +
                `x2="${offset}" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 120 + this.maxHeight / 2 * 5}" ` +
                `stroke="#cfcfcf" stroke-width="1" />\n`;
            // vertical lines for the body (on the left hand side)
            // if(component.type === "body") {
            // 	svgString += `<line x1="${offset}" ` +
            // 			`y1="${SVG_HEIGHT/2 - component.maxHeight/2 * 5}" ` +
            // 			`x2="${SVG_WIDTH - 140}" ` +
            // 			`y2="${SVG_HEIGHT/2 - component.maxHeight/2 * 5}" ` +
            // 			`stroke="#cfcfcf" stroke-width="1"  stroke-dasharray="1,1" />\n`;
            // 	svgString += `<line x1="${offset}" ` +
            // 			`y1="${SVG_HEIGHT/2 + component.maxHeight/2 * 5}" ` +
            // 			`x2="${SVG_WIDTH - 140}" ` +
            // 			`y2="${SVG_HEIGHT/2 + component.maxHeight/2 * 5}" ` +
            // 			`stroke="#cfcfcf" stroke-width="1" stroke-dasharray="1,1"/>\n`;
            // }
            //
            // if(component.type === "grip") {
            // 	svgString += `<line x1="${offset}" ` +
            // 			`y1="${SVG_HEIGHT/2 - component.maxHeight/2 * 5}" ` +
            // 			`x2="${SVG_WIDTH - 180}" ` +
            // 			`y2="${SVG_HEIGHT/2 - component.maxHeight/2 * 5}" ` +
            // 			`stroke="#cfcfcf" stroke-width="1" stroke-dasharray="1.1" />\n`;
            // 	svgString += `<line x1="${offset}" ` +
            // 			`y1="${SVG_HEIGHT/2 + component.maxHeight/2 * 5}" ` +
            // 			`x2="${SVG_WIDTH - 180}" ` +
            // 			`y2="${SVG_HEIGHT/2 + component.maxHeight/2 * 5}" ` +
            // 			`stroke="#cfcfcf" stroke-width="1" stroke-dasharray="1,1" />\n`;
            // }
            offset += component.getWidth();
            // now for extraParts
            for (const extraPart of component.getExtraParts()) {
                // draw the straight-through line for guidance
                svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 44 - this.maxHeight / 2 * 5}" ` +
                    `x2="${offset + extraPart.extraOffset[0] * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 120}" ` +
                    `stroke="#cfcfcf" stroke-width="1" />\n`;
                svgString += `<line x1="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 44 - this.maxHeight / 2 * 5}" ` +
                    `x2="${offset + extraPart.extraOffset[0] * 5 + extraPart.extraWidth * 5 - (component.extraPartFirst ? component.getWidth() : 0)}" ` +
                    `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 120}" ` +
                    `stroke="#cfcfcf" stroke-width="1" />\n`;
            }
        }
        svgString += `<line x1="${offset}" ` +
            `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 88 - this.maxHeight / 2 * 5}" ` +
            `x2="${offset}" ` +
            `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 100 + this.maxHeight / 2 * 5}" ` +
            `stroke="#cfcfcf" stroke-width="1" />\n`;
        return (svgString);
    }
    drawFrontDimensions() {
        let svgString = "";
        // THIS IS THE FRONT VIEW
        let extrasHeight = 0;
        let extrasOffset = 0;
        let extrasOffsetHeight = 0;
        // do we have any extras?
        let thisExtraPart = null;
        for (const component of this.components) {
            if (component.extraParts.length > 0) {
                for (const extraPart of component.extraParts) {
                    if (extraPart.extraHeight > extrasHeight) {
                        extrasHeight = extraPart.extraHeight;
                        extrasOffset = extraPart.extraOffset[1];
                        extrasOffsetHeight = component.maxHeight / 2;
                        thisExtraPart = extraPart;
                    }
                }
            }
        }
        // now for the measurements of the height
        // top horizontal
        if (thisExtraPart) {
            // top
            svgString += `<line x1="100" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5}" ` +
                `x2="120" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5}" ` +
                `stroke="black" stroke-width="1" />\n`;
            // bottom
            svgString += `<line x1="${160 - thisExtraPart.extraDepth / 2 * 5}" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 70}" ` +
                `x2="${160 - thisExtraPart.extraDepth / 2 * 5}" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 50}" ` +
                `stroke="black" stroke-width="1" />\n`;
            // vertical
            svgString += `<line x1="${160 + thisExtraPart.extraDepth / 2 * 5}" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 70}" ` +
                `x2="${160 + thisExtraPart.extraDepth / 2 * 5}" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 50}" ` +
                `stroke="black" stroke-width="1" />\n`;
            svgString += `<line x1="${160 - thisExtraPart.extraDepth / 2 * 5}" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 60}" ` +
                `x2="${160 + thisExtraPart.extraDepth / 2 * 5}" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 60}" ` +
                `stroke="black" stroke-width="1" />\n`;
            svgString += `<text x="160" ` +
                `y="${svg_helper_mjs_1.SVG_HEIGHT / 2 - 80}" ` +
                `font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="central">` +
                `${(Math.round((thisExtraPart.extraDepth) * 100) / 100).toFixed(2)} mm` +
                `</text>\n`;
        }
        else {
            svgString += `<line x1="100" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - this.maxHeight / 2 * 5}" ` +
                `x2="120" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - this.maxHeight / 2 * 5}" ` +
                `stroke="black" stroke-width="1" />\n`;
        }
        // bottom horizontal
        svgString += `<line x1="100" ` +
            `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
            `x2="120" ` +
            `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
            `stroke="black" stroke-width="1" />\n`;
        // down stroke
        if (thisExtraPart) {
            svgString += `<line x1="110" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5}" ` +
                `x2="110" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
                `stroke="black" stroke-width="1" />\n`;
        }
        else {
            svgString += `<line x1="110" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
                `x2="110" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - this.maxHeight / 2 * 5}" ` +
                `stroke="black" stroke-width="1" />\n`;
        }
        if (thisExtraPart) {
            // top of extra
            svgString += `<line x1="212" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5}" ` +
                `x2="232" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5}" ` +
                `stroke="black" stroke-width="1" />\n`;
            // bottom of extra
            svgString += `<line x1="212" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extrasOffset * 5}" ` +
                `x2="232" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extrasOffset * 5}" ` +
                `stroke="black" stroke-width="1" />\n`;
            // vertical line
            svgString += `<line x1="222" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extrasOffset * 5 - extrasHeight * 5}" ` +
                `x2="222" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extrasOffset * 5}" ` +
                `stroke="black" stroke-width="1" />\n`;
            svgString += `<text x="236" ` +
                `y="${svg_helper_mjs_1.SVG_HEIGHT / 2 - extrasOffset * 5 - extrasHeight / 2 * 5}" ` +
                `font-size="1.2em" font-weight="bold" text-anchor="start" dominant-baseline="central">` +
                `${(Math.round((thisExtraPart.extraHeight) * 100) / 100).toFixed(2)} mm` +
                `</text>\n`;
            // top line
            svgString += `<line x1="200" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 - this.maxHeight / 2 * 5}" ` +
                `x2="220" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - this.maxHeight / 2 * 5}" ` +
                `stroke="black" stroke-width="1" />\n`;
            // bottom line
            svgString += `<line x1="200" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
                `x2="220" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
                `stroke="black" stroke-width="1" />\n`;
            // horizontal
            svgString += `<line x1="210" ` +
                `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + this.maxHeight / 2 * 5}" ` +
                `x2="210" ` +
                `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 - this.maxHeight / 2 * 5}" ` +
                `stroke="black" stroke-width="1" />\n`;
            svgString += `<text x="224" y="${svg_helper_mjs_1.SVG_HEIGHT / 2}" font-size="1.2em" font-weight="bold" text-anchor="start" dominant-baseline="central">${(Math.round((this.maxHeight) * 100) / 100).toFixed(2)} mm</text>\n`;
        }
        // this is the Front side total height...
        svgString += `<text ` +
            `x="90" ` +
            `y="${svg_helper_mjs_1.SVG_HEIGHT / 2}" ` +
            `transform="rotate(-90, 90, ${svg_helper_mjs_1.SVG_HEIGHT / 2})" ` +
            `font-size="1.2em" font-weight="bold" text-anchor="middle" dominant-baseline="central">` +
            `${(Math.round((this.maxHeight + extrasHeight - (extrasOffsetHeight - extrasOffset)) * 100) / 100).toFixed(2)} mm` +
            `</text>\n`;
        svgString += (0, svg_helper_mjs_1.drawTextBoldCentred)("Front", 160, svg_helper_mjs_1.SVG_HEIGHT - 60, "1.8em");
        // and the measurements of the width
        // horizontal
        svgString += `<line x1="${160 - this.maxWidth / 2 * 5}" ` +
            `y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 30 + this.maxHeight / 2 * 5}" ` +
            `x2="${160 + this.maxWidth / 2 * 5}" ` +
            `y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 30 + this.maxHeight / 2 * 5}" ` +
            `stroke="black" stroke-width="1" />\n`;
        // left
        svgString += `<line x1="${160 - this.maxWidth / 2 * 5}" y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 20 + this.maxHeight / 2 * 5}" ` +
            `x2="${160 - this.maxWidth / 2 * 5}" y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 40 + this.maxHeight / 2 * 5}" ` +
            `stroke="black" stroke-width="1" />\n`;
        // right
        svgString += `<line x1="${160 + this.maxWidth / 2 * 5}" y1="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 20 + this.maxHeight / 2 * 5}" ` +
            `x2="${160 + this.maxWidth / 2 * 5}" y2="${svg_helper_mjs_1.SVG_HEIGHT / 2 + 40 + this.maxHeight / 2 * 5}" ` +
            `stroke="black" stroke-width="1" />\n`;
        svgString += (0, svg_helper_mjs_1.drawTextBoldCentred)(`${(Math.round(this.maxWidth * 100) / 100).toFixed(2)} mm`, 160, svg_helper_mjs_1.SVG_HEIGHT / 2 + 50 + this.maxHeight / 2 * 5, "1.2em");
        return (svgString);
    }
    drawSvgColours() {
        let svgString = "";
        // lets draw the pencil colours
        let colourOffset = svg_helper_mjs_1.SVG_WIDTH - 60;
        svgString += `<text ` +
            `x="${colourOffset + 40}" ` +
            `y="30" ` +
            `font-size="1.6em" font-weight="bold" text-anchor="end" dominant-baseline="central">` +
            `'${this.colourComponent}' colour variants` +
            `</text>\n`;
        for (let colourComponent of this.colourComponents) {
            let fillColour = colourComponent;
            if (this.colourMap[colourComponent]) {
                fillColour = this.colourMap[colourComponent];
            }
            svgString += `<rect x="${colourOffset}" y="55" width="40" rx="50%" ry="50%" height="40" stroke="black" stroke-width="2" fill="${fillColour}" />\n`;
            svgString += `<text x="${colourOffset + 20}" ` +
                `y="100" ` +
                `transform="rotate(-90, ${colourOffset + 20}, 100)" ` +
                `font-size="1.2em" font-weight="bold" text-anchor="end" dominant-baseline="central">` +
                `${colourComponent}` +
                `</text>\n`;
            colourOffset -= 60;
        }
        return (svgString);
    }
    drawSvgMaterials() {
        let svgString = "";
        let i = 0;
        let offset = 106;
        svgString += `<text ` +
            `x="30" ` +
            `y="${offset}" ` +
            `font-size="1.2em" font-weight="bold" text-anchor="start" dominant-baseline="central">` +
            `Materials:` +
            `</text>\n`;
        offset += 20;
        for (const material of this.materials) {
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
    getTotalLength() { return (this.totalLength); }
}
exports.Pencil = Pencil;
// TODO - remove to svg-helper
Pencil.WIDTH = 1500;
Pencil.HEIGHT = 600;
Pencil.SVG_START = `<svg xmlns="http://www.w3.org/2000/svg" ` +
    `width="${svg_helper_mjs_1.SVG_WIDTH}" ` +
    `height="${svg_helper_mjs_1.SVG_HEIGHT}">\n` +
    `<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">\n` +
    `<rect width="6" height="6" fill='none'/>\n` +
    `<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,8"/>\n` +
    `<path stroke="dimgray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,8"/>\n` +
    `<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 8,0" />\n` +
    `<path stroke="gray" stroke-linecap="round" stroke-width="1" d="M 4,4 L 0,0" />\n` +
    `</pattern>\n` +
    `<rect x="0" y="0" width="${svg_helper_mjs_1.SVG_WIDTH}" height="${svg_helper_mjs_1.SVG_HEIGHT}" fill="white" stroke="black" stroke-width="4" />\n` +
    `<rect x="2" y="2" width="${svg_helper_mjs_1.SVG_WIDTH - 4}" height="${svg_helper_mjs_1.SVG_HEIGHT - 4}" fill="white" stroke="orange" stroke-width="1" />\n`;
Pencil.SVG_END = `<text x="50%" y="${svg_helper_mjs_1.SVG_HEIGHT - 20}" font-size="1.1em" font-weight="bold" text-anchor="middle" dominant-baseline="middle">Copyright (c) // The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n` +
    `</svg>\n`;
//# sourceMappingURL=Pencil.js.map