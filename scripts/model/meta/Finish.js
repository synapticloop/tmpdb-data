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
exports.Pattern = void 0;
var json_object_mapper_1 = require("json-object-mapper");
require("reflect-metadata");
var Finish = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _pattern_decorators;
    var _pattern_initializers = [];
    var _pattern_extraInitializers = [];
    var _inBuilt_decorators;
    var _inBuilt_initializers = [];
    var _inBuilt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function Pattern() {
                this.name = __runInitializers(this, _name_initializers, void 0); // The display name of the pattern
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0)); // The display description for the pattern
                this.pattern = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _pattern_initializers, void 0)); // The SVG pattern definition
                this.inBuilt = (__runInitializers(this, _pattern_extraInitializers), __runInitializers(this, _inBuilt_initializers, false));
                __runInitializers(this, _inBuilt_extraInitializers);
            }
            return Pattern;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "name", required: true })];
            _description_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "description", required: true })];
            _pattern_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "pattern", required: true })];
            _inBuilt_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "in_built", required: false })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _pattern_decorators, { kind: "field", name: "pattern", static: false, private: false, access: { has: function (obj) { return "pattern" in obj; }, get: function (obj) { return obj.pattern; }, set: function (obj, value) { obj.pattern = value; } }, metadata: _metadata }, _pattern_initializers, _pattern_extraInitializers);
            __esDecorate(null, null, _inBuilt_decorators, { kind: "field", name: "inBuilt", static: false, private: false, access: { has: function (obj) { return "inBuilt" in obj; }, get: function (obj) { return obj.inBuilt; }, set: function (obj, value) { obj.inBuilt = value; } }, metadata: _metadata }, _inBuilt_initializers, _inBuilt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.Pattern = Finish;
