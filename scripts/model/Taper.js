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
exports.Taper = void 0;
var json_object_mapper_1 = require("json-object-mapper");
require("reflect-metadata");
var Base_ts_1 = require("./Base.ts");
var Taper = function () {
    var _a;
    var _classSuper = Base_ts_1.Base;
    var _offset_decorators;
    var _offset_initializers = [];
    var _offset_extraInitializers = [];
    var _backgroundColours_decorators;
    var _backgroundColours_initializers = [];
    var _backgroundColours_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(Taper, _super);
            function Taper() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.offset = __runInitializers(_this, _offset_initializers, void 0);
                _this.backgroundColours = (__runInitializers(_this, _offset_extraInitializers), __runInitializers(_this, _backgroundColours_initializers, void 0));
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                //
                // GENERATED METADATA BY THE postConstruct METHOD
                //
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                _this.xOffset = (__runInitializers(_this, _backgroundColours_extraInitializers), 0);
                _this.yOffset = 0;
                _this.xScale = 1;
                return _this;
            }
            Taper.prototype.postConstruct = function (colours, colourMap) {
                _super.prototype.mergeOpacityColours.call(this, colours, colours, colourMap);
                _super.prototype.mergeBackgroundOpacityColours.call(this, this.backgroundColours, colours, colourMap);
                // if the offset array is length 2 - then it is an xOffset and an xScale,
                // if it is a 3 then it is an xOffset, a yOffset, and an xScale
                this.xOffset = this.offset[0];
                switch (this.offset.length) {
                    case 2:
                        this.xScale = this.offset[1];
                        break;
                    case 3:
                        this.yOffset = this.offset[1];
                        this.xScale = this.offset[2];
                        break;
                }
            };
            return Taper;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _offset_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "offset", required: true })];
            _backgroundColours_decorators = [(0, json_object_mapper_1.JsonProperty)({ name: "background_colours", required: false })];
            __esDecorate(null, null, _offset_decorators, { kind: "field", name: "offset", static: false, private: false, access: { has: function (obj) { return "offset" in obj; }, get: function (obj) { return obj.offset; }, set: function (obj, value) { obj.offset = value; } }, metadata: _metadata }, _offset_initializers, _offset_extraInitializers);
            __esDecorate(null, null, _backgroundColours_decorators, { kind: "field", name: "backgroundColours", static: false, private: false, access: { has: function (obj) { return "backgroundColours" in obj; }, get: function (obj) { return obj.backgroundColours; }, set: function (obj, value) { obj.backgroundColours = value; } }, metadata: _metadata }, _backgroundColours_initializers, _backgroundColours_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.Taper = Taper;
