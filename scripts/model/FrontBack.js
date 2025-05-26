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
exports.FrontBack = void 0;
var json_object_mapper_1 = require("json-object-mapper");
require("reflect-metadata");
var Base_ts_1 = require("./Base.ts");
var FrontBack = function () {
    var _a;
    var _classSuper = Base_ts_1.Base;
    var _shape_decorators;
    var _shape_initializers = [];
    var _shape_extraInitializers = [];
    var _dimensions_decorators;
    var _dimensions_initializers = [];
    var _dimensions_extraInitializers = [];
    var _fill_decorators;
    var _fill_initializers = [];
    var _fill_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(FrontBack, _super);
            function FrontBack() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.shape = __runInitializers(_this, _shape_initializers, void 0); // the shape of the front/back piece
                _this.dimensions = (__runInitializers(_this, _shape_extraInitializers), __runInitializers(_this, _dimensions_initializers, void 0)); // the dimensions of the front/back piece
                _this.fill = (__runInitializers(_this, _dimensions_extraInitializers), __runInitializers(_this, _fill_initializers, void 0));
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                //
                // GENERATED METADATA BY THE postConstruct METHOD
                //
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                // TODO - sort this out
                _this.fillColour = __runInitializers(_this, _fill_extraInitializers);
                return _this;
            }
            FrontBack.prototype.postConstruct = function (colours, colourMap) {
                _super.prototype.mergeOpacityColours.call(this, this.fill, colours, colourMap);
                this.width = this.dimensions[0];
                this.length = this.dimensions[1];
            };
            return FrontBack;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _shape_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "shape", required: true })];
            _dimensions_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "dimensions", required: true })];
            _fill_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "fill", required: false })];
            __esDecorate(null, null, _shape_decorators, { kind: "field", name: "shape", static: false, private: false, access: { has: function (obj) { return "shape" in obj; }, get: function (obj) { return obj.shape; }, set: function (obj, value) { obj.shape = value; } }, metadata: _metadata }, _shape_initializers, _shape_extraInitializers);
            __esDecorate(null, null, _dimensions_decorators, { kind: "field", name: "dimensions", static: false, private: false, access: { has: function (obj) { return "dimensions" in obj; }, get: function (obj) { return obj.dimensions; }, set: function (obj, value) { obj.dimensions = value; } }, metadata: _metadata }, _dimensions_initializers, _dimensions_extraInitializers);
            __esDecorate(null, null, _fill_decorators, { kind: "field", name: "fill", static: false, private: false, access: { has: function (obj) { return "fill" in obj; }, get: function (obj) { return obj.fill; }, set: function (obj, value) { obj.fill = value; } }, metadata: _metadata }, _fill_initializers, _fill_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FrontBack = FrontBack;
