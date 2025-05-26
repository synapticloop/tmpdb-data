"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtraDeserialiser = void 0;
var json_object_mapper_1 = require("json-object-mapper");
var Extra_ts_1 = require("../Extra.ts");
var ExtraDeserialiser = /** @class */ (function () {
    function ExtraDeserialiser() {
        this.deserialize = function (value) {
            return (json_object_mapper_1.ObjectMapper.deserializeArray(Extra_ts_1.Extra, value));
        };
    }
    return ExtraDeserialiser;
}());
exports.ExtraDeserialiser = ExtraDeserialiser;
