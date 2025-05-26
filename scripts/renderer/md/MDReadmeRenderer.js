"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDReadmeRenderer = void 0;
var MDReadmeRenderer = /** @class */ (function () {
    function MDReadmeRenderer(pencils) {
        this.pencils = pencils;
    }
    MDReadmeRenderer.prototype.render = function () {
        var mdString = "";
        mdString += "| Brand | Name | Model # | # Colours |\n";
        mdString += "| ---: | :--- | :--- | :--- |\n";
        for (var _i = 0, _a = this.pencils; _i < _a.length; _i++) {
            var pencil = _a[_i];
            mdString += "| **".concat(pencil.brand, "** | **").concat(pencil.modelName, "** | ").concat(pencil.modelNumber, " | ").concat(pencil.colourComponents.length, " |\n");
        }
        return (mdString);
    };
    return MDReadmeRenderer;
}());
exports.MDReadmeRenderer = MDReadmeRenderer;
