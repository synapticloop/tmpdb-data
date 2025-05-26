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
export class Feature {
    type; // the type of the feature - e.g. eraser, sharpener
    location; // the location of the feature - e.g. - inside cap
}
__decorate([
    JsonProperty({ name: "type", required: true }),
    __metadata("design:type", String)
], Feature.prototype, "type", void 0);
__decorate([
    JsonProperty({ name: "location", required: false }),
    __metadata("design:type", String)
], Feature.prototype, "location", void 0);
//# sourceMappingURL=Feature.js.map