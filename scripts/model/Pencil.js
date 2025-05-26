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
exports.Pencil = void 0;
var Component_ts_1 = require("./Component.ts");
var json_object_mapper_1 = require("json-object-mapper");
require("reflect-metadata");
var OpaqueColour_ts_1 = require("./meta/OpaqueColour.ts");
var Feature_ts_1 = require("./Feature.ts");
var FrontBack_ts_1 = require("./FrontBack.ts");
var ComponentDeserialiser_ts_1 = require("./deserialisers/ComponentDeserialiser.ts");
var MapDeserialiser_ts_1 = require("./deserialisers/MapDeserialiser.ts");
var Base_ts_1 = require("./Base.ts");
var FrontBackDeserialiser_ts_1 = require("./deserialisers/FrontBackDeserialiser.ts");
var FeatureDeserialiser_ts_1 = require("./deserialisers/FeatureDeserialiser.ts");
var Pencil = function () {
    var _a;
    var _classSuper = Base_ts_1.Base;
    var _brand_decorators;
    var _brand_initializers = [];
    var _brand_extraInitializers = [];
    var _modelName_decorators;
    var _modelName_initializers = [];
    var _modelName_extraInitializers = [];
    var _modelNumber_decorators;
    var _modelNumber_initializers = [];
    var _modelNumber_extraInitializers = [];
    var _leadSize_decorators;
    var _leadSize_initializers = [];
    var _leadSize_extraInitializers = [];
    var _leadShape_decorators;
    var _leadShape_initializers = [];
    var _leadShape_extraInitializers = [];
    var _text_decorators;
    var _text_initializers = [];
    var _text_extraInitializers = [];
    var _maximumLeadLength_decorators;
    var _maximumLeadLength_initializers = [];
    var _maximumLeadLength_extraInitializers = [];
    var _mechanism_decorators;
    var _mechanism_initializers = [];
    var _mechanism_extraInitializers = [];
    var _weight_decorators;
    var _weight_initializers = [];
    var _weight_extraInitializers = [];
    var _colourComponent_decorators;
    var _colourComponent_initializers = [];
    var _colourComponent_extraInitializers = [];
    var _colours_decorators;
    var _colours_initializers = [];
    var _colours_extraInitializers = [];
    var _colourMap_decorators;
    var _colourMap_initializers = [];
    var _colourMap_extraInitializers = [];
    var _accurate_decorators;
    var _accurate_initializers = [];
    var _accurate_extraInitializers = [];
    var _features_decorators;
    var _features_initializers = [];
    var _features_extraInitializers = [];
    var _front_decorators;
    var _front_initializers = [];
    var _front_extraInitializers = [];
    var _back_decorators;
    var _back_initializers = [];
    var _back_extraInitializers = [];
    var _components_decorators;
    var _components_initializers = [];
    var _components_extraInitializers = [];
    var _skus_decorators;
    var _skus_initializers = [];
    var _skus_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(Pencil, _super);
            function Pencil() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.brand = __runInitializers(_this, _brand_initializers, void 0); // the brand of the pencil
                _this.modelName = (__runInitializers(_this, _brand_extraInitializers), __runInitializers(_this, _modelName_initializers, void 0)); // the name of the pencil
                _this.modelNumber = (__runInitializers(_this, _modelName_extraInitializers), __runInitializers(_this, _modelNumber_initializers, void 0)); // the model number of the pencil
                _this.leadSize = (__runInitializers(_this, _modelNumber_extraInitializers), __runInitializers(_this, _leadSize_initializers, void 0)); // the lead size
                _this.leadShape = (__runInitializers(_this, _leadSize_extraInitializers), __runInitializers(_this, _leadShape_initializers, "cylindrical")); // the lead shape - which defaults to 'cylindrical'
                _this.text = (__runInitializers(_this, _leadShape_extraInitializers), __runInitializers(_this, _text_initializers, "")); // the text that is written on the pencil
                _this.maximumLeadLength = (__runInitializers(_this, _text_extraInitializers), __runInitializers(_this, _maximumLeadLength_initializers, void 0)); // the maximum length of lead that will fit in the pencil
                _this.mechanism = (__runInitializers(_this, _maximumLeadLength_extraInitializers), __runInitializers(_this, _mechanism_initializers, ""));
                _this.weight = (__runInitializers(_this, _mechanism_extraInitializers), __runInitializers(_this, _weight_initializers, void 0));
                _this.colourComponent = (__runInitializers(_this, _weight_extraInitializers), __runInitializers(_this, _colourComponent_initializers, "")); // the colour component that defines the differences
                _this.colours = (__runInitializers(_this, _colourComponent_extraInitializers), __runInitializers(_this, _colours_initializers, [])); // the colours of the pencil
                _this.colourMap = (__runInitializers(_this, _colours_extraInitializers), __runInitializers(_this, _colourMap_initializers, new Map())); // the map of named colours to hex colour codes
                _this.accurate = (__runInitializers(_this, _colourMap_extraInitializers), __runInitializers(_this, _accurate_initializers, false));
                _this.features = (__runInitializers(_this, _accurate_extraInitializers), __runInitializers(_this, _features_initializers, []));
                _this.front = (__runInitializers(_this, _features_extraInitializers), __runInitializers(_this, _front_initializers, []));
                _this.back = (__runInitializers(_this, _front_extraInitializers), __runInitializers(_this, _back_initializers, []));
                _this.components = (__runInitializers(_this, _back_extraInitializers), __runInitializers(_this, _components_initializers, [])); // the components that make up the pencil
                _this.skus = (__runInitializers(_this, _components_extraInitializers), __runInitializers(_this, _skus_initializers, [])); // the components that make up the pencil
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                //
                // GENERATED METADATA BY THE postConstruct METHOD
                //
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                _this.colourVariants = (__runInitializers(_this, _skus_extraInitializers), []);
                _this.colourComponents = [];
                _this.featureDescriptions = [];
                _this.maxWidth = 0; // the maximum width of the pencil (generated)
                _this.maxHeight = 0; // the maximum height of the pencil (generated)
                _this.totalLength = 0; // the total length of the pencil (generated)
                _this.materials = []; // The materials that make up this pencil - to keep them in order of definition
                // whether the pencil has internal parts chich means that the pencil can be
                // disassembled (possibly) - maybe someone is just keen and has ruined the
                // pencil
                _this.hasInternal = false; // whether this has internal parts - i.e. attached to an externally visible part
                _this.hasHidden = false; // whether this pencil has hidden parts - i.e. not external at all
                return _this;
            }
            Pencil.prototype.postConstruct = function (colours, colourMap) {
                // first up we need to parse the colours
                for (var _i = 0, _b = this.colours; _i < _b.length; _i++) {
                    var colour = _b[_i];
                    var opaqueColour = new OpaqueColour_ts_1.OpaqueColour(this.colourMap, colour);
                    this.colourComponents.push(opaqueColour);
                    this.colourVariants.push(opaqueColour.colourName);
                }
                for (var _c = 0, _d = this.features; _c < _d.length; _c++) {
                    var feature = _d[_c];
                    this.featureDescriptions.push(feature.featureDescription());
                }
                var materialsSet = new Set();
                for (var _e = 0, _f = this.components; _e < _f.length; _e++) {
                    var component = _f[_e];
                    component.postConstruct(this.colours, this.colourMap);
                    if (component.hasInternalStart || component.hasInternalEnd) {
                        this.hasInternal = true;
                    }
                    if (component.isHidden) {
                        this.hasHidden = true;
                    }
                    this.totalLength += component.length;
                    var tempWidth = component.maxWidth;
                    if (tempWidth > this.maxWidth) {
                        this.maxWidth = tempWidth;
                    }
                    var tempHeight = component.maxHeight;
                    if (tempHeight > this.maxHeight) {
                        this.maxHeight = tempHeight;
                    }
                    var componentMaterials = component.materials;
                    for (var _g = 0, componentMaterials_1 = componentMaterials; _g < componentMaterials_1.length; _g++) {
                        var componentMaterial = componentMaterials_1[_g];
                        if (!materialsSet.has(componentMaterial)) {
                            this.materials.push(componentMaterial);
                            materialsSet.add(componentMaterial);
                        }
                    }
                }
                for (var _h = 0, _j = this.front; _h < _j.length; _h++) {
                    var front = _j[_h];
                    front.postConstruct(this.colours, colourMap);
                }
                for (var _k = 0, _l = this.back; _k < _l.length; _k++) {
                    var back = _l[_k];
                    back.postConstruct(this.colours, colourMap);
                }
            };
            Pencil.prototype.getColours = function () {
                return (this.colours);
            };
            return Pencil;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _brand_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "brand", required: true })];
            _modelName_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "model_name", required: true })];
            _modelNumber_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "model_number", required: false })];
            _leadSize_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "lead_size", required: true })];
            _leadShape_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "lead_shape", required: false })];
            _text_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "text", required: false })];
            _maximumLeadLength_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "maximum_lead_length", required: false })];
            _mechanism_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "mechanism", required: true })];
            _weight_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "weight", required: false })];
            _colourComponent_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "colour_component", required: true })];
            _colours_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "colours", required: true })];
            _colourMap_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "colour_map", required: false, deserializer: MapDeserialiser_ts_1.MapDeserialiser })];
            _accurate_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "accurate", required: false })];
            _features_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "features", required: false, type: Feature_ts_1.Feature, deserializer: FeatureDeserialiser_ts_1.FeatureDeserialiser })];
            _front_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "front", required: false, type: FrontBack_ts_1.FrontBack, deserializer: FrontBackDeserialiser_ts_1.FrontBackDeserialiser })];
            _back_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "back", required: false, type: FrontBack_ts_1.FrontBack, deserializer: FrontBackDeserialiser_ts_1.FrontBackDeserialiser })];
            _components_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "components", required: true, type: Component_ts_1.Component, deserializer: ComponentDeserialiser_ts_1.ComponentDeserialiser })];
            _skus_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "skus", required: false })];
            __esDecorate(null, null, _brand_decorators, { kind: "field", name: "brand", static: false, private: false, access: { has: function (obj) { return "brand" in obj; }, get: function (obj) { return obj.brand; }, set: function (obj, value) { obj.brand = value; } }, metadata: _metadata }, _brand_initializers, _brand_extraInitializers);
            __esDecorate(null, null, _modelName_decorators, { kind: "field", name: "modelName", static: false, private: false, access: { has: function (obj) { return "modelName" in obj; }, get: function (obj) { return obj.modelName; }, set: function (obj, value) { obj.modelName = value; } }, metadata: _metadata }, _modelName_initializers, _modelName_extraInitializers);
            __esDecorate(null, null, _modelNumber_decorators, { kind: "field", name: "modelNumber", static: false, private: false, access: { has: function (obj) { return "modelNumber" in obj; }, get: function (obj) { return obj.modelNumber; }, set: function (obj, value) { obj.modelNumber = value; } }, metadata: _metadata }, _modelNumber_initializers, _modelNumber_extraInitializers);
            __esDecorate(null, null, _leadSize_decorators, { kind: "field", name: "leadSize", static: false, private: false, access: { has: function (obj) { return "leadSize" in obj; }, get: function (obj) { return obj.leadSize; }, set: function (obj, value) { obj.leadSize = value; } }, metadata: _metadata }, _leadSize_initializers, _leadSize_extraInitializers);
            __esDecorate(null, null, _leadShape_decorators, { kind: "field", name: "leadShape", static: false, private: false, access: { has: function (obj) { return "leadShape" in obj; }, get: function (obj) { return obj.leadShape; }, set: function (obj, value) { obj.leadShape = value; } }, metadata: _metadata }, _leadShape_initializers, _leadShape_extraInitializers);
            __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: function (obj) { return "text" in obj; }, get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
            __esDecorate(null, null, _maximumLeadLength_decorators, { kind: "field", name: "maximumLeadLength", static: false, private: false, access: { has: function (obj) { return "maximumLeadLength" in obj; }, get: function (obj) { return obj.maximumLeadLength; }, set: function (obj, value) { obj.maximumLeadLength = value; } }, metadata: _metadata }, _maximumLeadLength_initializers, _maximumLeadLength_extraInitializers);
            __esDecorate(null, null, _mechanism_decorators, { kind: "field", name: "mechanism", static: false, private: false, access: { has: function (obj) { return "mechanism" in obj; }, get: function (obj) { return obj.mechanism; }, set: function (obj, value) { obj.mechanism = value; } }, metadata: _metadata }, _mechanism_initializers, _mechanism_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: function (obj) { return "weight" in obj; }, get: function (obj) { return obj.weight; }, set: function (obj, value) { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            __esDecorate(null, null, _colourComponent_decorators, { kind: "field", name: "colourComponent", static: false, private: false, access: { has: function (obj) { return "colourComponent" in obj; }, get: function (obj) { return obj.colourComponent; }, set: function (obj, value) { obj.colourComponent = value; } }, metadata: _metadata }, _colourComponent_initializers, _colourComponent_extraInitializers);
            __esDecorate(null, null, _colours_decorators, { kind: "field", name: "colours", static: false, private: false, access: { has: function (obj) { return "colours" in obj; }, get: function (obj) { return obj.colours; }, set: function (obj, value) { obj.colours = value; } }, metadata: _metadata }, _colours_initializers, _colours_extraInitializers);
            __esDecorate(null, null, _colourMap_decorators, { kind: "field", name: "colourMap", static: false, private: false, access: { has: function (obj) { return "colourMap" in obj; }, get: function (obj) { return obj.colourMap; }, set: function (obj, value) { obj.colourMap = value; } }, metadata: _metadata }, _colourMap_initializers, _colourMap_extraInitializers);
            __esDecorate(null, null, _accurate_decorators, { kind: "field", name: "accurate", static: false, private: false, access: { has: function (obj) { return "accurate" in obj; }, get: function (obj) { return obj.accurate; }, set: function (obj, value) { obj.accurate = value; } }, metadata: _metadata }, _accurate_initializers, _accurate_extraInitializers);
            __esDecorate(null, null, _features_decorators, { kind: "field", name: "features", static: false, private: false, access: { has: function (obj) { return "features" in obj; }, get: function (obj) { return obj.features; }, set: function (obj, value) { obj.features = value; } }, metadata: _metadata }, _features_initializers, _features_extraInitializers);
            __esDecorate(null, null, _front_decorators, { kind: "field", name: "front", static: false, private: false, access: { has: function (obj) { return "front" in obj; }, get: function (obj) { return obj.front; }, set: function (obj, value) { obj.front = value; } }, metadata: _metadata }, _front_initializers, _front_extraInitializers);
            __esDecorate(null, null, _back_decorators, { kind: "field", name: "back", static: false, private: false, access: { has: function (obj) { return "back" in obj; }, get: function (obj) { return obj.back; }, set: function (obj, value) { obj.back = value; } }, metadata: _metadata }, _back_initializers, _back_extraInitializers);
            __esDecorate(null, null, _components_decorators, { kind: "field", name: "components", static: false, private: false, access: { has: function (obj) { return "components" in obj; }, get: function (obj) { return obj.components; }, set: function (obj, value) { obj.components = value; } }, metadata: _metadata }, _components_initializers, _components_extraInitializers);
            __esDecorate(null, null, _skus_decorators, { kind: "field", name: "skus", static: false, private: false, access: { has: function (obj) { return "skus" in obj; }, get: function (obj) { return obj.skus; }, set: function (obj, value) { obj.skus = value; } }, metadata: _metadata }, _skus_initializers, _skus_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.Pencil = Pencil;
