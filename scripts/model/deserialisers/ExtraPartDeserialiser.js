"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtraPartDeserialiser = void 0;
var json_object_mapper_1 = require("json-object-mapper");
var ExtraPart_ts_1 = require("../ExtraPart.ts");
var ExtraPartDeserialiser = /** @class */ (function () {
    function ExtraPartDeserialiser() {
        this.deserialize = function (value) {
            return (json_object_mapper_1.ObjectMapper.deserializeArray(ExtraPart_ts_1.ExtraPart, value));
        };
    }
    return ExtraPartDeserialiser;
}());
exports.ExtraPartDeserialiser = ExtraPartDeserialiser;
