import { SVGRenderer } from "../SVGRenderer.ts";
import { lineHorizontalGuide, lineVerticalGuide } from "../../../utils/svg-helper.ts";
export class SVGTechnicalRenderer extends SVGRenderer {
    SVG_WIDTH = 1500;
    SVG_HEIGHT = 600;
    constructor(pencil) {
        super(pencil, 1500, 600, "SVGTechnicalRenderer");
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
        let svgString = this.getSvgStart();
        // centre line for the entire pencil
        svgString += super.renderCentreLineHorizontal(this.SVG_HEIGHT / 2);
        // centre line for the side view
        svgString += super.renderCentreLineVertical(this.SVG_WIDTH / 2, 90, 90);
        // centre line for the front view
        svgString += super.renderCentreLineVertical(160, 150, 90);
        // centre line for the back view
        svgString += super.renderCentreLineVertical(this.SVG_WIDTH - 100, 150, 90);
        // overview text
        svgString += super.renderOverviewText();
        // colours
        svgString += super.renderPencilColours();
        // materials used
        svgString += super.renderMaterialList();
        // first up the grey guidelines
        svgString += this.renderGuidelinesFull();
        // render the section titles (front/side/back)
        svgString += super.renderSectionTitles();
        // now we get into the dimensions
        // render the front dimensions
        svgString += super.renderFrontDimensions(160, this.SVG_HEIGHT / 2);
        //render the side dimensions
        svgString += super.renderSideDimensions((this._width - this.pencil.totalLength * 5) / 2, this.SVG_HEIGHT / 2);
        // render the back dimensions
        svgString += super.renderBackDimensions(this.SVG_WIDTH - 150, this.SVG_HEIGHT / 2);
        svgString += super.renderTotalLengthDimensions();
        //render the side materials
        svgString += super.renderSideMaterials();
        // now it is time to render the details of the pencil
        svgString += super.renderSideComponents(this._width / 2 - (this.pencil.totalLength * 5 / 2), this.SVG_HEIGHT / 2, colourIndex);
        svgString += super.renderFrontComponents(160, this.SVG_HEIGHT / 2, colourIndex);
        svgString += super.renderBackComponents(this.SVG_WIDTH - 100, this.SVG_HEIGHT / 2, colourIndex);
        // end the end of the SVG
        svgString += this.getSvgEnd();
        return (svgString);
    }
    renderGuidelinesFull() {
        let svgString = "";
        // now we are going to go through each of the components and draw the shapes
        let offset;
        let hasExtra = false;
        // now for the extra side components guidelines
        for (let component of this.pencil.components) {
            for (const extra of component.extras) {
                // draw the straight-through line for guidance top of the extra parts
                const y = this.SVG_HEIGHT / 2 - extra.yOffset * 5 - (extra.height) * 5;
                svgString += lineHorizontalGuide(100, y, this.SVG_WIDTH - 200);
                // draw the straight-through line for guidance bottom of the extra parts
                svgString += lineHorizontalGuide(160, this.SVG_HEIGHT / 2 - extra.yOffset * 5, this.SVG_WIDTH - 260);
                // guidelines for the extra width - left side
                svgString += lineVerticalGuide(160 - extra.depth / 2 * 5, this.SVG_HEIGHT / 2 - 70, 70);
                // guidelines for the extra width - right side
                svgString += lineVerticalGuide(160 + extra.depth / 2 * 5, this.SVG_HEIGHT / 2 - 70, 70);
                hasExtra = true;
            }
        }
        // FRONT VIEW GUIDELINES
        // top horizontal line
        svgString += lineHorizontalGuide((hasExtra ? 160 : 100), this.SVG_HEIGHT / 2 - this.pencil.maxHeight / 2 * 5, this.SVG_WIDTH - 100 - (hasExtra ? 160 : 100));
        // bottom line of full pencil
        svgString += lineHorizontalGuide(100, this.SVG_HEIGHT / 2 + this.pencil.maxHeight / 2 * 5, this.SVG_WIDTH - 200);
        // Vertical line of width - left
        svgString += lineVerticalGuide(160 - this.pencil.maxWidth / 2 * 5, this.SVG_HEIGHT / 2, 20 + this.pencil.maxHeight / 2 * 5);
        // Vertical line of width - right
        svgString += lineVerticalGuide(160 + this.pencil.maxWidth / 2 * 5, this.SVG_HEIGHT / 2, 20 + this.pencil.maxHeight / 2 * 5);
        // SIDE VIEW GUIDELINES FOR THE COMPONENTS
        // reset the offset to redraw
        offset = this.SVG_WIDTH / 2 - this.pencil.totalLength * 5 / 2;
        for (let component of this.pencil.components) {
            // vertical line
            svgString += lineVerticalGuide(offset, this.SVG_HEIGHT / 2 - 120, 240);
            // now for extraParts
            for (const extra of component.extras) {
                svgString += lineVerticalGuide(offset + extra.xOffset * 5, this.SVG_HEIGHT / 2 - 80, 160);
                svgString += lineVerticalGuide(offset + extra.xOffset * 5 + extra.length * 5, this.SVG_HEIGHT / 2 - 80, 160);
            }
            offset += component.length * 5;
        }
        svgString += lineVerticalGuide(offset, this.SVG_HEIGHT / 2 - 88 - this.pencil.maxHeight / 2 * 5, 208);
        return (svgString);
    }
}
//# sourceMappingURL=SVGTechnicalRenderer.js.map