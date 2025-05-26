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
export class OpaqueColour {
    colour; // the hex code of the colour (if found in the colour map), else the name
    colourName; // the name of the colour
    opacity = 1; // the opacity - from a value of 0 to 1
    definition; // The definition which is the colour name % opacity (from 0 to 100)
    constructor(colourMap, colour) {
        if (colourMap === null) {
            colourMap = new Map();
        }
        const splits = colour.split("%");
        this.colourName = splits[0];
        switch (splits.length) {
            case 2:
                if (colourMap.get(splits[0])) {
                    this.colour = colourMap.get(splits[0]);
                }
                else {
                    this.colour = splits[0];
                }
                let opacityTemp = parseInt(splits[1]);
                if (opacityTemp > 1) {
                    this.opacity = opacityTemp / 100;
                }
                else {
                    this.opacity = opacityTemp;
                }
                break;
            case 1:
                if (colourMap.get(splits[0])) {
                    this.colour = colourMap.get(splits[0]);
                }
                else {
                    this.colour = splits[0];
                }
                break;
            default:
                this.colour = colour;
        }
        this.definition = this.colourName + "%" + this.opacity * 100;
    }
}
__decorate([
    JsonProperty({ name: "colour", required: true }),
    __metadata("design:type", String)
], OpaqueColour.prototype, "colour", void 0);
//# sourceMappingURL=OpaqueColour.js.map