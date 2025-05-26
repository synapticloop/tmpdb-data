"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGExampleRenderer = void 0;
var SVGRenderer_ts_1 = require("../SVGRenderer.ts");
var svg_helper_ts_1 = require("../../../utils/svg-helper.ts");
/**
 * Render all the colour variants of a pencil
 */
var SVGExampleRenderer = /** @class */ (function (_super) {
    __extends(SVGExampleRenderer, _super);
    function SVGExampleRenderer(pencil) {
        var _this = _super.call(this, pencil, 1000, 600, "SVGExampleRenderer") || this;
        _this.SVG_WIDTH = 1000;
        _this.SVG_HEIGHT = 200;
        return _this;
    }
    /**
     * <p>Generate the SVG as a string with the colour</p>
     *
     * @param colourIndex the pencil colour index
     *
     * @returns {string} The SVG data as a String
     */
    SVGExampleRenderer.prototype.render = function (colourIndex) {
        // NOW GO THROUGH AND COUNT THE CLIPS
        _super.prototype.resize.call(this, 1000, 200 + this.pencil.components.length * 120);
        var svgString = _super.prototype.getSvgStart.call(this);
        svgString += _super.prototype.renderOverviewText.call(this, false);
        svgString += _super.prototype.renderCentreLineVertical.call(this, this._width / 2);
        // svgString += super.renderCentreLineVertical(400);
        var midY = 180;
        for (var _i = 0, _a = this.pencil.components; _i < _a.length; _i++) {
            var component = _a[_i];
            svgString += (0, svg_helper_ts_1.drawTextBoldCentred)(component.type, this._width / 2, midY - 60, "1.0em");
            // TODO - fix this and the component
            // svgString += super.renderComponent(this._width/2 + ((component.allLength + component.allOffset)/2 * 5), midY, component, colourIndex);
            svgString += _super.prototype.renderComponent.call(this, this._width / 2 - component.length / 2 * 5, midY, component, colourIndex);
            midY += 120;
        }
        svgString += _super.prototype.getSvgEnd.call(this);
        return (svgString);
    };
    return SVGExampleRenderer;
}(SVGRenderer_ts_1.SVGRenderer));
exports.SVGExampleRenderer = SVGExampleRenderer;
