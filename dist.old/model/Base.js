import { OpaqueColour } from "./OpaqueColour.ts";
export class Base {
    static OPACITY_COLOUR_WHITE = new OpaqueColour(new Map(), "white");
    opacityColours = [];
    backgroundOpacityColours = [];
    mergedColours = [];
    mergeOpacityColours(colours, baseColours, colourMap) {
        let mergedColours;
        if (colours === undefined || colours.length === 0) {
            mergedColours = baseColours;
        }
        else {
            mergedColours = colours;
        }
        for (const mergedColour of mergedColours) {
            let opaqueColour = new OpaqueColour(colourMap, mergedColour);
            this.opacityColours.push(opaqueColour);
            this.mergedColours.push(opaqueColour.definition);
        }
    }
    mergeBackgroundOpacityColours(colours, baseColours, colourMap) {
        let mergedColours;
        if (colours === undefined || colours.length === 0) {
            mergedColours = baseColours;
        }
        else {
            mergedColours = colours;
        }
        for (const mergedColour of mergedColours) {
            this.backgroundOpacityColours.push(new OpaqueColour(colourMap, mergedColour));
        }
    }
    getOpacityColour(colourIndex) {
        if (colourIndex === -1) {
            return (Base.OPACITY_COLOUR_WHITE);
        }
        if (this.opacityColours.length === 1) {
            return (this.opacityColours[0]);
        }
        return (this.opacityColours[colourIndex]);
    }
    getBackgroundOpacityColour(colourIndex) {
        if (null === this.backgroundOpacityColours || this.backgroundOpacityColours.length == 0) {
            return (this.getOpacityColour(colourIndex));
        }
        if (colourIndex === -1) {
            return (Base.OPACITY_COLOUR_WHITE);
        }
        if (this.backgroundOpacityColours.length === 1) {
            return (this.backgroundOpacityColours[0]);
        }
        return (this.backgroundOpacityColours[colourIndex]);
    }
}
//# sourceMappingURL=Base.js.map