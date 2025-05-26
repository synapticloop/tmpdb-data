var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ExtraPart } from "./ExtraPart.ts";
import { Base } from "./Base.ts";
import { JsonProperty } from "json-object-mapper";
import { ExtraPartDeserialiser } from "./deserialisers/ExtraPartDeserialiser.ts";
export class Extra extends Base {
    dimensions;
    extraParts = [];
    // TODO PRIVATE
    offset = [];
    colours = [];
    length;
    height;
    depth;
    xOffset;
    yOffset;
    postConstruct(colours, colourMap) {
        super.mergeOpacityColours(this.colours, colours, colourMap);
        this.length = this.dimensions[0];
        this.height = this.dimensions[1];
        this.depth = this.dimensions[2];
        this.xOffset = this.offset[0];
        this.yOffset = this.offset[1];
    }
}
__decorate([
    JsonProperty({ name: "dimensions", required: true }),
    __metadata("design:type", Array)
], Extra.prototype, "dimensions", void 0);
__decorate([
    JsonProperty({ name: "parts", type: ExtraPart, deserializer: ExtraPartDeserialiser, required: true }),
    __metadata("design:type", Array)
], Extra.prototype, "extraParts", void 0);
__decorate([
    JsonProperty({ name: "offset", required: true }),
    __metadata("design:type", Array)
], Extra.prototype, "offset", void 0);
__decorate([
    JsonProperty({ name: "colours", required: false }),
    __metadata("design:type", Array)
], Extra.prototype, "colours", void 0);
//# sourceMappingURL=Extra.js.map