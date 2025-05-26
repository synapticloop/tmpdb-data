"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapDeserialiser = void 0;
var MapDeserialiser = /** @class */ (function () {
    function MapDeserialiser() {
        this.deserialize = function (value) {
            var mapToReturn = new Map();
            if (value) {
                Object.keys(value).forEach(function (key) {
                    mapToReturn.set(key, value['' + key]);
                });
            }
            return mapToReturn;
        };
    }
    return MapDeserialiser;
}());
exports.MapDeserialiser = MapDeserialiser;
