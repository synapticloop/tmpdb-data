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
import { Taper } from "./Taper.ts";
import { Base } from "./Base.ts";
export class Part extends Base {
    shape; // the shape of this part
    dimensions; // the dimensions for this part
    joined = false; // whether this part is joined to the previous part
    finish = ""; // The finish that is applied to the part
    offset = []; // the offset for this part
    taperStart;
    taperEnd;
    internalOffset = 0; // the internal offset (for tapering only)
    colours = [];
    backgroundColours = [];
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // GENERATED METADATA BY THE postConstruct METHOD
    //
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // the length of this part
    length = 0;
    // the start height and the end height
    startHeight = 0;
    endHeight = 0;
    material = null;
    postConstruct(colours, colourMap) {
        // contribute to the length
        super.mergeOpacityColours(this.colours, colours, colourMap);
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
    }
    getMaxHeight() {
        if (this.startHeight > this.endHeight) {
            return (this.startHeight);
        }
        return (this.endHeight);
    }
    getMinHeight() {
        return (this.getMinWidth());
    }
    getMaxWidth() {
        switch (this.shape) {
            case "hexagonal":
                let apothem = this.startHeight / 2;
                return (apothem / Math.cos(30 * Math.PI / 180) * 2);
        }
        return (this.getMaxHeight());
    }
    getMinWidth() {
        if (this.startHeight < this.endHeight) {
            return (this.startHeight);
        }
        return (this.endHeight);
    }
}
__decorate([
    JsonProperty({ name: "shape", required: true }),
    __metadata("design:type", String)
], Part.prototype, "shape", void 0);
__decorate([
    JsonProperty({ name: "dimensions", required: true }),
    __metadata("design:type", Array)
], Part.prototype, "dimensions", void 0);
__decorate([
    JsonProperty({ name: "joined", required: false }),
    __metadata("design:type", Boolean)
], Part.prototype, "joined", void 0);
__decorate([
    JsonProperty({ name: "finish", required: false }),
    __metadata("design:type", String)
], Part.prototype, "finish", void 0);
__decorate([
    JsonProperty({ name: "offset", required: false }),
    __metadata("design:type", Array)
], Part.prototype, "offset", void 0);
__decorate([
    JsonProperty({ name: "taper_start", required: false, type: Taper }),
    __metadata("design:type", Taper)
], Part.prototype, "taperStart", void 0);
__decorate([
    JsonProperty({ name: "taper_end", required: false, type: Taper }),
    __metadata("design:type", Taper)
], Part.prototype, "taperEnd", void 0);
__decorate([
    JsonProperty({ name: "internal_offset", required: false }),
    __metadata("design:type", Number)
], Part.prototype, "internalOffset", void 0);
__decorate([
    JsonProperty({ name: "colours", required: false }),
    __metadata("design:type", Array)
], Part.prototype, "colours", void 0);
__decorate([
    JsonProperty({ name: "background_colours", required: false }),
    __metadata("design:type", Array)
], Part.prototype, "backgroundColours", void 0);
//# sourceMappingURL=Part.js.map