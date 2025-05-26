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
exports.Component = void 0;
var Part_ts_1 = require("./Part.ts");
var Extra_ts_1 = require("./Extra.ts");
var json_object_mapper_1 = require("json-object-mapper");
require("reflect-metadata");
var PartDeserialiser_ts_1 = require("./deserialisers/PartDeserialiser.ts");
var ExtraDeserialiser_ts_1 = require("./deserialisers/ExtraDeserialiser.ts");
var Base_ts_1 = require("./Base.ts");
var Component = function () {
    var _a;
    var _classSuper = Base_ts_1.Base;
    var _material_decorators;
    var _material_initializers = [];
    var _material_extraInitializers = [];
    var _colours_decorators;
    var _colours_initializers = [];
    var _colours_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _parts_decorators;
    var _parts_initializers = [];
    var _parts_extraInitializers = [];
    var _extras_decorators;
    var _extras_initializers = [];
    var _extras_extraInitializers = [];
    var _internalStart_decorators;
    var _internalStart_initializers = [];
    var _internalStart_extraInitializers = [];
    var _internalEnd_decorators;
    var _internalEnd_initializers = [];
    var _internalEnd_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(Component, _super);
            function Component() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.material = __runInitializers(_this, _material_initializers, void 0); // the materials that this component is made out of
                _this.colours = (__runInitializers(_this, _material_extraInitializers), __runInitializers(_this, _colours_initializers, void 0)); // the colours of this component
                _this.type = (__runInitializers(_this, _colours_extraInitializers), __runInitializers(_this, _type_initializers, void 0)); // the type of this component
                _this.parts = (__runInitializers(_this, _type_extraInitializers), __runInitializers(_this, _parts_initializers, []));
                _this.extras = (__runInitializers(_this, _parts_extraInitializers), __runInitializers(_this, _extras_initializers, []));
                _this.internalStart = (__runInitializers(_this, _extras_extraInitializers), __runInitializers(_this, _internalStart_initializers, [])); // the type of this component
                _this.internalEnd = (__runInitializers(_this, _internalStart_extraInitializers), __runInitializers(_this, _internalEnd_initializers, [])); // the type of this component
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                //
                // GENERATED METADATA BY THE postConstruct METHOD
                //
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                _this.materials = (__runInitializers(_this, _internalEnd_extraInitializers), []); // the materials that this component is made out of
                // the length of the component - which is when you are looking at it
                // sideways...
                _this.length = 0;
                // the width
                _this.maxWidth = 0;
                _this.minWidth = 0;
                _this.maxHeight = 0;
                _this.minHeight = 0;
                // this is the length of the clip if it has extras...
                _this.allLength = 0;
                // this is the offset of the extras (if it has any)
                _this.allOffset = 0;
                _this.internalStartLength = 0;
                _this.internalEndLength = 0;
                _this.hasInternalStart = false;
                _this.hasInternalEnd = false;
                _this.hasInternal = false;
                _this.isHidden = false;
                return _this;
            }
            Component.prototype.postConstruct = function (colours, colourMap) {
                // first up we want to cascade the postConstruct
                _super.prototype.mergeOpacityColours.call(this, this.colours, colours, colourMap);
                for (var _i = 0, _b = this.parts; _i < _b.length; _i++) {
                    var part = _b[_i];
                    part.postConstruct(this.mergedColours, colourMap);
                }
                for (var _c = 0, _d = this.internalEnd; _c < _d.length; _c++) {
                    var internalEnd = _d[_c];
                    internalEnd.postConstruct(this.mergedColours, colourMap);
                    this.internalEndLength += internalEnd.length;
                    this.internalEndLength += internalEnd.internalOffset;
                }
                for (var _e = 0, _f = this.internalStart; _e < _f.length; _e++) {
                    var internalStart = _f[_e];
                    internalStart.postConstruct(this.mergedColours, colourMap);
                    this.internalStartLength += internalStart.length;
                }
                this.materials.push(this.material);
                if (this.internalStart.length > 0) {
                    this.hasInternalStart = true;
                }
                if (this.internalEnd.length > 0) {
                    this.hasInternalEnd = true;
                }
                this.hasInternal = this.hasInternalStart || this.hasInternalEnd;
                for (var _g = 0, _h = this.parts; _g < _h.length; _g++) {
                    var part = _h[_g];
                    this.length += part.length;
                    if (part.material) {
                        this.materials.push(part.material);
                    }
                    var tempMaxWidth = part.getMaxWidth();
                    if (tempMaxWidth >= this.maxWidth) {
                        this.maxWidth = tempMaxWidth;
                    }
                    var tempMinWidth = part.getMinWidth();
                    if (tempMinWidth >= this.minWidth) {
                        this.minWidth = tempMinWidth;
                    }
                    var tempMaxHeight = part.getMaxHeight();
                    if (tempMaxHeight >= this.maxHeight) {
                        this.maxHeight = tempMaxHeight;
                    }
                    var tempMinHeight = part.getMinHeight();
                    if (tempMinHeight >= this.minHeight) {
                        this.minHeight = tempMinHeight;
                    }
                }
                // this component is only hidden if it has a length of 0 and one, or both
                // internal parts
                if (this.parts.length === 0 && (this.internalStart.length !== 0 || this.internalEnd.length !== 0)) {
                    this.isHidden = true;
                }
                for (var _j = 0, _k = this.extras; _j < _k.length; _j++) {
                    var extra = _k[_j];
                    extra.postConstruct(this.mergedColours, colourMap);
                    if (extra.xOffset < this.allOffset) {
                        this.allOffset = extra.xOffset;
                    }
                    if (extra.length > this.allLength) {
                        this.allLength = extra.length;
                    }
                    // TODO - need to do multiple
                }
                if (this.allLength === 0) {
                    this.allLength = this.length;
                }
            };
            return Component;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _material_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "material", required: false })];
            _colours_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "colours", required: false })];
            _type_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "type", required: false })];
            _parts_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "parts", required: false, type: Part_ts_1.Part, deserializer: PartDeserialiser_ts_1.PartDeserialiser })];
            _extras_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "extras", required: false, type: Extra_ts_1.Extra, deserializer: ExtraDeserialiser_ts_1.ExtraDeserialiser })];
            _internalStart_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "internal_start", required: false, type: Part_ts_1.Part, deserializer: PartDeserialiser_ts_1.PartDeserialiser })];
            _internalEnd_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "internal_end", required: false, type: Part_ts_1.Part, deserializer: PartDeserialiser_ts_1.PartDeserialiser })];
            __esDecorate(null, null, _material_decorators, { kind: "field", name: "material", static: false, private: false, access: { has: function (obj) { return "material" in obj; }, get: function (obj) { return obj.material; }, set: function (obj, value) { obj.material = value; } }, metadata: _metadata }, _material_initializers, _material_extraInitializers);
            __esDecorate(null, null, _colours_decorators, { kind: "field", name: "colours", static: false, private: false, access: { has: function (obj) { return "colours" in obj; }, get: function (obj) { return obj.colours; }, set: function (obj, value) { obj.colours = value; } }, metadata: _metadata }, _colours_initializers, _colours_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _parts_decorators, { kind: "field", name: "parts", static: false, private: false, access: { has: function (obj) { return "parts" in obj; }, get: function (obj) { return obj.parts; }, set: function (obj, value) { obj.parts = value; } }, metadata: _metadata }, _parts_initializers, _parts_extraInitializers);
            __esDecorate(null, null, _extras_decorators, { kind: "field", name: "extras", static: false, private: false, access: { has: function (obj) { return "extras" in obj; }, get: function (obj) { return obj.extras; }, set: function (obj, value) { obj.extras = value; } }, metadata: _metadata }, _extras_initializers, _extras_extraInitializers);
            __esDecorate(null, null, _internalStart_decorators, { kind: "field", name: "internalStart", static: false, private: false, access: { has: function (obj) { return "internalStart" in obj; }, get: function (obj) { return obj.internalStart; }, set: function (obj, value) { obj.internalStart = value; } }, metadata: _metadata }, _internalStart_initializers, _internalStart_extraInitializers);
            __esDecorate(null, null, _internalEnd_decorators, { kind: "field", name: "internalEnd", static: false, private: false, access: { has: function (obj) { return "internalEnd" in obj; }, get: function (obj) { return obj.internalEnd; }, set: function (obj, value) { obj.internalEnd = value; } }, metadata: _metadata }, _internalEnd_initializers, _internalEnd_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.Component = Component;
