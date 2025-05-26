import { SVGRenderer } from "../SVGRenderer.ts";
/**
 * Render a single pencil rotated at an angle of -45 degrees
 */
export class SVGPencil45Renderer extends SVGRenderer {
    // TODO - put into the super class
    SVG_WIDTH = 1000;
    SVG_HEIGHT = 1000;
    constructor(pencil) {
        super(pencil, 1000, 1000, "SVGPencil45Renderer");
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
        let svgString = super.getSvgStart(false, -45);
        // now it is time to render the details of the pencil
        svgString += super.renderSideComponents(this._width / 2 - (this.pencil.totalLength * 5 / 2), this._height / 2, -1);
        // end the end of the SVG
        svgString += super.getSvgEnd();
        return (svgString);
    }
}
//# sourceMappingURL=SVGPencil45Renderer.js.map