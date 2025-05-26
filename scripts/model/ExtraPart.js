"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ExtraPart = void 0;
var json_object_mapper_1 = require("json-object-mapper");
require("reflect-metadata");
var Base_ts_1 = require("./Base.ts");
var ExtraPart = function () {
    var _a;
    var _classSuper = Base_ts_1.Base;
    var _colours_decorators;
    var _colours_initializers = [];
    var _colours_extraInitializers = [];
    var _shape_decorators;
    var _shape_initializers = [];
    var _shape_extraInitializers = [];
    var _points_decorators;
    var _points_initializers = [];
    var _points_extraInitializers = [];
    var _width_decorators;
    var _width_initializers = [];
    var _width_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(ExtraPart, _super);
            function ExtraPart() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                // private properties
                _this.colours = __runInitializers(_this, _colours_initializers, void 0);
                // required properties
                _this.shape = (__runInitializers(_this, _colours_extraInitializers), __runInitializers(_this, _shape_initializers, void 0));
                _this.points = (__runInitializers(_this, _shape_extraInitializers), __runInitializers(_this, _points_initializers, []));
                // other properties
                _this.width = (__runInitializers(_this, _points_extraInitializers), __runInitializers(_this, _width_initializers, 3.0
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                //
                // GENERATED METADATA BY THE postConstruct METHOD
                //
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                ));
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                //
                // GENERATED METADATA BY THE postConstruct METHOD
                //
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                _this.isCurve = (__runInitializers(_this, _width_extraInitializers), false);
                return _this;
            }
            ExtraPart.prototype.postConstruct = function (colours, colourMap) {
                switch (this.shape) {
                    case "curve":
                    case "curve-fill":
                        this.isCurve = true;
                }
                _super.prototype.mergeOpacityColours.call(this, this.colours, colours, colourMap);
            };
            return ExtraPart;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _colours_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "colours", required: false })];
            _shape_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "shape", required: true })];
            _points_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "points", required: true })];
            _width_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "width", required: false })];
            __esDecorate(null, null, _colours_decorators, { kind: "field", name: "colours", static: false, private: false, access: { has: function (obj) { return "colours" in obj; }, get: function (obj) { return obj.colours; }, set: function (obj, value) { obj.colours = value; } }, metadata: _metadata }, _colours_initializers, _colours_extraInitializers);
            __esDecorate(null, null, _shape_decorators, { kind: "field", name: "shape", static: false, private: false, access: { has: function (obj) { return "shape" in obj; }, get: function (obj) { return obj.shape; }, set: function (obj, value) { obj.shape = value; } }, metadata: _metadata }, _shape_initializers, _shape_extraInitializers);
            __esDecorate(null, null, _points_decorators, { kind: "field", name: "points", static: false, private: false, access: { has: function (obj) { return "points" in obj; }, get: function (obj) { return obj.points; }, set: function (obj, value) { obj.points = value; } }, metadata: _metadata }, _points_initializers, _points_extraInitializers);
            __esDecorate(null, null, _width_decorators, { kind: "field", name: "width", static: false, private: false, access: { has: function (obj) { return "width" in obj; }, get: function (obj) { return obj.width; }, set: function (obj, value) { obj.width = value; } }, metadata: _metadata }, _width_initializers, _width_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ExtraPart = ExtraPart;
