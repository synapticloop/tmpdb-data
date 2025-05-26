export class MDRenderer {
    pencil;
    pencilFileName;
    constructor(pencil, pencilFileName) {
        this.pencil = pencil;
        this.pencilFileName = pencilFileName;
    }
    render() {
        let mdString = "";
        mdString += `# ${this.pencil.brand} // ${this.pencil.modelName} ${this.pencil.leadSize} mm\n\n`;
        mdString += `## Model #: ${this.pencil.modelNumber}\n\n`;
        // image for the overview
        mdString += `<img src="./${this.pencilFileName}-grouped.png">\n\n`;
        mdString += `## Pencil Information\n\n`;
        mdString += "|     |     |\n";
        mdString += "| ---: | :--- |\n";
        mdString += this.addTableRow("Brand", this.pencil.brand);
        mdString += this.addTableRow("Model name", this.pencil.modelName);
        mdString += this.addTableRow("Model number", this.pencil.modelNumber);
        mdString += this.addTableRow("Mechanism", this.pencil.mechanism);
        mdString += this.addTableRow("Lead size", this.pencil.leadSize);
        mdString += this.addTableRow("Lead shape", this.pencil.leadShape);
        mdString += this.addTableRow("Maximum lead length", this.pencil.maximumLeadLength);
        return (mdString);
    }
    addTableRow(item, value) {
        return (`| **${item}** | ${value} |\n`);
    }
}
//# sourceMappingURL=MDIndividualRenderer.js.map