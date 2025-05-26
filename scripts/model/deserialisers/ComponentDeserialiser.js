"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentDeserialiser = void 0;
var json_object_mapper_1 = require("json-object-mapper");
var Component_ts_1 = require("../Component.ts");
var ComponentDeserialiser = /** @class */ (function () {
    function ComponentDeserialiser() {
        this.deserialize = function (value) {
            return (json_object_mapper_1.ObjectMapper.deserializeArray(Component_ts_1.Component, value));
        };
    }
    return ComponentDeserialiser;
}());
exports.ComponentDeserialiser = ComponentDeserialiser;
