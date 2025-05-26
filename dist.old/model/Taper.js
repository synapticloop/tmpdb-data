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
export class Taper extends Base {
    offset;
    backgroundColours;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // GENERATED METADATA BY THE postConstruct METHOD
    //
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    xOffset = 0;
    yOffset = 0;
    xScale = 1;
    postConstruct(colours, colourMap) {
        super.mergeOpacityColours(colours, colours, colourMap);
        super.mergeBackgroundOpacityColours(this.backgroundColours, colours, colourMap);
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
    }
}
__decorate([
    JsonProperty({ name: "offset", required: true }),
    __metadata("design:type", Array)
], Taper.prototype, "offset", void 0);
__decorate([
    JsonProperty({ name: "background_colours", required: false }),
    __metadata("design:type", Array)
], Taper.prototype, "backgroundColours", void 0);
//# sourceMappingURL=Taper.js.map