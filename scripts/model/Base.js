"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
var OpaqueColour_ts_1 = require("./meta/OpaqueColour.ts");
var Base = /** @class */ (function () {
    function Base() {
        this.opacityColours = [];
        this.backgroundOpacityColours = [];
        this.mergedColours = [];
    }
    Base.prototype.mergeOpacityColours = function (colours, baseColours, colourMap) {
        var mergedColours;
        if (colours === undefined || colours.length === 0) {
            mergedColours = baseColours;
        }
        else {
            mergedColours = colours;
        }
        for (var _i = 0, mergedColours_1 = mergedColours; _i < mergedColours_1.length; _i++) {
            var mergedColour = mergedColours_1[_i];
            var opaqueColour = new OpaqueColour_ts_1.OpaqueColour(colourMap, mergedColour);
            this.opacityColours.push(opaqueColour);
            this.mergedColours.push(opaqueColour.definition);
        }
    };
    Base.prototype.mergeBackgroundOpacityColours = function (colours, baseColours, colourMap) {
        var mergedColours;
        if (colours === undefined || colours.length === 0) {
            mergedColours = baseColours;
        }
        else {
            mergedColours = colours;
        }
        for (var _i = 0, mergedColours_2 = mergedColours; _i < mergedColours_2.length; _i++) {
            var mergedColour = mergedColours_2[_i];
            this.backgroundOpacityColours.push(new OpaqueColour_ts_1.OpaqueColour(colourMap, mergedColour));
        }
    };
    Base.prototype.getOpacityColour = function (colourIndex) {
        if (colourIndex === -1) {
            return (Base.OPACITY_COLOUR_WHITE);
        }
        if (this.opacityColours.length === 1) {
            return (this.opacityColours[0]);
        }
        return (this.opacityColours[colourIndex]);
    };
    Base.prototype.getBackgroundOpacityColour = function (colourIndex) {
        if (null === this.backgroundOpacityColours || this.backgroundOpacityColours.length == 0) {
            return (this.getOpacityColour(colourIndex));
        }
        if (colourIndex === -1) {
            return (Base.OPACITY_COLOUR_WHITE);
        }
        if (this.backgroundOpacityColours.length === 1) {
            return (this.backgroundOpacityColours[0]);
        }
        return (this.backgroundOpacityColours[colourIndex]);
    };
    Base.OPACITY_COLOUR_WHITE = new OpaqueColour_ts_1.OpaqueColour(new Map(), "white");
    return Base;
}());
exports.Base = Base;
