var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Part } from "./Part.ts";
import { Extra } from "./Extra.ts";
import { JsonProperty } from "json-object-mapper";
import "reflect-metadata";
import { PartDeserialiser } from "./deserialisers/PartDeserialiser.ts";
import { ExtraDeserialiser } from "./deserialisers/ExtraDeserialiser.ts";
import { Base } from "./Base.ts";
export class Component extends Base {
    material; // the materials that this component is made out of
    colours; // the colours of this component
    type; // the type of this component
    parts = [];
    extras = [];
    internalStart = []; // the type of this component
    internalEnd = []; // the type of this component
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // GENERATED METADATA BY THE postConstruct METHOD
    //
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    materials = []; // the materials that this component is made out of
    // the length of the component - which is when you are looking at it
    // sideways...
    length = 0;
    // the width
    maxWidth = 0;
    minWidth = 0;
    maxHeight = 0;
    minHeight = 0;
    // this is the length of the clip if it has extras...
    allLength = 0;
    // this is the offset of the extras (if it has any)
    allOffset = 0;
    hasInternalStart = false;
    hasInternalEnd = false;
    isHidden = false;
    postConstruct(colours, colourMap) {
        // first up we want to cascade the postConstruct
        super.mergeOpacityColours(this.colours, colours, colourMap);
        for (const part of this.parts) {
            part.postConstruct(this.mergedColours, colourMap);
        }
        for (const internalEnd of this.internalEnd) {
            internalEnd.postConstruct(this.mergedColours, colourMap);
        }
        for (const internalStart of this.internalStart) {
            internalStart.postConstruct(this.mergedColours, colourMap);
        }
        this.materials.push(this.material);
        if (this.internalStart.length > 0) {
            this.hasInternalStart = true;
        }
        if (this.internalEnd.length > 0) {
            this.hasInternalEnd = true;
        }
        for (const part of this.parts) {
            this.length += part.length;
            if (part.material) {
                this.materials.push(part.material);
            }
            let tempMaxWidth = part.getMaxWidth();
            if (tempMaxWidth >= this.maxWidth) {
                this.maxWidth = tempMaxWidth;
            }
            let tempMinWidth = part.getMinWidth();
            if (tempMinWidth >= this.minWidth) {
                this.minWidth = tempMinWidth;
            }
            let tempMaxHeight = part.getMaxHeight();
            if (tempMaxHeight >= this.maxHeight) {
                this.maxHeight = tempMaxHeight;
            }
            let tempMinHeight = part.getMinHeight();
            if (tempMinHeight >= this.minHeight) {
                this.minHeight = tempMinHeight;
            }
        }
        // this component is only hidden if it has a length of 0 and one, or both
        // internal parts
        if (this.parts.length === 0 && (this.internalStart.length !== 0 || this.internalEnd.length !== 0)) {
            this.isHidden = true;
        }
        for (const extra of this.extras) {
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
    }
}
__decorate([
    JsonProperty({ name: "material", required: false }),
    __metadata("design:type", String)
], Component.prototype, "material", void 0);
__decorate([
    JsonProperty({ name: "colours", required: false }),
    __metadata("design:type", Array)
], Component.prototype, "colours", void 0);
__decorate([
    JsonProperty({ name: "type", required: false }),
    __metadata("design:type", String)
], Component.prototype, "type", void 0);
__decorate([
    JsonProperty({ name: "parts", required: false, type: Part, deserializer: PartDeserialiser }),
    __metadata("design:type", Array)
], Component.prototype, "parts", void 0);
__decorate([
    JsonProperty({ name: "extras", required: false, type: Extra, deserializer: ExtraDeserialiser }),
    __metadata("design:type", Array)
], Component.prototype, "extras", void 0);
__decorate([
    JsonProperty({ name: "internal_start", required: false, type: Part, deserializer: PartDeserialiser }),
    __metadata("design:type", Array)
], Component.prototype, "internalStart", void 0);
__decorate([
    JsonProperty({ name: "internal_end", required: false, type: Part, deserializer: PartDeserialiser }),
    __metadata("design:type", Array)
], Component.prototype, "internalEnd", void 0);
//# sourceMappingURL=Component.js.map