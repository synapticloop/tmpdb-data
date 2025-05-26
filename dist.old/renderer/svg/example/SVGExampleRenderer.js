import { SVGRenderer } from "../SVGRenderer.ts";
import { drawTextBoldCentred } from "../../../utils/svg-helper.ts";
/**
 * Render all the colour variants of a pencil
 */
export class SVGExampleRenderer extends SVGRenderer {
    SVG_WIDTH = 1000;
    SVG_HEIGHT = 200;
    constructor(pencil) {
        super(pencil, 1000, 600, "SVGExampleRenderer");
    }
    /**
     * <p>Generate the SVG as a string with the colour</p>
     *
     * @param colourIndex the pencil colour index
     *
     * @returns {string} The SVG data as a String
     */
    render(colourIndex) {
        // NOW GO THROUGH AND COUNT THE CLIPS
        super.resize(1000, 200 + this.pencil.components.length * 120);
        let svgString = super.getSvgStart();
        svgString += super.renderOverviewText(false);
        svgString += super.renderCentreLineVertical(this._width / 2);
        // svgString += super.renderCentreLineVertical(400);
        let midY = 180;
        for (const component of this.pencil.components) {
            svgString += drawTextBoldCentred(component.type, this._width / 2, midY - 60, "1.0em");
            // TODO - fix this and the component
            // svgString += super.renderComponent(this._width/2 + ((component.allLength + component.allOffset)/2 * 5), midY, component, colourIndex);
            svgString += super.renderComponent(this._width / 2 - component.length / 2 * 5, midY, component, colourIndex);
            midY += 120;
        }
        svgString += super.getSvgEnd();
        return (svgString);
    }
}
//# sourceMappingURL=SVGExampleRenderer.js.map