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
exports.Part = void 0;
var json_object_mapper_1 = require("json-object-mapper");
require("reflect-metadata");
var Taper_ts_1 = require("./Taper.ts");
var Base_ts_1 = require("./Base.ts");
var Part = function () {
    var _a;
    var _classSuper = Base_ts_1.Base;
    var _shape_decorators;
    var _shape_initializers = [];
    var _shape_extraInitializers = [];
    var _dimensions_decorators;
    var _dimensions_initializers = [];
    var _dimensions_extraInitializers = [];
    var _joined_decorators;
    var _joined_initializers = [];
    var _joined_extraInitializers = [];
    var _finish_decorators;
    var _finish_initializers = [];
    var _finish_extraInitializers = [];
    var _offset_decorators;
    var _offset_initializers = [];
    var _offset_extraInitializers = [];
    var _taperStart_decorators;
    var _taperStart_initializers = [];
    var _taperStart_extraInitializers = [];
    var _taperEnd_decorators;
    var _taperEnd_initializers = [];
    var _taperEnd_extraInitializers = [];
    var _internalOffset_decorators;
    var _internalOffset_initializers = [];
    var _internalOffset_extraInitializers = [];
    var _colours_decorators;
    var _colours_initializers = [];
    var _colours_extraInitializers = [];
    var _backgroundColours_decorators;
    var _backgroundColours_initializers = [];
    var _backgroundColours_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(Part, _super);
            function Part() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.shape = __runInitializers(_this, _shape_initializers, void 0); // the shape of this part
                _this.dimensions = (__runInitializers(_this, _shape_extraInitializers), __runInitializers(_this, _dimensions_initializers, void 0)); // the dimensions for this part
                _this.joined = (__runInitializers(_this, _dimensions_extraInitializers), __runInitializers(_this, _joined_initializers, false)); // whether this part is joined to the previous part
                _this.finish = (__runInitializers(_this, _joined_extraInitializers), __runInitializers(_this, _finish_initializers, "")); // The finish that is applied to the part
                _this.offset = (__runInitializers(_this, _finish_extraInitializers), __runInitializers(_this, _offset_initializers, [])); // the offset for this part
                _this.taperStart = (__runInitializers(_this, _offset_extraInitializers), __runInitializers(_this, _taperStart_initializers, void 0));
                _this.taperEnd = (__runInitializers(_this, _taperStart_extraInitializers), __runInitializers(_this, _taperEnd_initializers, void 0));
                _this.internalOffset = (__runInitializers(_this, _taperEnd_extraInitializers), __runInitializers(_this, _internalOffset_initializers, 0)); // the internal offset
                _this.colours = (__runInitializers(_this, _internalOffset_extraInitializers), __runInitializers(_this, _colours_initializers, []));
                _this.backgroundColours = (__runInitializers(_this, _colours_extraInitializers), __runInitializers(_this, _backgroundColours_initializers, []));
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                //
                // GENERATED METADATA BY THE postConstruct METHOD
                //
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                // the length of this part
                _this.length = (__runInitializers(_this, _backgroundColours_extraInitializers), 0);
                // the start height and the end height
                _this.startHeight = 0;
                _this.endHeight = 0;
                _this.material = null;
                return _this;
            }
            Part.prototype.postConstruct = function (colours, colourMap) {
                // contribute to the length
                _super.prototype.mergeOpacityColours.call(this, this.colours, colours, colourMap);
                if (this.taperStart) {
                    this.taperStart.postConstruct(this.mergedColours, colourMap);
                }
                if (this.taperEnd) {
                    this.taperEnd.postConstruct(this.mergedColours, colourMap);
                }
                this.length = this.dimensions[0];
                this.startHeight = this.dimensions[1];
                if (this.dimensions.length > 2) {
                    this.endHeight = this.dimensions[2];
                }
                else {
                    this.endHeight = this.dimensions[1];
                }
            };
            Part.prototype.getMaxHeight = function () {
                if (this.startHeight > this.endHeight) {
                    return (this.startHeight);
                }
                return (this.endHeight);
            };
            Part.prototype.getMinHeight = function () {
                return (this.getMinWidth());
            };
            Part.prototype.getMaxWidth = function () {
                switch (this.shape) {
                    case "hexagonal":
                        var apothem = this.startHeight / 2;
                        return (apothem / Math.cos(30 * Math.PI / 180) * 2);
                }
                return (this.getMaxHeight());
            };
            Part.prototype.getMinWidth = function () {
                if (this.startHeight < this.endHeight) {
                    return (this.startHeight);
                }
                return (this.endHeight);
            };
            return Part;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _shape_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "shape", required: true })];
            _dimensions_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "dimensions", required: true })];
            _joined_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "joined", required: false })];
            _finish_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "finish", required: false })];
            _offset_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "offset", required: false })];
            _taperStart_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "taper_start", required: false, type: Taper_ts_1.Taper })];
            _taperEnd_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "taper_end", required: false, type: Taper_ts_1.Taper })];
            _internalOffset_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "internal_offset", required: false })];
            _colours_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "colours", required: false })];
            _backgroundColours_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "background_colours", required: false })];
            __esDecorate(null, null, _shape_decorators, { kind: "field", name: "shape", static: false, private: false, access: { has: function (obj) { return "shape" in obj; }, get: function (obj) { return obj.shape; }, set: function (obj, value) { obj.shape = value; } }, metadata: _metadata }, _shape_initializers, _shape_extraInitializers);
            __esDecorate(null, null, _dimensions_decorators, { kind: "field", name: "dimensions", static: false, private: false, access: { has: function (obj) { return "dimensions" in obj; }, get: function (obj) { return obj.dimensions; }, set: function (obj, value) { obj.dimensions = value; } }, metadata: _metadata }, _dimensions_initializers, _dimensions_extraInitializers);
            __esDecorate(null, null, _joined_decorators, { kind: "field", name: "joined", static: false, private: false, access: { has: function (obj) { return "joined" in obj; }, get: function (obj) { return obj.joined; }, set: function (obj, value) { obj.joined = value; } }, metadata: _metadata }, _joined_initializers, _joined_extraInitializers);
            __esDecorate(null, null, _finish_decorators, { kind: "field", name: "finish", static: false, private: false, access: { has: function (obj) { return "finish" in obj; }, get: function (obj) { return obj.finish; }, set: function (obj, value) { obj.finish = value; } }, metadata: _metadata }, _finish_initializers, _finish_extraInitializers);
            __esDecorate(null, null, _offset_decorators, { kind: "field", name: "offset", static: false, private: false, access: { has: function (obj) { return "offset" in obj; }, get: function (obj) { return obj.offset; }, set: function (obj, value) { obj.offset = value; } }, metadata: _metadata }, _offset_initializers, _offset_extraInitializers);
            __esDecorate(null, null, _taperStart_decorators, { kind: "field", name: "taperStart", static: false, private: false, access: { has: function (obj) { return "taperStart" in obj; }, get: function (obj) { return obj.taperStart; }, set: function (obj, value) { obj.taperStart = value; } }, metadata: _metadata }, _taperStart_initializers, _taperStart_extraInitializers);
            __esDecorate(null, null, _taperEnd_decorators, { kind: "field", name: "taperEnd", static: false, private: false, access: { has: function (obj) { return "taperEnd" in obj; }, get: function (obj) { return obj.taperEnd; }, set: function (obj, value) { obj.taperEnd = value; } }, metadata: _metadata }, _taperEnd_initializers, _taperEnd_extraInitializers);
            __esDecorate(null, null, _internalOffset_decorators, { kind: "field", name: "internalOffset", static: false, private: false, access: { has: function (obj) { return "internalOffset" in obj; }, get: function (obj) { return obj.internalOffset; }, set: function (obj, value) { obj.internalOffset = value; } }, metadata: _metadata }, _internalOffset_initializers, _internalOffset_extraInitializers);
            __esDecorate(null, null, _colours_decorators, { kind: "field", name: "colours", static: false, private: false, access: { has: function (obj) { return "colours" in obj; }, get: function (obj) { return obj.colours; }, set: function (obj, value) { obj.colours = value; } }, metadata: _metadata }, _colours_initializers, _colours_extraInitializers);
            __esDecorate(null, null, _backgroundColours_decorators, { kind: "field", name: "backgroundColours", static: false, private: false, access: { has: function (obj) { return "backgroundColours" in obj; }, get: function (obj) { return obj.backgroundColours; }, set: function (obj, value) { obj.backgroundColours = value; } }, metadata: _metadata }, _backgroundColours_initializers, _backgroundColours_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.Part = Part;
