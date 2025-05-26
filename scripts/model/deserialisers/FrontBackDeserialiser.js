"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrontBackDeserialiser = void 0;
var json_object_mapper_1 = require("json-object-mapper");
var FrontBack_ts_1 = require("../FrontBack.ts");
var FrontBackDeserialiser = /** @class */ (function () {
    function FrontBackDeserialiser() {
        this.deserialize = function (value) {
            return (json_object_mapper_1.ObjectMapper.deserializeArray(FrontBack_ts_1.FrontBack, value));
        };
    }
    return FrontBackDeserialiser;
}());
exports.FrontBackDeserialiser = FrontBackDeserialiser;
