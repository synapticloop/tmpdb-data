import { Part } from "./Part.ts";
export class Component {
    parts = [];
    materials = [];
    colours = ["white"];
    type = "unknown";
    // the length of the component - which is when you are looking at it
    // sideways...
    length = 0;
    // the width
    maxWidth = 0;
    minWidth = 0;
    maxHeight = 0;
    minHeight = 0;
    extraParts = [];
    extraPartFirst = false;
    constructor(jsonObject) {
        this.type = jsonObject.type ?? this.type;
        if (jsonObject.material) {
            this.materials.length = 0;
            this.materials.push(jsonObject.material);
        }
        else {
            this.materials.push("unknown");
        }
        this.colours = jsonObject.colours ?? this.colours;
        if (jsonObject.parts) {
            let isFirst = true;
            for (let part of jsonObject.parts) {
                const thisPart = new Part(part, this.colours);
                this.parts.push(thisPart);
                this.length += thisPart.length;
                if (part.material) {
                    this.materials.push(part.material);
                }
                if (part.colours) {
                    for (const colour of part.colours) {
                        this.colours.push(colour);
                    }
                }
                if (thisPart.extraParts.length > 0) {
                    this.extraParts.push(thisPart);
                    if (isFirst) {
                        this.extraPartFirst = true;
                    }
                }
                isFirst = false;
                let tempMaxWidth = thisPart.getMaxWidth();
                if (tempMaxWidth >= this.maxWidth) {
                    this.maxWidth = tempMaxWidth;
                }
                let tempMinWidth = thisPart.getMinWidth();
                if (tempMinWidth >= this.minWidth) {
                    this.minWidth = tempMinWidth;
                }
                let tempMaxHeight = thisPart.getMaxHeight();
                if (tempMaxHeight >= this.maxHeight) {
                    this.maxHeight = tempMaxHeight;
                }
                let tempMinHeight = thisPart.getMinHeight();
                if (tempMinHeight >= this.minHeight) {
                    this.minHeight = tempMinHeight;
                }
            }
        }
    }
    getMaxHeight() {
        return (this.maxHeight);
    }
    getMaxWidth() {
        return (this.maxWidth);
    }
    getType() {
        return (this.type);
    }
    getExtraParts() {
        return (this.extraParts);
    }
}
//# sourceMappingURL=Component.js.map