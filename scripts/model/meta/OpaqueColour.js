"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpaqueColour = void 0;
var json_object_mapper_1 = require("json-object-mapper");
require("reflect-metadata");
var OpaqueColour = function () {
    var _a;
    var _colour_decorators;
    var _colour_initializers = [];
    var _colour_extraInitializers = [];
    return _a = /** @class */ (function () {
            function OpaqueColour(colourMap, colour) {
                this.colour = __runInitializers(this, _colour_initializers, void 0); // the hex code of the colour (if found in the colour map), else the name
                this.colourName = __runInitializers(this, _colour_extraInitializers); // the name of the colour
                this.opacity = 1; // the opacity - from a value of 0 to 1
                if (colourMap === null) {
                    colourMap = new Map();
                }
                var splits = colour.split("%");
                this.colourName = splits[0];
                switch (splits.length) {
                    case 2:
                        if (colourMap.get(splits[0])) {
                            this.colour = colourMap.get(splits[0]);
                        }
                        else {
                            this.colour = splits[0];
                        }
                        var opacityTemp = parseInt(splits[1]);
                        if (opacityTemp > 1) {
                            this.opacity = opacityTemp / 100;
                        }
                        else {
                            this.opacity = opacityTemp;
                        }
                        break;
                    case 1:
                        if (colourMap.get(splits[0])) {
                            this.colour = colourMap.get(splits[0]);
                        }
                        else {
                            this.colour = splits[0];
                        }
                        break;
                    default:
                        this.colour = colour;
                }
                this.definition = this.colourName + "%" + this.opacity * 100;
            }
            return OpaqueColour;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _colour_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "colour", required: true })];
            __esDecorate(null, null, _colour_decorators, { kind: "field", name: "colour", static: false, private: false, access: { has: function (obj) { return "colour" in obj; }, get: function (obj) { return obj.colour; }, set: function (obj, value) { obj.colour = value; } }, metadata: _metadata }, _colour_initializers, _colour_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.OpaqueColour = OpaqueColour;
