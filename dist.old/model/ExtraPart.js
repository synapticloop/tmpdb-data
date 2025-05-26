var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { JsonProperty } from "json-object-mapper";
import "reflect-metadata";
import { Base } from "./Base.ts";
export class ExtraPart extends Base {
    // private properties
    colours;
    // required properties
    shape;
    points = [];
    // other properties
    width = 3.0;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // GENERATED METADATA BY THE postConstruct METHOD
    //
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    isCurve = false;
    postConstruct(colours, colourMap) {
        switch (this.shape) {
            case "curve":
            case "curve-fill":
                this.isCurve = true;
        }
        super.mergeOpacityColours(this.colours, colours, colourMap);
    }
}
__decorate([
    JsonProperty({ name: "colours", required: false }),
    __metadata("design:type", Array)
], ExtraPart.prototype, "colours", void 0);
__decorate([
    JsonProperty({ name: "shape", required: true }),
    __metadata("design:type", String)
], ExtraPart.prototype, "shape", void 0);
__decorate([
    JsonProperty({ name: "points", required: true }),
    __metadata("design:type", Array)
], ExtraPart.prototype, "points", void 0);
__decorate([
    JsonProperty({ name: "width", required: false }),
    __metadata("design:type", Number)
], ExtraPart.prototype, "width", void 0);
//# sourceMappingURL=ExtraPart.js.map