export class OpenSCADRenderer {
    pencil;
    constructor(pencil) {
        this.pencil = pencil;
    }
    render() {
        let scadString = "rotate([90, 0, 0]) {\n";
        let x = 0;
        for (const [index, component] of this.pencil.components.entries()) {
            for (const part of component.parts) {
                scadString += `translate([0, 0, ${x}]) \n`;
                scadString += `  color("${component.colours[0]}") \n`;
                switch (part.type) {
                    case "cylinder":
                        scadString += `    cylinder(${part.length}, ${part.startHeight}, ${part.endHeight}, $fn=360);\n`;
                        x = x + part.length;
                        break;
                    case "hexagonal":
                        scadString += `    cylinder(${part.length}, ${part.startHeight}, ${part.endHeight}, $fn=6, false);\n`;
                        x = x + part.length;
                        break;
                }
            }
        }
        scadString += `}\n`;
        return (scadString);
    }
}
//# sourceMappingURL=OpenSCADRenderer.js.map