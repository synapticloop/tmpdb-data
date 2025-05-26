"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaperDeserialiser = void 0;
var json_object_mapper_1 = require("json-object-mapper");
var Taper_ts_1 = require("../Taper.ts");
var TaperDeserialiser = /** @class */ (function () {
    function TaperDeserialiser() {
        this.deserialize = function (value) {
            return (json_object_mapper_1.ObjectMapper.deserializeArray(Taper_ts_1.Taper, value));
        };
    }
    return TaperDeserialiser;
}());
exports.TaperDeserialiser = TaperDeserialiser;
