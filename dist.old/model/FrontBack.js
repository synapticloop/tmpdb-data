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
export class FrontBack extends Base {
    shape; // the shape of the front/back piece
    dimensions; // the dimensions of the front/back piece
    fill;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // GENERATED METADATA BY THE postConstruct METHOD
    //
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // TODO - sort this out
    fillColour;
    width;
    length;
    postConstruct(colours, colourMap) {
        super.mergeOpacityColours(this.fill, colours, colourMap);
        this.width = this.dimensions[0];
        this.length = this.dimensions[1];
    }
}
__decorate([
    JsonProperty({ name: "shape", required: true }),
    __metadata("design:type", String)
], FrontBack.prototype, "shape", void 0);
__decorate([
    JsonProperty({ name: "dimensions", required: true }),
    __metadata("design:type", Array)
], FrontBack.prototype, "dimensions", void 0);
__decorate([
    JsonProperty({ name: "fill", required: false }),
    __metadata("design:type", Array)
], FrontBack.prototype, "fill", void 0);
//# sourceMappingURL=FrontBack.js.map