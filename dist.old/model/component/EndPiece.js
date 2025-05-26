/**
 * The end piece for the
 *
 * @module EndPiece
 */
export class EndPiece {
    /**
     *
     * @param jsonObject The json object for the end piece
     */
    constructor(jsonObject) {
        var _a, _b, _c;
        this.fill = "black";
        this.type = (_a = jsonObject.type) !== null && _a !== void 0 ? _a : this.type;
        const dimensionsTemp = (_b = jsonObject.dimensions) !== null && _b !== void 0 ? _b : "";
        for (const dimension of dimensionsTemp.split("x")) {
            this.dimensions.push(parseFloat(dimension));
        }
        this.fill = (_c = jsonObject.fill) !== null && _c !== void 0 ? _c : this.fill;
    }
}
//# sourceMappingURL=EndPiece.js.map