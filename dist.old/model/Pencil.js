var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "./Component.ts";
import { JsonProperty } from "json-object-mapper";
import "reflect-metadata";
import { OpaqueColour } from "./OpaqueColour.ts";
import { FrontBack } from "./FrontBack.ts";
import { ComponentDeserialiser } from "./deserialisers/ComponentDeserialiser.ts";
import { MapDeserialiser } from "./deserialisers/MapDeserialiser.ts";
import { Base } from "./Base.ts";
import { FrontBackDeserialiser } from "./deserialisers/FrontBackDeserialiser.ts";
export class Pencil extends Base {
    brand; // the brand of the pencil
    modelName; // the name of the pencil
    modelNumber; // the model number of the pencil
    leadSize; // the lead size
    leadShape = "cylindrical"; // the lead shape - which defaults to 'cylindrical'
    text = ""; // the text that is written on the pencil
    maximumLeadLength; // the maximum length of lead that will fit in the pencil
    mechanism = "";
    weight;
    colourComponent = ""; // the colour component that defines the differences
    colours = []; // the colours of the pencil
    colourMap = new Map(); // the map of named colours to hex colour codes
    accurate = false;
    features = [];
    front = [];
    back = [];
    components = []; // the components that make up the pencil
    skus = []; // the components that make up the pencil
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // GENERATED METADATA BY THE postConstruct METHOD
    //
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    colourComponents = [];
    maxWidth = 0; // the maximum width of the pencil (generated)
    maxHeight = 0; // the maximum height of the pencil (generated)
    totalLength = 0; // the total length of the pencil (generated)
    materials = []; // The materials that make up this pencil - to keep them in order of definition
    // whether the pencil has internal parts chich means that the pencil can be
    // disassembled (possibly) - maybe someone is just keen and has ruined the
    // pencil
    hasInternal = false; // whether this has internal parts - i.e. attached to an externally visible part
    hasHidden = false; // whether this pencil has hidden parts - i.e. not external at all
    postConstruct(colours, colourMap) {
        // first up we need to parse the colours
        for (const colour of this.colours) {
            this.colourComponents.push(new OpaqueColour(this.colourMap, colour));
        }
        const materialsSet = new Set();
        for (const component of this.components) {
            component.postConstruct(this.colours, this.colourMap);
            if (component.hasInternalStart || component.hasInternalEnd) {
                this.hasInternal = true;
            }
            if (component.isHidden) {
                this.hasHidden = true;
            }
            this.totalLength += component.length;
            let tempWidth = component.maxWidth;
            if (tempWidth > this.maxWidth) {
                this.maxWidth = tempWidth;
            }
            let tempHeight = component.maxHeight;
            if (tempHeight > this.maxHeight) {
                this.maxHeight = tempHeight;
            }
            const componentMaterials = component.materials;
            for (const componentMaterial of componentMaterials) {
                if (!materialsSet.has(componentMaterial)) {
                    this.materials.push(componentMaterial);
                    materialsSet.add(componentMaterial);
                }
            }
        }
        for (const front of this.front) {
            front.postConstruct(this.colours, colourMap);
        }
        for (const back of this.back) {
            back.postConstruct(this.colours, colourMap);
        }
    }
    getColours() {
        return (this.colours);
    }
}
__decorate([
    JsonProperty({ name: "brand", required: true }),
    __metadata("design:type", String)
], Pencil.prototype, "brand", void 0);
__decorate([
    JsonProperty({ name: "model_name", required: true }),
    __metadata("design:type", String)
], Pencil.prototype, "modelName", void 0);
__decorate([
    JsonProperty({ name: "model_number", required: false }),
    __metadata("design:type", String)
], Pencil.prototype, "modelNumber", void 0);
__decorate([
    JsonProperty({ name: "lead_size", required: true }),
    __metadata("design:type", Number)
], Pencil.prototype, "leadSize", void 0);
__decorate([
    JsonProperty({ name: "lead_shape", required: false }),
    __metadata("design:type", String)
], Pencil.prototype, "leadShape", void 0);
__decorate([
    JsonProperty({ name: "text", required: false }),
    __metadata("design:type", String)
], Pencil.prototype, "text", void 0);
__decorate([
    JsonProperty({ name: "maximum_lead_length", required: false }),
    __metadata("design:type", Number)
], Pencil.prototype, "maximumLeadLength", void 0);
__decorate([
    JsonProperty({ name: "mechanism", required: true }),
    __metadata("design:type", String)
], Pencil.prototype, "mechanism", void 0);
__decorate([
    JsonProperty({ name: "weight", required: false }),
    __metadata("design:type", Number)
], Pencil.prototype, "weight", void 0);
__decorate([
    JsonProperty({ name: "colour_component", required: true }),
    __metadata("design:type", String)
], Pencil.prototype, "colourComponent", void 0);
__decorate([
    JsonProperty({ name: "colours", required: true }),
    __metadata("design:type", Array)
], Pencil.prototype, "colours", void 0);
__decorate([
    JsonProperty({ name: "colour_map", required: false, deserializer: MapDeserialiser }),
    __metadata("design:type", Map)
], Pencil.prototype, "colourMap", void 0);
__decorate([
    JsonProperty({ name: "accurate", required: false }),
    __metadata("design:type", Boolean)
], Pencil.prototype, "accurate", void 0);
__decorate([
    JsonProperty({ name: "features", required: false }),
    __metadata("design:type", Array)
], Pencil.prototype, "features", void 0);
__decorate([
    JsonProperty({ name: "front", required: false, type: FrontBack, deserializer: FrontBackDeserialiser }),
    __metadata("design:type", Array)
], Pencil.prototype, "front", void 0);
__decorate([
    JsonProperty({ name: "back", required: false, type: FrontBack, deserializer: FrontBackDeserialiser }),
    __metadata("design:type", Array)
], Pencil.prototype, "back", void 0);
__decorate([
    JsonProperty({ name: "components", required: true, type: Component, deserializer: ComponentDeserialiser }),
    __metadata("design:type", Array)
], Pencil.prototype, "components", void 0);
__decorate([
    JsonProperty({ name: "skus", required: false }),
    __metadata("design:type", Array)
], Pencil.prototype, "skus", void 0);
//# sourceMappingURL=Pencil.js.map