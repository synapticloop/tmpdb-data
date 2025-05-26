"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureDeserialiser = void 0;
var json_object_mapper_1 = require("json-object-mapper");
var Feature_ts_1 = require("../Feature.ts");
var FeatureDeserialiser = /** @class */ (function () {
    function FeatureDeserialiser() {
        this.deserialize = function (value) {
            return (json_object_mapper_1.ObjectMapper.deserializeArray(Feature_ts_1.Feature, value));
        };
    }
    return FeatureDeserialiser;
}());
exports.FeatureDeserialiser = FeatureDeserialiser;
