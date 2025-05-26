"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToTwoPlaces = formatToTwoPlaces;
function formatToTwoPlaces(number) {
    return ((Math.round((number) * 100) / 100).toFixed(2));
}
