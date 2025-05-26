import { SVGRenderer } from "../SVGRenderer.ts";
/**
 * Render a single pencil
 */
export class SVGPencilRenderer extends SVGRenderer {
    constructor(pencil) {
        super(pencil, 1000, 200, "SVGPencilRenderer");
    }
    /**
     * <p>Generate the SVG as a string with the colour</p>
     *
     * @param colourIndex the pencil colour index
     *
     * @returns {string} The SVG data as a String
     */
    render(colourIndex) {
        // start
        let svgString = super.getSvgStart(true);
        // now it is time to render the details of the pencil
        svgString += super.renderSideComponents(this._width / 2 - (this.pencil.totalLength * 5 / 2), this._height / 2, colourIndex);
        // end the end of the SVG
        svgString += super.getSvgEnd();
        return (svgString);
    }
}
//# sourceMappingURL=SVGPencilRenderer.js.map