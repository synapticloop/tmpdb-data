"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartDeserialiser = void 0;
var json_object_mapper_1 = require("json-object-mapper");
var Part_ts_1 = require("../Part.ts");
var PartDeserialiser = /** @class */ (function () {
    function PartDeserialiser() {
        this.deserialize = function (value) {
            return (json_object_mapper_1.ObjectMapper.deserializeArray(Part_ts_1.Part, value));
        };
    }
    return PartDeserialiser;
}());
exports.PartDeserialiser = PartDeserialiser;
