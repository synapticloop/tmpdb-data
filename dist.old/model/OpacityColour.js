export class OpacityColour {
    colour;
    opacity = 1;
    definition;
    constructor(colourMap, colour) {
        if (colourMap === null) {
            colourMap = {};
        }
        const splits = colour.split("%");
        switch (splits.length) {
            case 2:
                if (colourMap[splits[0]]) {
                    this.colour = colourMap[splits[0]];
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
                if (colourMap[splits[0]]) {
                    this.colour = colourMap[splits[0]];
                }
                else {
                    this.colour = splits[0];
                }
                break;
            default:
                this.colour = colour;
        }
        this.definition = this.colour + "%" + this.opacity;
    }
}
//# sourceMappingURL=OpacityColour.js.map