"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextOrientation = void 0;
exports.drawTextBoldCentred = drawTextBoldCentred;
exports.drawTextBold = drawTextBold;
exports.drawText = drawText;
exports.drawOutlineHexagon = drawOutlineHexagon;
exports.drawOutlineOctagon = drawOutlineOctagon;
exports.drawOutlineCircle = drawOutlineCircle;
exports.drawShapeDetails = drawShapeDetails;
exports.drawExtra = drawExtra;
exports.drawExtraBackground = drawExtraBackground;
exports.drawExtraForeground = drawExtraForeground;
exports.renderExtra = renderExtra;
exports.lineHorizontalGuide = lineHorizontalGuide;
exports.lineHorizontal = lineHorizontal;
exports.lineVerticalGuide = lineVerticalGuide;
exports.circle = circle;
exports.lineVertical = lineVertical;
exports.lineJoined = lineJoined;
exports.target = target;
exports.dimensionsVertical = dimensionsVertical;
exports.dimensionsHorizontal = dimensionsHorizontal;
exports.rectangle = rectangle;
exports.arrowLeft = arrowLeft;
var OpaqueColour_ts_1 = require("../model/meta/OpaqueColour.ts");
// the height/width of the dimension marker
var DIMENSION_MARKER_LENGTH = 22;
function drawTextBoldCentred(text, x, y, fontSize) {
    return ("<text x=\"".concat(x, "\" ") +
        "y=\"".concat(y, "\" ") +
        "font-size=\"".concat(fontSize, "\" font-weight=\"bold\" text-anchor=\"middle\" ") +
        "dominant-baseline=\"central\">".concat(text, "</text>\n"));
}
function drawTextBold(text, x, y, fontSize) {
    return ("<text x=\"".concat(x, "\" ") +
        "y=\"".concat(y, "\" ") +
        "font-size=\"".concat(fontSize, "\" font-weight=\"bold\"> ") +
        "".concat(text, "</text>\n"));
}
function drawText(text, x, y, fontSize) {
    return ("<text x=\"".concat(x, "\" ") +
        "y=\"".concat(y, "\" ") +
        "font-size=\"".concat(fontSize, "\"> ") +
        "".concat(text, "</text>\n"));
}
function drawOutlineHexagon(x, y, height, fillColour) {
    var strokeColour = "black";
    if (fillColour.colour === "black") {
        strokeColour = "dimgray";
    }
    // do some mathematics for the hexagon
    var apothem = height / 2 * 5;
    // going around the points from top left - clockwise
    var radians = 30 * Math.PI / 180;
    var A = apothem * Math.tan(radians);
    // Hypotenuse
    var H = apothem / Math.cos(radians);
    return ("<polygon points=\"" +
        "".concat(x - A, ",").concat(y - height / 2 * 5, " ") + // A
        "".concat(x + A, ",").concat(y - height / 2 * 5, " ") + // B
        "".concat(x + H, ",").concat(y, " ") + // C
        "".concat(x + A, ",").concat(y + height / 2 * 5, " ") + // D
        "".concat(x - A, ",").concat(y + height / 2 * 5, " ") + // E
        "".concat(x - H, ",").concat(y, " ") + // F
        "\" stroke=\"".concat(strokeColour, "\" stroke-width=\"0.5\" fill=\"").concat(fillColour.colour, "\" fill-opacity=\"").concat(fillColour.opacity, "\"/>\n"));
}
function drawOutlineOctagon(x, y, height, fillColour) {
    var strokeColour = "black";
    if (fillColour.colour === "black") {
        strokeColour = "dimgray";
    }
    // do some mathematics for the octagon
    var apothem = height / 2 * 5;
    // going around the points from top left - clockwise
    var radians = 22.5 * Math.PI / 180;
    var A = apothem * Math.tan(radians);
    return ("<polygon points=\"" +
        "".concat(x - A, ",").concat(y - height / 2 * 5, " ") + // A
        "".concat(x + A, ",").concat(y - height / 2 * 5, " ") + // B
        "".concat(x + height / 2 * 5, ",").concat(y - A, " ") + // C
        "".concat(x + height / 2 * 5, ",").concat(y + A, " ") + // D
        "".concat(x + A, ",").concat(y + height / 2 * 5, " ") + // E
        "".concat(x - A, ",").concat(y + height / 2 * 5, " ") + // F
        "".concat(x - height / 2 * 5, ",").concat(y + A, " ") + // G
        "".concat(x - height / 2 * 5, ",").concat(y - A, " ") + // H
        "\" stroke=\"".concat(strokeColour, "\" stroke-width=\"1\" fill=\"").concat(fillColour.colour, "\" fill-opacity=\"").concat(fillColour.opacity, "\"/>\n"));
}
function drawOutlineCircle(radius, x, y, fillColour) {
    var strokeColour = "black";
    if (fillColour.colour === "black") {
        strokeColour = "dimgray";
    }
    return ("<circle r=\"".concat(radius, "\" ") +
        "cx=\"".concat(x, "\" ") +
        "cy=\"".concat(y, "\" ") +
        "stroke=\"".concat(strokeColour, "\" stroke-width=\"0.5\" fill=\"").concat(fillColour.colour, "\" fill-opacity=\"").concat(fillColour.opacity, "\"/>\n"));
}
function drawShapeDetails(x, y, width) {
    return ("<line x1=\"".concat(x, "\" ") +
        "y1=\"".concat(y, "\" ") +
        "x2=\"".concat(x + width, "\" ") +
        "y2=\"".concat(y, "\" ") +
        "stroke-width=\"1.5\" stroke=\"gray\" fill=\"gray\" stroke-opacity=\"1.0\"/>\n" +
        "<line x1=\"".concat(x, "\" ") +
        "y1=\"".concat(y, "\" ") +
        "x2=\"".concat(x + width, "\" ") +
        "y2=\"".concat(y, "\" ") +
        "stroke-width=\"0.5\" stroke=\"black\" fill=\"none\" stroke-opacity=\"0.5\"/>\n");
}
function drawExtra(offsetX, offsetY, parts, strokeColour) {
    var thisStrokeColour = "black";
    if (strokeColour === "black") {
        thisStrokeColour = "dimgray";
    }
    var svgString = "";
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        if (part["line"]) {
            var points = part["line"];
            svgString += "<line x1=\"".concat(offsetX + (points[0] * 5), "\" ") +
                "y1=\"".concat(offsetY + (points[1] * 5) + 1, "\" ") +
                "x2=\"".concat(offsetX + (points[2] * 5), "\" ") +
                "y2=\"".concat(offsetY + (points[3] * 5) + 1, "\" ") +
                "stroke-width=\"3\" stroke=\"".concat(thisStrokeColour, "\" fill=\"dimgray\" stroke-linecap=\"round\" />\n/>");
        }
        else if (part["curve"]) {
            var points = part["curve"];
            svgString += "<path d=\"M".concat(offsetX + (points[0] * 5), " ").concat(offsetY + (points[1] * 5) + 1, " ") +
                "Q".concat(offsetX + (points[4] * 5), " ").concat(offsetY + (points[5] * 5) + 1, " ") +
                "".concat(offsetX + (points[2] * 5), " ").concat(offsetY + (points[3] * 5) + 1, "\" ") +
                "stroke-width=\"3\" stroke=\"".concat(thisStrokeColour, "\" fill=\"none\" stroke-linecap=\"round\" />\n");
        }
        else if (part["curve-fill"]) {
            var points = part["curve-fill"];
            svgString += "<path d=\"M".concat(offsetX + (points[0] * 5), " ").concat(offsetY + (points[1] * 5), " ") +
                "Q".concat(offsetX + (points[4] * 5), " ").concat(offsetY + (points[5] * 5) + 1, " ") +
                "".concat(offsetX + (points[2] * 5), " ").concat(offsetY + (points[3] * 5), " Z\" ") +
                "stroke-width=\"3\" stroke=\"".concat(thisStrokeColour, "\" fill=\"dimgray\" stroke-linecap=\"round\" />\n");
        }
    }
    for (var _a = 0, parts_2 = parts; _a < parts_2.length; _a++) {
        var part = parts_2[_a];
        if (part["line"]) {
            var points = part["line"];
            svgString += "<line x1=\"".concat(offsetX + (points[0] * 5), "\" ") +
                "y1=\"".concat(offsetY + (points[1] * 5) + 1, "\" ") +
                "x2=\"".concat(offsetX + (points[2] * 5), "\" ") +
                "y2=\"".concat(offsetY + (points[3] * 5) + 1, "\" ") +
                "stroke-width=\"2\" stroke=\"".concat(strokeColour, "\" fill=\"").concat(strokeColour, "\" stroke-linecap=\"round\" />\n/>");
        }
        else if (part["curve"]) {
            var points = part["curve"];
            svgString += "<path d=\"M".concat(offsetX + (points[0] * 5), " ").concat(offsetY + (points[1] * 5) + 1, " ") +
                "Q".concat(offsetX + (points[4] * 5), " ").concat(offsetY + (points[5] * 5) + 1, " ") +
                "".concat(offsetX + (points[2] * 5), " ").concat(offsetY + (points[3] * 5) + 1, "\" ") +
                "stroke-width=\"2\" stroke=\"".concat(strokeColour, "\" fill=\"none\" stroke-linecap=\"round\" />\n");
        }
        else if (part["curve-fill"]) {
            var points = part["curve-fill"];
            svgString += "<path d=\"M".concat(offsetX + (points[0] * 5), " ").concat(offsetY + (points[1] * 5), " ") +
                "Q".concat(offsetX + (points[4] * 5), " ").concat(offsetY + (points[5] * 5), " ") +
                "".concat(offsetX + (points[2] * 5), " ").concat(offsetY + (points[3] * 5), " Z\" ") +
                "stroke-width=\"2\" stroke=\"".concat(strokeColour, "\" fill=\"").concat(strokeColour, "\" stroke-linecap=\"round\" />\n");
        }
    }
    return (svgString);
}
function drawExtraBackground(offsetX, offsetY, extraParts, strokeColour) {
    var svgString = "";
    for (var _i = 0, extraParts_1 = extraParts; _i < extraParts_1.length; _i++) {
        var extraPart = extraParts_1[_i];
        var points = extraPart.points;
        switch (extraPart.shape) {
            case "line":
                svgString += "<line x1=\"".concat(offsetX + (points[0] * 5), "\" ") +
                    "y1=\"".concat(offsetY + (points[1] * 5) + 1, "\" ") +
                    "x2=\"".concat(offsetX + (points[2] * 5), "\" ") +
                    "y2=\"".concat(offsetY + (points[3] * 5) + 1, "\" ") +
                    "stroke-width=\"".concat(extraPart.width + 1, "\" stroke=\"").concat(strokeColour, "\" fill=\"dimgray\" stroke-linecap=\"round\" />\n");
                break;
            case "curve":
                svgString += "<path d=\"M".concat(offsetX + (points[0] * 5), " ").concat(offsetY + (points[1] * 5) + 1, " ") +
                    "Q".concat(offsetX + (points[4] * 5), " ").concat(offsetY + (points[5] * 5) + 1, " ") +
                    "".concat(offsetX + (points[2] * 5), " ").concat(offsetY + (points[3] * 5) + 1, "\" ") +
                    "stroke-width=\"".concat(extraPart.width + 1, "\" stroke=\"").concat(strokeColour, "\" fill=\"none\" stroke-linecap=\"round\" />\n");
                break;
            case "curve-fill": {
                svgString += "<path d=\"M".concat(offsetX + (points[0] * 5), " ").concat(offsetY + (points[1] * 5), " ") +
                    "Q".concat(offsetX + (points[4] * 5), " ").concat(offsetY + (points[5] * 5) + 1, " ") +
                    "".concat(offsetX + (points[2] * 5), " ").concat(offsetY + (points[3] * 5), " Z\" ") +
                    "stroke-width=\"".concat(extraPart.width + 1, "\" stroke=\"").concat(strokeColour, "\" fill=\"dimgray\" stroke-linecap=\"round\" />\n");
            }
        }
    }
    return (svgString);
}
function drawExtraForeground(offsetX, offsetY, extraParts, fillColour) {
    var svgString = "";
    for (var _i = 0, extraParts_2 = extraParts; _i < extraParts_2.length; _i++) {
        var extraPart = extraParts_2[_i];
        var points = extraPart.points;
        switch (extraPart.shape) {
            case "line":
                svgString += "<line x1=\"".concat(offsetX + (points[0] * 5), "\" ") +
                    "y1=\"".concat(offsetY + (points[1] * 5) + 1, "\" ") +
                    "x2=\"".concat(offsetX + (points[2] * 5), "\" ") +
                    "y2=\"".concat(offsetY + (points[3] * 5) + 1, "\" ") +
                    "stroke-width=\"".concat(extraPart.width, "\" stroke=\"").concat(fillColour, "\" fill=\"").concat(fillColour, "\" stroke-linecap=\"round\" />\n");
                break;
            case "curve":
                svgString += "<path d=\"M".concat(offsetX + (points[0] * 5), " ").concat(offsetY + (points[1] * 5) + 1, " ") +
                    "Q".concat(offsetX + (points[4] * 5), " ").concat(offsetY + (points[5] * 5) + 1, " ") +
                    "".concat(offsetX + (points[2] * 5), " ").concat(offsetY + (points[3] * 5) + 1, "\" ") +
                    "stroke-width=\"".concat(extraPart.width, "\" stroke=\"").concat(fillColour, "\" fill=\"none\" stroke-linecap=\"round\" />\n");
                break;
            case "curve-fill":
                svgString += "<path d=\"M".concat(offsetX + (points[0] * 5), " ").concat(offsetY + (points[1] * 5), " ") +
                    "Q".concat(offsetX + (points[4] * 5), " ").concat(offsetY + (points[5] * 5), " ") +
                    "".concat(offsetX + (points[2] * 5), " ").concat(offsetY + (points[3] * 5), " Z\" ") +
                    "stroke-width=\"".concat(extraPart.width, "\" stroke=\"").concat(fillColour, "\" fill=\"").concat(fillColour, "\" stroke-linecap=\"round\" />\n");
                break;
        }
    }
    return (svgString);
}
function renderExtra(x, y, offsetX, offsetY, width, parts, fillColour) {
    var svgString = "";
    var points = [];
    var isCurve = false;
    for (var _i = 0, parts_3 = parts; _i < parts_3.length; _i++) {
        var part = parts_3[_i];
        points = part.points;
        // switch(part.shape) {
        // 	case "curve":
        // 	case "curve-fill":
        // 		isCurve = true;
        // 		break;
        // }
        // don't care what it is, always top to bottom
        var maxY = Math.max(points[1], points[3]);
        var minY = Math.min(points[1], points[3]);
        var height = Math.abs(maxY - minY);
        if (height === 0) {
            height = 3 / 5;
        }
        svgString += "<!-- WxH ".concat(width, " ").concat(height, " -->");
        svgString += "<rect x=\"".concat(x - width / 2 * 5, "\" ") +
            "y=\"".concat(y - Math.abs(offsetY) * 5 - (height * 5), "\" ") +
            "width=\"".concat(width * 5, "\" ") +
            "height=\"".concat(height * 5, "\" ") +
            "rx=\"0\" ry=\"0\" stroke-width=\"1.0\" stroke=\"dimgray\" fill=\"".concat(fillColour.colour, "\"/>\n");
        // if(isCurve) {
        // 	let from:number = y - Math.abs(offsetY) * 5 - (height * 5);
        // 	let to:number = from + (height * 5);
        // 	svgString += `<line x1="${x - width/2*5}" x2="${x + width/2*5}" y1="${from}" y2="${from+3}" stroke-width="0.5" stroke="#cfcfcf" />\n`;
        //
        // 	for (let i: number = from + 3; i < to; i = i + 3) {
        // 		svgString += `<line x1="${x - width/2*5}" x2="${x + width/2*5}" y1="${i}" y2="${i}" stroke-width="0.5" stroke="#cfcfcf" />\n`;
        // 		svgString += `<line x1="${x - width/2*5}" x2="${x + width/2*5}" y1="${i}" y2="${i + 3}" stroke-width="0.5" stroke="#cfcfcf" />\n`;
        // 	}
        // }
        svgString += "<rect x=\"".concat(x - width / 2 * 5, "\" ") +
            "y=\"".concat(y - Math.abs(offsetY) * 5 - (height * 5), "\" ") +
            "width=\"".concat(width * 5, "\" ") +
            "height=\"".concat(height * 5, "\" ") +
            "rx=\"0\" ry=\"0\" stroke-width=\"1.0\" stroke=\"dimgray\" fill=\"none\"/>\n";
    }
    return (svgString);
}
function lineHorizontalGuide(x, y, width) {
    return (lineHorizontal(x, y, width, "1", "#cfcfcf"));
}
function lineHorizontal(x, y, width, strokeWidth, strokeColour, strokeDash) {
    if (strokeDash === void 0) { strokeDash = null; }
    var svgString = "<line x1=\"".concat(x, "\" ") +
        "y1=\"".concat(y, "\" ") +
        "x2=\"".concat(x + width, "\" ") +
        "y2=\"".concat(y, "\" ") +
        "stroke-linecap=\"round\" " +
        "stroke=\"".concat(strokeColour, "\" ") +
        "".concat((null !== strokeDash ? "stroke-dasharray=\"".concat(strokeDash, "\" ") : " ")) +
        "stroke-width=\"".concat(strokeWidth, "\" />\n");
    return (svgString);
}
function lineVerticalGuide(x, y, height, strokeWidth) {
    if (strokeWidth === void 0) { strokeWidth = "1"; }
    return (lineVertical(x, y, height, strokeWidth, "#cfcfcf"));
}
function circle(x, y, radius, strokeWidth, strokeColour, fillColour) {
    if (fillColour === void 0) { fillColour = new OpaqueColour_ts_1.OpaqueColour(null, "white%0"); }
    return ("<circle r=\"".concat(radius, "\" ") +
        "cx=\"".concat(x, "\" ") +
        "cy=\"".concat(y, "\" ") +
        "fill=\"".concat(fillColour.colour, "\" ") +
        "fill-opacity=\"".concat(fillColour.opacity, "\" ") +
        "stroke=\"".concat(strokeColour, "\" ") +
        "stroke-width=\"".concat(strokeWidth, "\"  />\n"));
}
function lineVertical(x, y, height, strokeWidth, strokeColour, strokeDashArray) {
    if (strokeDashArray === void 0) { strokeDashArray = null; }
    var svgString = "";
    svgString += "<line x1=\"".concat(x, "\" ") +
        "y1=\"".concat(y, "\" ") +
        "x2=\"".concat(x, "\" ") +
        "y2=\"".concat(y + height, "\" ") +
        "stroke=\"".concat(strokeColour, "\" ") +
        "stroke-linecap=\"round\" " +
        "".concat((null !== strokeDashArray ? "stroke-dasharray=\"".concat(strokeDashArray, "\" ") : " ")) +
        "stroke-width=\"".concat(strokeWidth, "\" />\n");
    return (svgString);
}
function lineJoined(x, y, height, strokeWidth, strokeColour) {
    var svgString = "";
    svgString += "<line x1=\"".concat(x, "\" ") +
        "y1=\"".concat(y, "\" ") +
        "x2=\"".concat(x, "\" ") +
        "y2=\"".concat(y + height, "\" ") +
        "stroke=\"".concat(strokeColour.colour, "\" ") +
        "stroke-opacity=\"".concat(strokeColour.opacity, "\" ") +
        "stroke-width=\"".concat(strokeWidth, "\" />\n");
    return (svgString);
}
function target(x, y, length, radius) {
    var svgString = "";
    svgString += lineHorizontal(x - length / 2, y, length, "1", "#000000");
    svgString += lineVertical(x, y - length / 2, length, "1", "#000000");
    svgString += circle(x, y, radius, "1", "#000000");
    return (svgString);
}
var TextOrientation;
(function (TextOrientation) {
    TextOrientation[TextOrientation["CENTER"] = 0] = "CENTER";
    TextOrientation[TextOrientation["TOP"] = 1] = "TOP";
    TextOrientation[TextOrientation["TOP_ROTATED"] = 2] = "TOP_ROTATED";
    TextOrientation[TextOrientation["RIGHT"] = 3] = "RIGHT";
    TextOrientation[TextOrientation["RIGHT_ROTATED"] = 4] = "RIGHT_ROTATED";
    TextOrientation[TextOrientation["BOTTOM"] = 5] = "BOTTOM";
    TextOrientation[TextOrientation["BOTTOM_ROTATED"] = 6] = "BOTTOM_ROTATED";
    TextOrientation[TextOrientation["LEFT"] = 7] = "LEFT";
    TextOrientation[TextOrientation["LEFT_ROTATED"] = 8] = "LEFT_ROTATED";
})(TextOrientation || (exports.TextOrientation = TextOrientation = {}));
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
function dimensionsVertical(x, y, height, text, textOrientation, shouldBold) {
    if (text === void 0) { text = null; }
    if (textOrientation === void 0) { textOrientation = TextOrientation.TOP; }
    if (shouldBold === void 0) { shouldBold = true; }
    var svgString = "";
    // first we are going to draw the top horizonal line
    svgString += "<line x1=\"".concat(x - DIMENSION_MARKER_LENGTH / 2, "\" ") +
        "y1=\"".concat(y, "\" ") +
        "x2=\"".concat(x + DIMENSION_MARKER_LENGTH / 2, "\" ") +
        "y2=\"".concat(y, "\" ") +
        "stroke=\"black\" stroke-width=\"1\" />\n";
    // now for the vertical line
    svgString += "<line x1=\"".concat(x, "\" ") +
        "y1=\"".concat(y, "\" ") +
        "x2=\"".concat(x, "\" ") +
        "y2=\"".concat(y + height, "\" ") +
        "stroke=\"black\" stroke-width=\"1\" />\n";
    // the bottom horizontal line
    svgString += "<line x1=\"".concat(x - DIMENSION_MARKER_LENGTH / 2, "\" ") +
        "y1=\"".concat(y + height, "\" ") +
        "x2=\"".concat(x + DIMENSION_MARKER_LENGTH / 2, "\" ") +
        "y2=\"".concat(y + height, "\" ") +
        "stroke=\"black\" stroke-width=\"1\" />\n";
    // lastly the text
    if (text) {
        switch (textOrientation) {
            case TextOrientation.TOP:
                svgString += "<text " +
                    "x=\"".concat(x, "\" ") +
                    "y=\"".concat(y - 8, "\" ") +
                    "".concat((shouldBold ? "font-weight=\"bold\"" : ""), " ") +
                    "font-size=\"1.2em\" " +
                    "text-anchor=\"middle\" " +
                    "dominant-baseline=\"auto\" " +
                    "fill=\"black\">" +
                    "".concat(text) +
                    "</text>\n";
                break;
            case TextOrientation.TOP_ROTATED:
                svgString += "<text " +
                    "x=\"".concat(x, "\" ") +
                    "y=\"".concat(y - 8, "\" ") +
                    "transform=\"rotate(-90, ".concat(x, ", ").concat(y - 8, ")\" ") +
                    "".concat((shouldBold ? "font-weight=\"bold\"" : ""), " ") +
                    "font-size=\"1.2em\" " +
                    "text-anchor=\"start\" " +
                    "dominant-baseline=\"middle\" " +
                    "fill=\"black\">" +
                    "".concat(text) +
                    "</text>\n";
                break;
            case TextOrientation.RIGHT:
                svgString += "<text " +
                    "x=\"".concat(x + 2 + DIMENSION_MARKER_LENGTH / 2, "\" ") +
                    "y=\"".concat(y + height / 2, "\" ") +
                    "font-size=\"1.2em\" " +
                    "".concat((shouldBold ? "font-weight=\"bold\"" : ""), " ") +
                    "text-anchor=\"start\" " +
                    "dominant-baseline=\"central\" fill=\"black\">" +
                    "".concat(text) +
                    "</text>\n";
                break;
            case TextOrientation.RIGHT_ROTATED:
                break;
            case TextOrientation.BOTTOM:
                svgString += "<text " +
                    "x=\"".concat(x, "\" ") +
                    "y=\"".concat(y + height + 8, "\" ") +
                    "".concat((shouldBold ? "font-weight=\"bold\"" : ""), " ") +
                    "font-size=\"1.2em\" " +
                    "text-anchor=\"end\" " +
                    "dominant-baseline=\"middle\" " +
                    "fill=\"black\">" +
                    "".concat(text) +
                    "</text>\n";
                break;
            case TextOrientation.BOTTOM_ROTATED:
                svgString += "<text " +
                    "x=\"".concat(x, "\" ") +
                    "y=\"".concat(y + height + 8, "\" ") +
                    "transform=\"rotate(-90, ".concat(x, ", ").concat(y + height + 8, ")\" ") +
                    "".concat((shouldBold ? "font-weight=\"bold\"" : ""), " ") +
                    "font-size=\"1.2em\" " +
                    "text-anchor=\"end\" " +
                    "dominant-baseline=\"middle\" " +
                    "fill=\"black\">" +
                    "".concat(text) +
                    "</text>\n";
                break;
            case TextOrientation.LEFT:
                svgString += "<text " +
                    "x=\"".concat(x - 8 - DIMENSION_MARKER_LENGTH / 2, "\" ") +
                    "y=\"".concat(y + height / 2, "\" ") +
                    "font-size=\"1.2em\" " +
                    "".concat((shouldBold ? "font-weight=\"bold\"" : ""), " ") +
                    "text-anchor=\"end\" " +
                    "dominant-baseline=\"central\" fill=\"black\">" +
                    "".concat(text) +
                    "</text>\n";
                break;
            case TextOrientation.LEFT_ROTATED:
                svgString += "<text " +
                    "x=\"".concat(x - 8 - DIMENSION_MARKER_LENGTH / 2, "\" ") +
                    "y=\"".concat(y + height / 2, "\" ") +
                    "transform=\"rotate(-90, ".concat(x - 8 - DIMENSION_MARKER_LENGTH / 2, ", ").concat(y + height / 2, ")\" ") +
                    "font-size=\"1.2em\" " +
                    "".concat((shouldBold ? "font-weight=\"bold\"" : ""), " ") +
                    "text-anchor=\"middle\" " +
                    "dominant-baseline=\"central\" fill=\"black\">" +
                    "".concat(text) +
                    "</text>\n";
                break;
        }
    }
    return (svgString);
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
function dimensionsHorizontal(x, y, width, text, textOrientation, shouldBold) {
    if (text === void 0) { text = null; }
    if (textOrientation === void 0) { textOrientation = TextOrientation.TOP; }
    if (shouldBold === void 0) { shouldBold = true; }
    var svgString = "";
    // first we are going to draw the left vertical line
    svgString += "<line x1=\"".concat(x, "\" ") +
        "y1=\"".concat(y - DIMENSION_MARKER_LENGTH / 2, "\" ") +
        "x2=\"".concat(x, "\" ") +
        "y2=\"".concat(y + DIMENSION_MARKER_LENGTH / 2, "\" ") +
        "stroke=\"black\" stroke-width=\"1\" />\n";
    // now for the horizonal line
    svgString += "<line x1=\"".concat(x, "\" ") +
        "y1=\"".concat(y, "\" ") +
        "x2=\"".concat(x + width, "\" ") +
        "y2=\"".concat(y, "\" ") +
        "stroke=\"black\" stroke-width=\"1\" />\n";
    // the right vertical line
    svgString += "<line x1=\"".concat(x + width, "\" ") +
        "y1=\"".concat(y - DIMENSION_MARKER_LENGTH / 2, "\" ") +
        "x2=\"".concat(x + width, "\" ") +
        "y2=\"".concat(y + DIMENSION_MARKER_LENGTH / 2, "\" ") +
        "stroke=\"black\" stroke-width=\"1\" />\n";
    // lastly the text
    if (text) {
        var linedText = "";
        var strings = text.split("\n");
        for (var _i = 0, _a = strings.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], index = _b[0], string = _b[1];
            linedText += "<tspan x=\"".concat(x + width / 2 - ((strings.length - 1) * 8), "\" dy=\"").concat(index === 0 ? "0" : "1em", "\">").concat(string, "</tspan>");
        }
        switch (textOrientation) {
            case TextOrientation.CENTER:
                svgString += "<text " +
                    "x=\"".concat(x + width / 2, "\" ") +
                    "y=\"".concat(y - ((strings.length - 1) * 8), "\" ") +
                    "".concat((shouldBold ? "font-weight=\"bold\"" : ""), " ") +
                    "font-size=\"1.2em\" " +
                    "stroke=\"white\" " +
                    "stroke-width=\"0.25\" " +
                    "text-anchor=\"middle\" " +
                    "dominant-baseline=\"middle\" " +
                    "fill=\"black\">" +
                    "".concat(linedText) +
                    "</text>\n";
                break;
            case TextOrientation.TOP:
                svgString += "<text " +
                    "x=\"".concat(x + width / 2, "\" ") +
                    "y=\"".concat(y - 8 - DIMENSION_MARKER_LENGTH / 2, "\" ") +
                    "font-size=\"1.2em\" " +
                    "".concat((shouldBold ? "font-weight=\"bold\"" : ""), " ") +
                    "text-anchor=\"middle\" " +
                    "dominant-baseline=\"central\" fill=\"black\">" +
                    "".concat(linedText) +
                    "</text>\n";
                break;
            case TextOrientation.BOTTOM:
                svgString += "<text " +
                    "x=\"".concat(x + width / 2, "\" ") +
                    "y=\"".concat(y + 8 + DIMENSION_MARKER_LENGTH / 2, "\" ") +
                    "font-size=\"1.2em\" " +
                    "".concat((shouldBold ? "font-weight=\"bold\"" : ""), " ") +
                    "text-anchor=\"middle\" " +
                    "dominant-baseline=\"central\" fill=\"black\">" +
                    "".concat(linedText) +
                    "</text>\n";
                break;
            case TextOrientation.BOTTOM_ROTATED:
                svgString += "<text " +
                    "x=\"".concat(x + width / 2, "\" ") +
                    "y=\"".concat(y + 8 + DIMENSION_MARKER_LENGTH / 2, "\" ") +
                    "font-size=\"1.2em\" " +
                    "transform=\"rotate(-90, ".concat(x + width / 2 - ((strings.length - 1) * 12), ", ").concat(y + 8 + DIMENSION_MARKER_LENGTH / 2, ")\" ") +
                    "".concat((shouldBold ? "font-weight=\"bold\"" : ""), " ") +
                    "text-anchor=\"end\" " +
                    "dominant-baseline=\"middle\" fill=\"black\">" +
                    "".concat(linedText) +
                    "</text>\n";
                break;
            case TextOrientation.TOP_ROTATED:
                svgString += "<text " +
                    "x=\"".concat(x + width / 2, "\" ") +
                    "y=\"".concat(y - 8 - DIMENSION_MARKER_LENGTH / 2, "\" ") +
                    "font-size=\"1.2em\" " +
                    "transform=\"rotate(-90, ".concat(x + width / 2 - ((strings.length - 1) * 12), ", ").concat(y - 8 - DIMENSION_MARKER_LENGTH / 2, ")\" ") +
                    "".concat((shouldBold ? "font-weight=\"bold\"" : ""), " ") +
                    "text-anchor=\"start\" " +
                    "dominant-baseline=\"central\" fill=\"black\">" +
                    "".concat(linedText) +
                    "</text>\n";
                break;
        }
    }
    return (svgString);
}
function rectangle(x, y, width, height, strokeColour, fillColour) {
    var svgString = "";
    svgString += "<rect x=\"".concat(x, "\" ") +
        "y=\"".concat(y, "\" ") +
        "width=\"".concat(width, "\" ") +
        "height=\"".concat(height, "\" ") +
        "rx=\"0\" ry=\"0\" stroke-width=\"0.5\" stroke=\"".concat(strokeColour, "\" fill=\"").concat(fillColour.colour, "\" fill-opacity=\"").concat(fillColour.opacity, "\"/>\n");
    return (svgString);
}
function arrowLeft(x, y) {
    var svgString = "";
    var xOffset = 14;
    var yOffset = 8;
    var xInset = 7;
    svgString += "\n\n<!-- ARROW START -->\n";
    svgString += "<line x1=\"".concat(x, "\" ") +
        "y1=\"".concat(y, "\" ") +
        "x2=\"".concat(x + xInset, "\" ") +
        "y2=\"".concat(y, "\" ") +
        "stroke-linecap=\"round\" " +
        "stroke=\"#ffffff\" " +
        "stroke-width=\"2.0\" />\n";
    svgString += "<line x1=\"".concat(x, "\" ") +
        "y1=\"".concat(y, "\" ") +
        "x2=\"".concat(x + xOffset, "\" ") +
        "y2=\"".concat(y - yOffset, "\" ") +
        "stroke-linecap=\"round\" " +
        "stroke=\"#ffffff\" " +
        "stroke-width=\"2.0\" />\n";
    svgString += "<line x1=\"".concat(x + xOffset, "\" ") +
        "y1=\"".concat(y - yOffset, "\" ") +
        "x2=\"".concat(x + xInset, "\" ") +
        "y2=\"".concat(y, "\" ") +
        "stroke-linecap=\"round\" " +
        "stroke=\"#ffffff\" " +
        "stroke-width=\"2.0\" />\n";
    svgString += "<line x1=\"".concat(x, "\" ") +
        "y1=\"".concat(y, "\" ") +
        "x2=\"".concat(x + xOffset, "\" ") +
        "y2=\"".concat(y + yOffset, "\" ") +
        "stroke-linecap=\"round\" " +
        "stroke=\"#ffffff\" " +
        "stroke-width=\"2.0\" />\n";
    svgString += "<line x1=\"".concat(x + xOffset, "\" ") +
        "y1=\"".concat(y + yOffset, "\" ") +
        "x2=\"".concat(x + xInset, "\" ") +
        "y2=\"".concat(y, "\" ") +
        "stroke-linecap=\"round\" " +
        "stroke=\"#ffffff\" " +
        "stroke-width=\"2.0\" />\n";
    svgString += "<line x1=\"".concat(x, "\" ") +
        "y1=\"".concat(y, "\" ") +
        "x2=\"".concat(x + xOffset, "\" ") +
        "y2=\"".concat(y - yOffset, "\" ") +
        "stroke-linecap=\"round\" " +
        "stroke=\"#0f0f0f\" " +
        "stroke-width=\"1.0\" />\n";
    svgString += "<line x1=\"".concat(x + xOffset, "\" ") +
        "y1=\"".concat(y - yOffset, "\" ") +
        "x2=\"".concat(x + xInset, "\" ") +
        "y2=\"".concat(y, "\" ") +
        "stroke-linecap=\"round\" " +
        "stroke=\"#0f0f0f\" " +
        "stroke-width=\"1.0\" />\n";
    svgString += "<line x1=\"".concat(x, "\" ") +
        "y1=\"".concat(y, "\" ") +
        "x2=\"".concat(x + xOffset, "\" ") +
        "y2=\"".concat(y + yOffset, "\" ") +
        "stroke-linecap=\"round\" " +
        "stroke=\"#0f0f0f\" " +
        "stroke-width=\"1.0\" />\n";
    svgString += "<line x1=\"".concat(x + xOffset, "\" ") +
        "y1=\"".concat(y + yOffset, "\" ") +
        "x2=\"".concat(x + xInset, "\" ") +
        "y2=\"".concat(y, "\" ") +
        "stroke-linecap=\"round\" " +
        "stroke=\"#0f0f0f\" " +
        "stroke-width=\"1.0\" />\n";
    // TODO - mini arrows
    // svgString += `<line x1="${x + xOffset + 5}" ` +
    // 		`y1="${y + yOffset - 4}" ` +
    // 		`x2="${x + xInset + 5}" ` +
    // 		`y2="${y}" ` +
    // 		`stroke-linecap="round" ` +
    // 		`stroke="#0f0f0f" ` +
    // 		`stroke-width="1.0" />\n`;
    return (svgString);
}
