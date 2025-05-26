"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGRenderer = void 0;
var svg_helper_ts_1 = require("../../utils/svg-helper.ts");
var formatter_ts_1 = require("../../utils/formatter.ts");
var OpaqueColour_ts_1 = require("../../model/meta/OpaqueColour.ts");
var Pattern_ts_1 = require("../../model/meta/Pattern.ts");
var filesystem_ts_1 = require("../../utils/filesystem.ts");
var fs_1 = require("fs");
var json_object_mapper_1 = require("json-object-mapper");
var SVGRenderer = /** @class */ (function () {
    function SVGRenderer(pencil, width, height, rendererName) {
        if (rendererName === void 0) { rendererName = ""; }
        this.patternMap = new Map();
        if (!SVGRenderer.defaultPatternLoaded) {
            SVGRenderer.loadDefaultPatterns();
        }
        this.pencil = pencil;
        this._width = width;
        this._height = height;
        this._rendererName = rendererName;
    }
    SVGRenderer.loadDefaultPatterns = function () {
        // load all the patterns
        for (var _i = 0, _a = (0, filesystem_ts_1.listFiles)("./patterns"); _i < _a.length; _i++) {
            var listFile = _a[_i];
            var patternName = listFile.substring(0, listFile.lastIndexOf("."));
            var pattern = json_object_mapper_1.ObjectMapper.deserialize(Pattern_ts_1.Pattern, JSON.parse(fs_1.default.readFileSync("./patterns/" + listFile, "utf8")));
            console.log("Statically loaded pattern ".concat(listFile, " (").concat(pattern.name, " - ").concat(pattern.description, ") ").concat(pattern.inBuilt ? "In built into the system as code." : ""));
            if (!pattern.inBuilt) {
                this.defaultPatternMap.set(patternName, pattern);
            }
            this.allPatternMap.set(patternName, pattern);
        }
        this.defaultPatternLoaded = true;
    };
    /**
     * Resize the SVG - this is used when the size of the SVG is dynamically calculated,
     * e.g. when multiple pencils will be drawn based on colour.
     *
     * @param width The new width for the SVG
     * @param height The new height for the SVG
     *
     * @protected
     */
    SVGRenderer.prototype.resize = function (width, height) {
        this._width = width;
        this._height = height;
    };
    SVGRenderer.prototype.addOutlineBox = function (width, height, transparent) {
        if (!transparent) {
            return ("<rect x=\"0\" y=\"0\" width=\"".concat(width, "\" height=\"").concat(height, "\" fill=\"white\" stroke=\"black\" stroke-width=\"4\" />\n") +
                "<rect x=\"2\" y=\"2\" width=\"".concat(width - 4, "\" height=\"").concat(height - 4, "\" fill=\"white\" stroke=\"dimgray\" stroke-width=\"1\" />\n"));
        }
        return ("");
    };
    SVGRenderer.prototype.getSvgStart = function (transparent, rotate) {
        if (transparent === void 0) { transparent = false; }
        if (rotate === void 0) { rotate = 0; }
        var svgString = "<svg xmlns=\"http://www.w3.org/2000/svg\" " +
            "width=\"".concat(this._width, "\" ") +
            "height=\"".concat(this._height, "\">\n ");
        for (var _i = 0, _a = SVGRenderer.defaultPatternMap.values(); _i < _a.length; _i++) {
            var pattern = _a[_i];
            svgString += pattern.pattern.join("\n");
        }
        svgString += this.addOutlineBox(this._width, this._height, transparent) +
            "<g transform=\"rotate(".concat(rotate, " ").concat((rotate !== 0 ? this._width / 2 : 0), " ").concat((rotate !== 0 ? this._height / 2 : 0), ")\">\n");
        return (svgString);
    };
    SVGRenderer.prototype.getSvgEnd = function () {
        // TODO - need to determine the height
        if (this._width <= 1400) {
            return ("</g><text x=\"50%\" y=\"".concat(this._height - 40, "\" font-size=\"1.1em\" font-weight=\"bold\" text-anchor=\"middle\" dominant-baseline=\"middle\">Copyright (c) // Synapticloop and The Mechanical Pencil Database (tmpdb)</text>\n") +
                "<text x=\"50%\" y=\"".concat(this._height - 20, "\" font-size=\"1.1em\" font-weight=\"bold\" text-anchor=\"middle\" dominant-baseline=\"middle\">Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n") +
                "<text x=\"".concat(this._width - 10, "\" y=\"").concat(this._height - 10, "\" font-size=\"0.5em\" font-weight=\"bold\" text-anchor=\"end\" dominant-baseline=\"middle\">").concat(this._rendererName, "</text>\n") +
                "</svg>");
        }
        var svgString = "</g><text x=\"50%\" y=\"".concat(this._height - 20, "\" font-size=\"1.1em\" font-weight=\"bold\" text-anchor=\"middle\" dominant-baseline=\"middle\">Copyright (c) // Synapticloop and The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</text>\n") +
            "<text x=\"".concat(this._width - 10, "\" y=\"").concat(this._height - 10, "\" font-size=\"0.5em\" font-weight=\"bold\" text-anchor=\"end\" dominant-baseline=\"middle\">").concat(this._rendererName, "</text>\n") +
            "</svg>";
        return (svgString);
    };
    SVGRenderer.prototype.renderCentreLineHorizontal = function (y, xInsetLeft, xInsetRight) {
        if (xInsetLeft === void 0) { xInsetLeft = 40; }
        if (xInsetRight === void 0) { xInsetRight = 40; }
        var svgString = "";
        svgString += (0, svg_helper_ts_1.lineHorizontal)(xInsetLeft, y, this._width - xInsetLeft - xInsetRight, "1", "#5f5f5f", "2");
        svgString += (0, svg_helper_ts_1.target)(xInsetLeft, y, 40, 10);
        svgString += (0, svg_helper_ts_1.target)(this._width - xInsetRight, y, 40, 10);
        return (svgString);
    };
    SVGRenderer.prototype.renderCentreLineVertical = function (x, yInsetTop, yInsetBottom) {
        if (yInsetTop === void 0) { yInsetTop = 40; }
        if (yInsetBottom === void 0) { yInsetBottom = 40; }
        var svgString = "";
        svgString += (0, svg_helper_ts_1.lineVertical)(x, yInsetTop, this._height - yInsetTop - yInsetBottom, "1", "#5f5f5f", "2");
        svgString += (0, svg_helper_ts_1.target)(x, yInsetTop, 40, 10);
        svgString += (0, svg_helper_ts_1.target)(x, this._height - yInsetBottom, 40, 10);
        return (svgString);
    };
    SVGRenderer.prototype.renderOverviewText = function (full) {
        if (full === void 0) { full = true; }
        var svgString = "";
        svgString += (0, svg_helper_ts_1.drawTextBold)("".concat(this.pencil.brand) +
            " // " +
            "".concat(this.pencil.modelName, " ") +
            "".concat((this.pencil.modelNumber ? "(Model #: " + this.pencil.modelNumber + ")" : "")), 30, 50, "2.0em");
        if (full) {
            svgString += (0, svg_helper_ts_1.drawText)("".concat(this.pencil.text), 30, 80, "1.1em");
            if (this.pencil.leadSize) {
                svgString += (0, svg_helper_ts_1.drawText)("Lead size: ".concat(this.pencil.leadSize, " mm"), 30, 100, "1.1em");
            }
            if (this.pencil.weight) {
                svgString += (0, svg_helper_ts_1.drawText)("Weight: ".concat(this.pencil.weight, "g"), 30, 120, "1.1em");
            }
        }
        return (svgString);
    };
    SVGRenderer.prototype.renderPencilColours = function () {
        var svgString = "";
        // lets draw the pencil colours
        var colourOffset = this._width - 60;
        svgString += "<text " +
            "x=\"".concat(colourOffset + 40, "\" ") +
            "y=\"30\" " +
            "font-size=\"1.6em\" font-weight=\"bold\" text-anchor=\"end\" dominant-baseline=\"central\">" +
            "Colour variants of the ".concat(this.pencil.colourComponent) +
            "</text>\n";
        for (var _i = 0, _a = this.pencil.colourComponents; _i < _a.length; _i++) {
            var colourComponent = _a[_i];
            svgString += "<rect x=\"".concat(colourOffset, "\" y=\"55\" width=\"40\" rx=\"50%\" ry=\"50%\" height=\"40\" stroke=\"black\" stroke-width=\"2\" fill=\"").concat(colourComponent.colour, "\" fill-opacity=\"").concat(colourComponent.opacity, "\"/>\n");
            svgString += "<text x=\"".concat(colourOffset + 20, "\" ") +
                "y=\"100\" " +
                "transform=\"rotate(-90, ".concat(colourOffset + 20, ", 100)\" ") +
                "font-size=\"1.2em\" font-weight=\"bold\" text-anchor=\"end\" dominant-baseline=\"central\">" +
                "".concat(colourComponent.colourName) +
                "</text>\n";
            colourOffset -= 60;
        }
        return (svgString);
    };
    SVGRenderer.prototype.renderMaterialList = function () {
        var svgString = "";
        var offset = 136;
        svgString += "<text " +
            "x=\"30\" " +
            "y=\"".concat(offset, "\" ") +
            "font-size=\"1.2em\" font-weight=\"bold\" text-anchor=\"start\" dominant-baseline=\"central\">" +
            "Materials:" +
            "</text>\n";
        offset += 20;
        for (var _i = 0, _a = this.pencil.materials; _i < _a.length; _i++) {
            var material = _a[_i];
            svgString += "<text " +
                "x=\"50\" " +
                "y=\"".concat(offset, "\" ") +
                "font-size=\"1.2em\" text-anchor=\"start\" dominant-baseline=\"central\">" +
                " - ".concat(material) +
                "</text>\n";
            offset += 20;
        }
        return (svgString);
    };
    SVGRenderer.prototype.renderSectionTitles = function () {
        var svgString = "";
        // Front view heading
        svgString += (0, svg_helper_ts_1.drawTextBoldCentred)("Front", 160, this._height - 60, "1.8em");
        // Side View Heading
        svgString += (0, svg_helper_ts_1.drawTextBoldCentred)("Side view", this._width / 2, this._height - 60, "1.8em");
        // Back View Heading
        svgString += (0, svg_helper_ts_1.drawTextBoldCentred)("Back", this._width - 100, this._height - 60, "1.8em");
        return (svgString);
    };
    SVGRenderer.prototype.renderTaper = function (startX, midY, part, colourIndex) {
        var _a, _b, _c, _d;
        var svgString = "";
        // no point doing anything if there is no taper
        if (!(part.taperStart || part.taperEnd)) {
            return ("");
        }
        var opaqueColour = part.getOpacityColour(colourIndex);
        var strokeColor = "black";
        // TODO - need a nice way to determine what shade of black/grey -
        //   thinking grayscale inverse
        if (opaqueColour.colourName === "black") {
            strokeColor = "gray";
        }
        var xOffsetTaperStart = 0;
        var xOffsetTaperStartScale = 1;
        if ((_a = part.taperStart) === null || _a === void 0 ? void 0 : _a.xOffset) {
            xOffsetTaperStart = part.taperStart.xOffset;
        }
        if ((_b = part.taperStart) === null || _b === void 0 ? void 0 : _b.xScale) {
            xOffsetTaperStartScale = part.taperStart.xScale;
        }
        if (part.taperStart) {
            var backgroundColour = part.taperStart.getBackgroundOpacityColour(colourIndex);
            svgString += "\n<!-- TAPER START: ".concat(part.shape, " -->\n");
            // now we get to draw the taper
            switch (part.shape) {
                case "hexagonal":
                    // Draw the intersection of the path
                    // TODO - should be an intersection
                    // svgString += rectangle(startX, midY - part.endHeight / 2 * 5 + 0.25, xOffsetTaperStart * 5 - 0.5, part.startHeight * 5 - 0.5, "none", backgroundColour);
                    svgString += "<path d=\"M ".concat(startX + xOffsetTaperStart * 5, " ").concat(midY - part.endHeight / 2 * 5, " ") +
                        "C ".concat(startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5), " ").concat(midY - part.endHeight / 2 * 5 * 3 / 4, ", ") +
                        "".concat(startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5), " ").concat(midY - part.endHeight / 2 * 5 / 4, ", ") +
                        "".concat(startX + xOffsetTaperStart * 5, " ").concat(midY, "\" ") +
                        "stroke-width=\"1.0\" " +
                        "stroke=\"".concat(strokeColor, "\" ") +
                        "stroke-linecap=\"round\" " +
                        "fill-opacity=\"".concat(opaqueColour.opacity, "\" ") +
                        "fill=\"none\" />";
                    svgString += "<path d=\"M ".concat(startX + xOffsetTaperStart * 5, " ").concat(midY + part.endHeight / 2 * 5, " ") +
                        "C ".concat(startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5), " ").concat(midY + part.endHeight / 2 * 5 * 3 / 4, ", ") +
                        "".concat(startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5), " ").concat(midY + part.endHeight / 2 * 5 / 4, ", ") +
                        "".concat(startX + xOffsetTaperStart * 5, " ").concat(midY, "\" ") +
                        "stroke-width=\"1.0\" stroke=\"".concat(strokeColor, "\" stroke-linecap=\"round\" ") +
                        "fill-opacity=\"".concat(opaqueColour.opacity, "\" ") +
                        "fill=\"none\" />";
                    break;
                case "cylinder":
                    svgString += (0, svg_helper_ts_1.rectangle)(startX, midY - part.endHeight / 2 * 5 + 0.25, xOffsetTaperStart * 5 - 0.5, part.startHeight * 5 - 0.5, "none", backgroundColour);
                    svgString += "<path d=\"M ".concat(startX + xOffsetTaperStart * 5, " ").concat(midY - part.endHeight / 2 * 5, " ") +
                        "C ".concat(startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5), " ").concat(midY - part.endHeight / 2 * 5, ", ") +
                        "".concat(startX + xOffsetTaperStart * (xOffsetTaperStartScale * -5), " ").concat(midY + part.endHeight / 2 * 5, ", ") +
                        "".concat(startX + xOffsetTaperStart * 5, " ").concat(midY + part.endHeight / 2 * 5, "\" ") +
                        "stroke-width=\"1.0\" " +
                        "stroke=\"".concat(strokeColor, "\" ") +
                        "stroke-linecap=\"round\" " +
                        "fill-opacity=\"".concat(opaqueColour.opacity, "\" ") +
                        "fill=\"".concat(opaqueColour.colour, "\" />");
                    break;
            }
        }
        var xOffsetTaperEnd = 0;
        var xOffsetTaperEndScale = 1;
        if ((_c = part.taperEnd) === null || _c === void 0 ? void 0 : _c.xOffset) {
            xOffsetTaperEnd = part.taperEnd.xOffset;
        }
        if ((_d = part.taperEnd) === null || _d === void 0 ? void 0 : _d.xScale) {
            xOffsetTaperEndScale = part.taperEnd.xScale;
        }
        if (part.taperEnd) {
            var backgroundColour = part.taperEnd.getBackgroundOpacityColour(colourIndex);
            svgString += "\n<!-- TAPER END: ".concat(part.shape, " -->\n");
            // now we get to draw the taper
            switch (part.shape) {
                case "hexagonal":
                    // TODO - need to intersect between the two
                    // svgString += rectangle(
                    // 		startX - xOffsetTaperEnd * 5,
                    // 		midY - part.endHeight / 2 * 5 + 0.25,
                    // 		(part.length + xOffsetTaperEnd) * 5 - 0.5,
                    // 		part.startHeight * 5 - 0.5,
                    // 		"none",
                    // 		backgroundColour);
                    svgString += "<path d=\"M ".concat(startX + (part.length + xOffsetTaperEnd) * 5, " ").concat(midY - part.endHeight / 2 * 5, " ") +
                        "C ".concat(startX + ((part.length - xOffsetTaperEnd) * 5 * xOffsetTaperEndScale), " ").concat(midY - part.endHeight / 2 * 5 * 3 / 4, ", ") +
                        "".concat(startX + ((part.length - xOffsetTaperEnd) * 5 * xOffsetTaperEndScale), " ").concat(midY - part.endHeight / 2 * 5 / 4, ", ") +
                        "".concat(startX + (part.length + xOffsetTaperEnd) * 5, " ").concat(midY, "\" ") +
                        "stroke-width=\"0.5\" " +
                        "stroke=\"".concat(strokeColor, "\" ") +
                        "stroke-linecap=\"round\" " +
                        "fill-opacity=\"".concat(opaqueColour.opacity, "\" ") +
                        "fill=\"".concat(opaqueColour.colour, "\" />\n");
                    svgString += "<path d=\"M ".concat(startX + (part.length + xOffsetTaperEnd) * 5, " ").concat(midY + part.endHeight / 2 * 5, " ") +
                        "C ".concat(startX + ((part.length - xOffsetTaperEnd) * 5 * xOffsetTaperEndScale), " ").concat(midY + part.endHeight / 2 * 5 * 3 / 4, ", ") +
                        "".concat(startX + ((part.length - xOffsetTaperEnd) * 5 * xOffsetTaperEndScale), " ").concat(midY + part.endHeight / 2 * 5 / 4, ", ") +
                        "".concat(startX + (part.length + xOffsetTaperEnd) * 5, " ").concat(midY, "\" ") +
                        "stroke-width=\"0.5\" " +
                        "stroke=\"".concat(strokeColor, "\" ") +
                        "stroke-linecap=\"round\" " +
                        "fill-opacity=\"".concat(opaqueColour.opacity, "\" ") +
                        "fill=\"".concat(opaqueColour.colour, "\" />\n");
                    break;
                case "cylinder":
                    svgString += (0, svg_helper_ts_1.rectangle)(startX + part.length * 5 + xOffsetTaperEnd * 5, midY - part.endHeight / 2 * 5 + 0.25, xOffsetTaperEnd * -5 - 0.5, part.startHeight * 5 - 0.5, "none", backgroundColour);
                    svgString += "<path d=\"M ".concat(startX + part.length * 5 + xOffsetTaperEnd * 5, " ").concat(midY - part.endHeight / 2 * 5, " ") +
                        "C ".concat(startX + ((part.length) * 5 - (xOffsetTaperEndScale * xOffsetTaperEnd) * 5), " ").concat(midY - part.endHeight / 2 * 5, ", ") +
                        "".concat(startX + ((part.length) * 5 - (xOffsetTaperEndScale * xOffsetTaperEnd) * 5), " ").concat(midY + part.endHeight / 2 * 5, ", ") +
                        "".concat(startX + part.length * 5 + xOffsetTaperEnd * 5, " ").concat(midY + part.endHeight / 2 * 5, "\" ") +
                        "stroke-width=\"0.5\" " +
                        "stroke=\"".concat(strokeColor, "\" ") +
                        "stroke-linecap=\"round\" " +
                        "fill-opacity=\"".concat(opaqueColour.opacity, "\" ") +
                        "fill=\"".concat(opaqueColour.colour, "\" />\n");
                    break;
            }
        }
        return (svgString);
    };
    SVGRenderer.prototype.renderFrontDimensions = function (x, y) {
        var svgString = "";
        // THIS IS THE FRONT VIEW
        var extrasHeight = 0;
        var extrasOffset = 0;
        var extrasOffsetHeight = 0;
        // do we have any extras?
        var thisExtraPart = null;
        for (var _i = 0, _a = this.pencil.components; _i < _a.length; _i++) {
            var component = _a[_i];
            if (component.extras.length > 0) {
                for (var _b = 0, _c = component.extras; _b < _c.length; _b++) {
                    var extra = _c[_b];
                    if (extra.depth > extrasHeight) {
                        extrasHeight = extra.height;
                        extrasOffset = extra.yOffset;
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
            svgString += (0, svg_helper_ts_1.dimensionsHorizontal)(x - thisExtraPart.depth / 2 * 5, y - 60, thisExtraPart.depth * 5, "".concat((0, formatter_ts_1.formatToTwoPlaces)(thisExtraPart.depth), " mm"), svg_helper_ts_1.TextOrientation.TOP, true);
            svgString += (0, svg_helper_ts_1.dimensionsVertical)(x + 62, y - extrasOffset * 5 - extrasHeight * 5, extrasHeight * 5, "".concat((Math.round((thisExtraPart.height) * 100) / 100).toFixed(2), " mm"), svg_helper_ts_1.TextOrientation.RIGHT);
            // draw the dimensions for the pencil
            svgString += (0, svg_helper_ts_1.dimensionsVertical)(x + 50, y - this.pencil.maxHeight / 2 * 5, this.pencil.maxHeight * 5, "".concat((0, formatter_ts_1.formatToTwoPlaces)(this.pencil.maxHeight), " mm"), svg_helper_ts_1.TextOrientation.RIGHT);
            var pencilExtraHeight = this.pencil.maxHeight + extrasHeight - (extrasOffsetHeight - extrasOffset);
            // we have an extra part - the height is more than the simple body height
            svgString += (0, svg_helper_ts_1.dimensionsVertical)(x - 50, y - extrasOffset * 5 - extrasHeight * 5, pencilExtraHeight * 5, "".concat(pencilExtraHeight, " mm"), svg_helper_ts_1.TextOrientation.LEFT_ROTATED, true);
        }
        else {
            // no extra height here - so we can just draw the text
            svgString += (0, svg_helper_ts_1.dimensionsVertical)(x - 50, y - this.pencil.maxHeight / 2 * 5, this.pencil.maxHeight * 5, "".concat((0, formatter_ts_1.formatToTwoPlaces)(this.pencil.maxHeight), " mm"), svg_helper_ts_1.TextOrientation.LEFT_ROTATED, true);
        }
        // This is the BOTTOM WIDTH of the pencil
        svgString += (0, svg_helper_ts_1.dimensionsHorizontal)(x - this.pencil.maxWidth / 2 * 5, y + 30 + this.pencil.maxHeight / 2 * 5, this.pencil.maxWidth * 5, "".concat((0, formatter_ts_1.formatToTwoPlaces)(this.pencil.maxWidth), " mm"), svg_helper_ts_1.TextOrientation.BOTTOM, true);
        return (svgString);
    };
    SVGRenderer.prototype.renderFrontComponents = function (x, y, colourIndex) {
        var svgString = "";
        var colour = new OpaqueColour_ts_1.OpaqueColour(this.pencil.colourMap, "white%0");
        // we want to render them back to front so that the last component is on
        // the bottom
        this.pencil.components.reverse();
        // go through the components and render them
        for (var _i = 0, _a = this.pencil.components; _i < _a.length; _i++) {
            var component = _a[_i];
            svgString += "\n<!-- FRONT COMPONENT: ".concat(component.type, " -->\n");
            component.parts.reverse();
            for (var _b = 0, _c = component.parts; _b < _c.length; _b++) {
                var part = _c[_b];
                colour = part.getOpacityColour(colourIndex);
                switch (part.shape) {
                    case "cylinder":
                        svgString += (0, svg_helper_ts_1.circle)(x, y, (part.startHeight / 2) * 5, "0.5", "black", colour);
                        break;
                    case "cone":
                    case "convex":
                    case "concave":
                        svgString += (0, svg_helper_ts_1.drawOutlineCircle)((part.startHeight / 2) * 5, x, y, colour);
                        svgString += (0, svg_helper_ts_1.drawOutlineCircle)((part.endHeight / 2) * 5, x, y, colour);
                        break;
                    case "hexagonal":
                        svgString += (0, svg_helper_ts_1.drawOutlineHexagon)(x, y, part.startHeight, colour);
                        break;
                    case "octagonal":
                        svgString += (0, svg_helper_ts_1.drawOutlineOctagon)(x, y, part.startHeight, colour);
                        break;
                }
            }
            for (var _d = 0, _e = component.extras; _d < _e.length; _d++) {
                var extra = _e[_d];
                extra.extraParts.reverse();
                svgString += (0, svg_helper_ts_1.renderExtra)(x, y, extra.xOffset, extra.yOffset, extra.depth, extra.extraParts, extra.getBackgroundOpacityColour(colourIndex));
                extra.extraParts.reverse();
            }
            component.parts.reverse();
        }
        // now put it back in order
        this.pencil.components.reverse();
        for (var _f = 0, _g = this.pencil.front; _f < _g.length; _f++) {
            var front = _g[_f];
            // only care about the first dimension - which is the width
            var frontFillColour = front.getOpacityColour(colourIndex);
            // render the front piece
            switch (front.shape) {
                case "cylinder":
                    svgString += (0, svg_helper_ts_1.circle)(x, y, front.width / 2 * 5, "0.5", "dimgray", frontFillColour);
                    break;
            }
        }
        return (svgString);
    };
    SVGRenderer.prototype.renderSideDimensions = function (x, y) {
        var svgString = "";
        // let x: number = (this._width - this.pencil.totalLength * 5)/2;
        // let y: number = this._height/2;
        // render the component dimensions
        for (var _i = 0, _a = this.pencil.components; _i < _a.length; _i++) {
            var component = _a[_i];
            if (component.isHidden) {
                continue;
            }
            // draw all the dimensions
            svgString += (0, svg_helper_ts_1.dimensionsHorizontal)(x, y - 120, component.length * 5, "".concat((0, formatter_ts_1.formatToTwoPlaces)(component.length), " mm").concat((component.length * 5 > 30 ? "\n" : " ")).concat(component.type), svg_helper_ts_1.TextOrientation.TOP_ROTATED, true);
            // now for the extra dimensions
            // is the extra the first component, or the last
            // now for extraParts
            for (var _b = 0, _c = component.extras; _b < _c.length; _b++) {
                var extra = _c[_b];
                // draw the straight-through line for guidance
                svgString += (0, svg_helper_ts_1.dimensionsHorizontal)(x + extra.xOffset * 5, y - 80, extra.length * 5, "".concat((0, formatter_ts_1.formatToTwoPlaces)(extra.length), " mm\n").concat(component.type, " (extra)"), svg_helper_ts_1.TextOrientation.CENTER, true);
            }
            x += component.length * 5;
        }
        return (svgString);
    };
    SVGRenderer.prototype.renderBackDimensions = function (x, y) {
        var svgString = "";
        for (var _i = 0, _a = this.pencil.components; _i < _a.length; _i++) {
            var component = _a[_i];
            switch (component.type) {
                case "body":
                    svgString += (0, svg_helper_ts_1.dimensionsVertical)(x, y - component.maxHeight / 2 * 5, component.maxHeight * 5, "".concat(component.maxHeight, " mm"), svg_helper_ts_1.TextOrientation.LEFT_ROTATED, true);
                    svgString += (0, svg_helper_ts_1.dimensionsVertical)(x, y - component.maxHeight / 2 * 5, component.maxHeight * 5, "body", svg_helper_ts_1.TextOrientation.BOTTOM_ROTATED, true);
                    break;
                case "grip":
                    svgString += (0, svg_helper_ts_1.dimensionsVertical)(x - 40, y - component.maxHeight / 2 * 5, component.maxHeight * 5, "".concat(component.maxHeight, " mm"), svg_helper_ts_1.TextOrientation.LEFT_ROTATED, true);
                    svgString += (0, svg_helper_ts_1.dimensionsVertical)(x - 40, y - component.maxHeight / 2 * 5, component.maxHeight * 5, "grip", svg_helper_ts_1.TextOrientation.BOTTOM_ROTATED, true);
                    break;
            }
        }
        return (svgString);
    };
    SVGRenderer.prototype.renderBackComponents = function (x, y, colourIndex) {
        var svgString = "";
        var colour = new OpaqueColour_ts_1.OpaqueColour(this.pencil.colourMap, "white");
        // go through the components and render them
        for (var _i = 0, _a = this.pencil.components; _i < _a.length; _i++) {
            var component = _a[_i];
            colour = component.getOpacityColour(colourIndex);
            for (var _b = 0, _c = component.parts; _b < _c.length; _b++) {
                var part = _c[_b];
                switch (part.shape) {
                    case "cylinder":
                        svgString += (0, svg_helper_ts_1.circle)(x, y, (part.startHeight / 2) * 5, "0.5", "black", colour);
                        break;
                    case "cone":
                        svgString += (0, svg_helper_ts_1.drawOutlineCircle)((part.startHeight / 2) * 5, x, y, colour);
                        svgString += (0, svg_helper_ts_1.drawOutlineCircle)((part.endHeight / 2) * 5, x, y, colour);
                        break;
                    case "hexagonal":
                        svgString += (0, svg_helper_ts_1.drawOutlineHexagon)(x, y, part.startHeight, colour);
                        break;
                    case "octagonal":
                        svgString += (0, svg_helper_ts_1.drawOutlineOctagon)(x, y, part.startHeight, colour);
                        break;
                }
            }
            for (var _d = 0, _e = component.extras; _d < _e.length; _d++) {
                var extra = _e[_d];
                svgString += (0, svg_helper_ts_1.renderExtra)(x, y, extra.xOffset, extra.yOffset, extra.depth, extra.extraParts, extra.getBackgroundOpacityColour(colourIndex));
            }
        }
        for (var _f = 0, _g = this.pencil.back; _f < _g.length; _f++) {
            var back = _g[_f];
            var backFillColour = back.getOpacityColour(colourIndex);
            // render the back piece
            switch (back.shape) {
                case "cylinder":
                    svgString += (0, svg_helper_ts_1.circle)(x, y, back.width / 2 * 5, "1", "dimgray", backFillColour);
                    break;
            }
        }
        return (svgString);
    };
    SVGRenderer.prototype.renderSideMaterials = function () {
        var svgString = "";
        var xOffset = (this._width - this.pencil.totalLength * 5) / 2;
        for (var _i = 0, _a = this.pencil.components; _i < _a.length; _i++) {
            var component = _a[_i];
            if (component.isHidden) {
                continue;
            }
            // extra parts are always rendered first
            for (var _b = 0, _c = component.extras; _b < _c.length; _b++) {
                var extra = _c[_b];
                svgString += (0, svg_helper_ts_1.dimensionsHorizontal)(xOffset + extra.xOffset * 5, this._height / 2 + 80, extra.length * 5, "".concat(component.materials.join("\n")), svg_helper_ts_1.TextOrientation.BOTTOM, false);
            }
            // draw all the dimensions
            svgString += (0, svg_helper_ts_1.dimensionsHorizontal)(xOffset, this._height / 2 + 120, component.length * 5, "".concat((component.materials.join("\n"))), svg_helper_ts_1.TextOrientation.BOTTOM_ROTATED, false);
            xOffset += component.length * 5;
        }
        return (svgString);
    };
    /**
     * Render all side components
     *
     * @param x The x co-ordinate to start rendering the components
     * @param y The y co-ordinate to start rendering the components
     * @param colourIndex The colour index of the Pencil
     *
     * @protected
     */
    SVGRenderer.prototype.renderSideComponents = function (x, y, colourIndex) {
        var svgString = "";
        var xStart = x;
        for (var _i = 0, _a = this.pencil.components; _i < _a.length; _i++) {
            var component = _a[_i];
            svgString += this.renderSideComponent(x, y, component, colourIndex);
            x += component.length * 5;
        }
        // now for the tapering...
        for (var _b = 0, _c = this.pencil.components; _b < _c.length; _b++) {
            var component = _c[_b];
            var colourOpacity = component.getOpacityColour(colourIndex);
            for (var _d = 0, _e = component.parts; _d < _e.length; _d++) {
                var part = _e[_d];
                svgString += this.renderTaper(xStart, y, part, colourIndex);
                xStart += part.length * 5;
            }
        }
        return (svgString);
    };
    SVGRenderer.prototype.renderSideComponent = function (x, y, component, colourIndex) {
        var _a, _b;
        var svgString = "\n\n<!-- renderSideComponent: ".concat(component.type, " -->\n");
        var xStart = x;
        for (var _i = 0, _c = component.extras; _i < _c.length; _i++) {
            var extra = _c[_i];
            var backgroundColour = "black";
            if (component.getOpacityColour(colourIndex).colour === "black") {
                backgroundColour = "dimgray";
            }
            svgString += (0, svg_helper_ts_1.drawExtraBackground)(x + extra.xOffset * 5, y - extra.yOffset * 5, extra.extraParts, backgroundColour);
            break;
        }
        for (var _d = 0, _e = component.parts; _d < _e.length; _d++) {
            var part = _e[_d];
            svgString += this.renderPart(x, y, part, colourIndex);
            // finally the shape
            var taperStartOffset = (((_a = part.taperStart) === null || _a === void 0 ? void 0 : _a.xOffset) ? part.taperStart.xOffset : 0);
            var taperEndOffset = (((_b = part.taperEnd) === null || _b === void 0 ? void 0 : _b.xOffset) ? part.taperEnd.xOffset : 0);
            switch (part.shape) {
                case "hexagonal":
                    // svgString += drawShapeDetails(startX, midY, (part.length) * 5);
                    // startX - xOffsetTaperEnd * 5
                    svgString += (0, svg_helper_ts_1.drawShapeDetails)(x + (part.internalOffset + taperStartOffset) * 5, y, (part.length + taperEndOffset) * 5);
                    break;
                case "octagonal":
                    // svgString += drawShapeDetails(startX, midY - ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
                    // svgString += drawShapeDetails(startX, midY + ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
                    svgString += (0, svg_helper_ts_1.drawShapeDetails)(x + part.internalOffset * 5, y - ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
                    svgString += (0, svg_helper_ts_1.drawShapeDetails)(x + part.internalOffset * 5, y + ((part.startHeight / 2 * 5) * 4 / 7), (part.length) * 5);
                    break;
            }
            x += part.length * 5;
        }
        for (var _f = 0, _g = component.extras; _f < _g.length; _f++) {
            var extra = _g[_f];
            var colour = extra.getOpacityColour(colourIndex);
            svgString += (0, svg_helper_ts_1.drawExtraForeground)(xStart + extra.xOffset * 5, y - extra.yOffset * 5, extra.extraParts, colour.colour);
            break;
        }
        return (svgString);
    };
    SVGRenderer.prototype.renderHiddenSideComponents = function (x, y, colourIndex) {
        var svgString = "";
        var colourOpacity = new OpaqueColour_ts_1.OpaqueColour(this.pencil.colourMap, "white");
        for (var _i = 0, _a = this.pencil.components; _i < _a.length; _i++) {
            var component = _a[_i];
            if (component.isHidden) {
                colourOpacity = component.getOpacityColour(colourIndex);
                for (var _b = 0, _c = component.internalStart; _b < _c.length; _b++) {
                    var part = _c[_b];
                    svgString += this.renderPart(x, y, part, colourIndex);
                    x += part.length * 5;
                }
                for (var _d = 0, _e = component.internalEnd; _d < _e.length; _d++) {
                    var part = _e[_d];
                    svgString += this.renderPart(x, y, part, colourIndex);
                    x += part.length * 5;
                }
            }
        }
        // reset to draw the taper lines last
        x = this._width / 2 - (this.pencil.totalLength * 5 / 2);
        for (var _f = 0, _g = this.pencil.components; _f < _g.length; _f++) {
            var component = _g[_f];
            for (var _h = 0, _j = component.parts; _h < _j.length; _h++) {
                var part = _j[_h];
                svgString += this.renderTaper(x, y, part, colourIndex);
                x += part.length * 5;
            }
        }
        return (svgString);
    };
    SVGRenderer.prototype.renderTotalLengthDimensions = function () {
        return ((0, svg_helper_ts_1.dimensionsHorizontal)(this._width / 2 - this.pencil.totalLength * 5 / 2, this._height / 2 + 30 + this.pencil.maxHeight / 2 * 5, this.pencil.totalLength * 5, "".concat((0, formatter_ts_1.formatToTwoPlaces)(this.pencil.totalLength), " mm"), svg_helper_ts_1.TextOrientation.CENTER, true));
    };
    SVGRenderer.prototype.renderComponent = function (startX, midY, component, colourIndex) {
        var svgString = "";
        for (var _i = 0, _a = component.parts; _i < _a.length; _i++) {
            var part = _a[_i];
            svgString += this.renderPart(startX, midY, part, colourIndex);
            // now we need to draw the part shap
        }
        return (svgString);
    };
    /**
     * Render a specific part, <strong>WITHOUT</strong> any extras that are
     * attached to it, the order of rendering for a part is as follows:
     *
     *  - The background colour for the shape of the part
     *  - The outline of the part - if this part is joined then the left line is
     *    not drawn, if the next part is joined, then the right hand line is no
     *    joined
     *  - The details of the shape (i.e. whether it is hexagonal, octagonal etc.)
     *  - The finish for the part - in order of the comma separated list of
     *    finishes
     *
     * @param x The x co-ordinate at which to start the drawing of the part
     * @param y The y co-ordinate at which to start the drawing of trhe part
     * @param part The part to render
     * @param colourIndex The colour Index for the pencil colour
     * @param nextPartJoined Whether the next part is joined to this part
     *
     * @protected
     */
    SVGRenderer.prototype.renderPart = function (x, y, part, colourIndex, nextPartJoined) {
        if (nextPartJoined === void 0) { nextPartJoined = false; }
        var svgString = "\n\n<!-- renderPart: ".concat(part.shape, " -->\n");
        // get the stroke colour
        var strokeColour = "black";
        if (part.getOpacityColour(colourIndex).colour === "black") {
            strokeColour = "dimgray";
        }
        // maybe we have an over-ride colour and material
        var opaqueColour = part.getOpacityColour(colourIndex);
        // draw the background colour first
        switch (part.shape) {
            case "cylinder":
            case "hexagonal":
            case "octagonal":
            case "cone":
                svgString += "<path d=\"M".concat(x + part.internalOffset * 5, " ") +
                    "".concat(y - (part.startHeight / 2 * 5), " ") +
                    "L".concat(x + part.internalOffset * 5 + part.length * 5, " ").concat(y - (part.endHeight / 2 * 5), " ") +
                    "L".concat(x + part.internalOffset * 5 + part.length * 5, " ").concat(y + (part.endHeight / 2 * 5), " ") +
                    "L".concat(x + part.internalOffset * 5, " ").concat(y + (part.startHeight / 2 * 5), " Z\" ") +
                    "stroke-width=\"0.5\" " +
                    "stroke=\"".concat(strokeColour, "\" ") +
                    "stroke-linejoin=\"round\" " +
                    "fill=\"".concat(opaqueColour.colour, "\" ") +
                    "fill-opacity=\"".concat(opaqueColour.opacity, "\"/>\n");
                // TODO - move to later....
                if (part.joined) {
                    svgString += (0, svg_helper_ts_1.lineJoined)(x, y - (part.endHeight / 2 * 5) + 0.25, part.startHeight * 5 - 0.5, "3", opaqueColour);
                    // svgString += lineJoined(startX + part.internalOffset * 5,
                    // 	midY - (part.endHeight / 2 * 5) + 0.25,
                    // 	part.startHeight * 5 - 0.5, "3", opaqueColour.colour);
                }
                break;
            case "convex":
                var offsetX = part.length * 5;
                if (part.offset[0] !== 0) {
                    offsetX = part.offset[0] * 5;
                }
                var offsetY = part.startHeight / 2 * 5;
                if (part.offset[1] !== 0) {
                    offsetY = (part.startHeight / 2 - part.offset[1]) * 5;
                }
                svgString += "<path d=\"M".concat(x + part.internalOffset * 5, " ").concat(y - (part.startHeight / 2 * 5), " ") +
                    "Q".concat(x + part.internalOffset * 5 + offsetX, " ").concat(y - offsetY, " ") +
                    "".concat(x + part.internalOffset * 5, " ").concat(y + (part.startHeight / 2 * 5), "\" ") +
                    "stroke-width=\"0.5\" " +
                    "stroke=\"".concat(strokeColour, "\" ") +
                    "stroke-linejoin=\"round\" " +
                    "fill=\"".concat(opaqueColour.colour, "\" ") +
                    "fill-opacity=\"".concat(opaqueColour.opacity, "\"/>\n");
                break;
            case "concave":
                svgString += "<path d=\"M".concat(x + part.internalOffset * 5, " ").concat(y - (part.startHeight / 2 * 5), " ") +
                    "Q".concat(x + part.internalOffset * 5 + part.length * 5, " ").concat(y, " ") +
                    "".concat(x + part.internalOffset * 5, " ").concat(y + (part.startHeight / 2 * 5), "\" ") +
                    "stroke-width=\"0.5\" " +
                    "stroke=\"".concat(strokeColour, "\" ") +
                    "stroke-linejoin=\"round\" " +
                    "fill=\"".concat(opaqueColour.colour, "\" ") +
                    "fill-opacity=\"".concat(opaqueColour.opacity, "\"/>\n");
                break;
        }
        // now for the finish - although this only really works for cylinder types
        // the question becomes whether there will be other finishes on different
        // objects
        for (var _i = 0, _a = part.finish.split(","); _i < _a.length; _i++) {
            var finish = _a[_i];
            var xStart = x + (part.internalOffset) * 5;
            var xEnd = x + part.length * 5;
            var yStartTop = y - (part.startHeight / 2 * 5);
            var yStartBottom = y + (part.startHeight / 2 * 5);
            var yEndTop = y - (part.endHeight / 2 * 5);
            var yEndBottom = y + (part.endHeight / 2 * 5);
            // TODO - do specific lookup for the pattern
            if (this.patternMap.has(finish)) {
                svgString += "<path d=\"M".concat(xStart, " ").concat(yStartTop, " ") +
                    "L".concat(xEnd, " ").concat(yEndTop, " ") +
                    "L".concat(xEnd, " ").concat(yEndBottom, " ") +
                    "L".concat(xStart, " ").concat(yStartBottom, " Z\" stroke-width=\"1.0\" stroke=\"black\" fill=\"url(#").concat(finish, ")\"/>\n");
            }
            else if (SVGRenderer.defaultPatternMap.has(finish)) {
                svgString += "<path d=\"M".concat(xStart, " ").concat(yStartTop, " ") +
                    "L".concat(xEnd, " ").concat(yEndTop, " ") +
                    "L".concat(xEnd, " ").concat(yEndBottom, " ") +
                    "L".concat(xStart, " ").concat(yStartBottom, " Z\" stroke-width=\"1.0\" stroke=\"black\" fill=\"url(#").concat(finish, ")\"/>\n");
            }
            switch (finish) {
                case "ferrule":
                    var offset = ((part.length / 13) * 5) / 2;
                    for (var i = 0; i < 13; i++) {
                        if (i !== 0 && i !== 6 && i < 12) {
                            svgString += "<line x1=\"".concat(x + part.internalOffset * 5 + offset, "\" ") +
                                "y1=\"".concat(y + 1.0 - part.startHeight / 2 * 5, "\" ") +
                                "x2=\"".concat(x + part.internalOffset * 5 + offset, "\" ") +
                                "y2=\"".concat(y - 1.0 + part.startHeight / 2 * 5, "\" ") +
                                "stroke-width=\"1\" stroke=\"gray\" />\n";
                        }
                        offset += (part.length / 13) * 5;
                    }
                    svgString += (0, svg_helper_ts_1.drawOutlineCircle)(4, x + part.internalOffset * 5 + 15, y - part.startHeight / 4 * 5, new OpaqueColour_ts_1.OpaqueColour(null, "dimgray"));
                    break;
                case "spring":
                    svgString += "<rect x=\"".concat(x + part.internalOffset * 5 + 5, "\" ") +
                        "y=\"".concat(y - (part.endHeight / 2 * 5) - 5, "\" ") +
                        "width=\"".concat(part.length * 5 - 10, "\" ") +
                        "height=\"".concat(part.startHeight * 5 + 10, "\" ") +
                        "stroke-width=\"0.0\" stroke=\"black\" fill=\"url(#spring)\"/>\n";
                    for (var i = 0; i < 4; i++) {
                        svgString += "<line x1=\"".concat(x + part.internalOffset * 5 + i * 2 + 0.5, "\" y1=\"").concat(y - (part.endHeight / 2 * 5) - 5, "\" ") +
                            "x2=\"".concat(x + part.internalOffset * 5 + i * 2 + 0.5, "\" y2=\"").concat(y + (part.endHeight / 2 * 5) + 5, "\" stroke=\"dimgray\" stroke-linecap=\"round\" stroke-width=\"2\" />\n");
                        svgString += "<line x1=\"".concat(x + part.internalOffset * 5 + i * 2 + 0.5, "\" y1=\"").concat(y - (part.endHeight / 2 * 5) - 5, "\" ") +
                            "x2=\"".concat(x + part.internalOffset * 5 + i * 2 + 0.5, "\" y2=\"").concat(y + (part.endHeight / 2 * 5) + 5, "\" stroke=\"white\" stroke-linecap=\"round\" stroke-width=\"1\" />\n");
                        svgString += "<line x1=\"".concat(x + part.internalOffset * 5 + part.length * 5 - i * 2 - 0.5, "\" y1=\"").concat(y - (part.endHeight / 2 * 5) - 5, "\" ") +
                            "x2=\"".concat(x + part.internalOffset * 5 + part.length * 5 - i * 2 - 0.5, "\" y2=\"").concat(y + (part.endHeight / 2 * 5) + 5, "\" stroke=\"dimgray\" stroke-linecap=\"round\" stroke-width=\"2\" />\n");
                        svgString += "<line x1=\"".concat(x + part.internalOffset * 5 + part.length * 5 - i * 2 - 0.5, "\" y1=\"").concat(y - (part.endHeight / 2 * 5) - 5, "\" ") +
                            "x2=\"".concat(x + part.internalOffset * 5 + part.length * 5 - i * 2 - 0.5, "\" y2=\"").concat(y + (part.endHeight / 2 * 5) + 5, "\" stroke=\"white\" stroke-linecap=\"round\" stroke-width=\"1\" />\n");
                    }
                    break;
                case "threaded":
                    for (var i = 0; i < part.length; i++) {
                        if ((i + 1) > part.length) {
                            // TODO - half a line
                            break;
                        }
                        svgString += "<line x1=\"".concat(x + part.internalOffset * 5 + i * 5, "\" y1=\"").concat(y - (part.endHeight / 2 * 5) - 2, "\" ") +
                            "x2=\"".concat(x + part.internalOffset * 5 + (i + 1) * 5, "\" y2=\"").concat(y + (part.endHeight / 2 * 5) + 2, "\" stroke=\"dimgray\" stroke-linecap=\"round\" stroke-width=\"2\" />\n");
                        svgString += "<line x1=\"".concat(x + part.internalOffset * 5 + i * 5, "\" y1=\"").concat(y - (part.endHeight / 2 * 5) - 2, "\" ") +
                            "x2=\"".concat(x + part.internalOffset * 5 + (i + 1) * 5, "\" y2=\"").concat(y + (part.endHeight / 2 * 5) + 2, "\" stroke=\"").concat(opaqueColour, "\" stroke-linecap=\"round\" stroke-width=\"1\" />\n");
                    }
                    break;
                case "indicator":
                    // let backgoundColour: OpaqueColour = defaultOpaqueColour;
                    var backgoundColour = part.getBackgroundOpacityColour(colourIndex);
                    // now draw the indicator
                    svgString += "<rect x=\"".concat(x + part.internalOffset * 5 + 10, "\" ") +
                        "y=\"".concat(y - (part.endHeight / 4 * 5), "\" ") +
                        "width=\"".concat(part.length * 5 - 20, "\" ") +
                        "height=\"".concat(part.startHeight / 2 * 5, "\" ") +
                        "rx=\"3\" ry=\"3\" stroke-width=\"1\" stroke=\"black\" fill=\"".concat(backgoundColour.colour, "\"/>\n");
                    svgString += "<text x=\"".concat(x + part.internalOffset * 5 + (part.length * 5) / 2, "\" ") +
                        "y=\"".concat(y, "\" ") +
                        "text-anchor=\"middle\" dominant-baseline=\"central\">" +
                        "<tspan stroke=\"dimgray\" stroke-width=\"0.5\" font-family=\"sans-serif\" fill=\"black\" textLength=\"{this.width * 5 - 24}\" > " +
                        "HB" +
                        "</tspan>" +
                        "</text>";
                    break;
                case "indicator-split":
                    // now draw the indicator
                    // TODO - this should be at the top of the method
                    var backgroundColour = part.getBackgroundOpacityColour(colourIndex);
                    // horizontal
                    svgString += "<rect x=\"".concat(x + part.internalOffset * 5, "\" ") +
                        "y=\"".concat(y - 4, "\" ") +
                        "width=\"".concat(part.length * 5, "\" ") +
                        "height=\"".concat(8, "\" ") +
                        "rx=\"0\" ry=\"0\" stroke-width=\"1\" stroke=\"black\" fill=\"".concat(backgroundColour.colour, "\"/>\n");
                    svgString += "<rect x=\"".concat(x + part.internalOffset * 5 + 6, "\" ") +
                        "y=\"".concat(y - (part.endHeight / 4 * 5), "\" ") +
                        "width=\"".concat(part.length * 5 - 12, "\" ") +
                        "height=\"".concat(part.startHeight / 2 * 5, "\" ") +
                        "rx=\"3\" ry=\"3\" stroke-width=\"1\" stroke=\"black\" fill=\"".concat(backgroundColour.colour, "\"/>\n");
                    svgString += "<rect x=\"".concat(x + part.internalOffset * 5 + 0.25, "\" ") +
                        "y=\"".concat(y - 3.75, "\" ") +
                        "width=\"".concat(part.length * 5 - 0.5, "\" ") +
                        "height=\"".concat(7.5, "\" ") +
                        "rx=\"0\" ry=\"0\" stroke-width=\"1\" stroke=\"none\" fill=\"".concat(backgroundColour.colour, "\"/>\n");
                    svgString += "<text x=\"".concat(x + part.internalOffset * 5 + (part.length * 5) / 2, "\" ") +
                        "y=\"".concat(y, "\" ") +
                        "text-anchor=\"middle\" dominant-baseline=\"central\">" +
                        "<tspan stroke=\"dimgray\" stroke-width=\"0.5\" font-family=\"sans-serif\" fill=\"black\" textLength=\"{this.width * 5 - 14}\" > " +
                        "HB" +
                        "</tspan>" +
                        "</text>";
                    break;
                case "indicator-etched":
                    svgString += "<text x=\"".concat(x + part.internalOffset * 5 + (part.length * 5) / 2, "\" ") +
                        "y=\"".concat(y, "\" ") +
                        "text-anchor=\"middle\" dominant-baseline=\"central\">" +
                        "<tspan stroke=\"dimgray\" stroke-width=\"0.5\" font-family=\"sans-serif\" fill=\"black\" textLength=\"{this.width * 5 - 12}\" > " +
                        "HB" +
                        "</tspan>" +
                        "</text>";
                    break;
            }
        }
        return (svgString);
    };
    SVGRenderer.prototype.renderGuidelines = function () {
        var svgString = "";
        // now we are going to go through each of the components and draw the shapes
        var offset;
        // SIDE VIEW GUIDELINES FOR THE COMPONENTS
        // reset the offset to redraw
        offset = this._width / 2 - this.pencil.totalLength * 5 / 2;
        svgString += (0, svg_helper_ts_1.lineVerticalGuide)(offset, this._height / 2 - 88 - this.pencil.maxHeight / 2 * 5, 140 + this.pencil.maxHeight / 2 * 5);
        for (var _i = 0, _a = this.pencil.components; _i < _a.length; _i++) {
            var component = _a[_i];
            // vertical line
            svgString += (0, svg_helper_ts_1.lineVerticalGuide)(offset, this._height / 2 - 120, 120);
            offset += component.length * 5;
            // now for extraParts
            for (var _b = 0, _c = component.extras; _b < _c.length; _b++) {
                var extra = _c[_b];
                svgString += (0, svg_helper_ts_1.lineVerticalGuide)(offset + extra.xOffset * 5, this._height / 2 - 80, 80);
                svgString += (0, svg_helper_ts_1.lineVerticalGuide)(offset + extra.xOffset * 5 + extra.length * 5, this._height / 2 - 80, 80);
            }
        }
        svgString += (0, svg_helper_ts_1.lineVerticalGuide)(offset, this._height / 2 - 88 - this.pencil.maxHeight / 2 * 5, 140 + this.pencil.maxHeight / 2 * 5);
        return (svgString);
    };
    SVGRenderer.defaultPatternMap = new Map();
    SVGRenderer.allPatternMap = new Map();
    SVGRenderer.defaultPatternLoaded = false;
    return SVGRenderer;
}());
exports.SVGRenderer = SVGRenderer;
