import {Pencil} from "../model/Pencil.ts";
import PDFDocument from 'pdfkit';
import fs from "fs";
import { imageSize } from 'image-size'

enum FontFamily {
	HEADING_LARGE,
	HEADING_MEDIUM,
	HEADING_SMALL,
	PARAGRAPH,
	FOOTER_COPYRIGHT

}

export class PDFDatasheetRenderer {
	private pencil: Pencil;
	private pencilFileName;
	private pencilFileDirectory;

	constructor(pencil: Pencil, pencilFileDirectory: string, pencilFileName: string) {
		this.pencil = pencil;
		this.pencilFileName = pencilFileName;
		this.pencilFileDirectory = pencilFileDirectory;
	}

	render(outputFile:string): void {
		let doc:typeof PDFDocument = new PDFDocument({
			size: 'A4',
			margins: {
				top: 1.5/2.54 * 72,
				bottom: 3.5/2.54 * 72,
				left: 2.5/2.54 * 72,
				right: 1.5/2.54 * 72
			}
		});
		doc.pipe(fs.createWriteStream(outputFile));

		let pageNumber: number = 1;
		doc.on('pageAdded', (): void => {
			this.addFooter(pageNumber, doc);
			pageNumber++;
		});

		this.setFontFamily(doc, FontFamily.HEADING_LARGE);
		doc.text("Datasheet");

		this.setFontFamily(doc, FontFamily.HEADING_MEDIUM);
		doc.text(`    ${this.pencil.brand}`);
		doc.text(`    ${this.pencil.model} ${(this.pencilFileDirectory.modelNumber ? "(" + this.pencilFileDirectory.modelNumber + ")" : "")}`);

		this.setFontFamily(doc, FontFamily.PARAGRAPH);
		doc.text('').moveDown();
		// now for the overall table
		// @ts-ignore
		doc.table({
			columnStyles: (i) => {
				if(i % 2 == 0) {
					return({ width: 140, textColor: "black", align: "right", font: { src: "./fonts/LibreBaskerville-Bold.ttf" }} );
				} else {
					return({ width: "*" });
				}
			},
			rowStyles: (i) => {
				if(i % 2 === 0) {
					return({ border: [1, 0, 1, 0], borderColor: "#aaa" } );
				} else {
					return({ border: [1, 0, 1, 0], borderColor: "#aaa", backgroundColor: "#efefef" } );
				}
			},
			data: [
				[ "Brand", this.pencil.brand ],
				[ "Model", this.pencil.model ],
				[
					"Dimensions",
					`${(Math.round((this.pencil.maxWidth) * 100) / 100).toFixed(2)}mm` +
					` (width)\n` +
					`${(Math.round((this.pencil.maxHeight) * 100) / 100).toFixed(2)}mm` +
					` (height)\n ` +
					`${(Math.round((this.pencil.totalLength/5) * 100) / 100).toFixed(2)}mm` +
					` (length)`
				],
				[ "Materials", `${this.pencil.materials.join("\n")}` ],
				[ "Colour variants", `${this.pencil.colourComponents.join("\n")}` ],
			]
		});
		doc.text("").moveDown(2);

		doc.image(`./output/png/technical/${this.pencilFileDirectory}/${this.pencilFileName}.png`,
			doc.x,
			doc.y,
			{ fit: [480, 200], align:"center", valign:"center" })

		this.addFooter(pageNumber, doc);
		pageNumber++;

		doc.addPage();

		this.setFontFamily(doc, FontFamily.HEADING_LARGE);
		doc.text(`${this.pencil.brand} - ${this.pencil.model}`);
		this.setFontFamily(doc, FontFamily.HEADING_MEDIUM);
		doc.text("Colour variants");

		for(const colourComponent of this.pencil.colourComponents) {
			this.setFontFamily(doc, FontFamily.HEADING_SMALL);
			doc.text(colourComponent, { align: "center" });
			const buffer = fs.readFileSync(`./output/png/pencil/${this.pencilFileDirectory}/${this.pencilFileName}-colour-${colourComponent}.png`);
			const dimensions = imageSize(buffer);
			const width = dimensions.width*0.5;
			const height = dimensions.height*0.5;
			doc.image(`./output/png/pencil/${this.pencilFileDirectory}/${this.pencilFileName}-colour-${colourComponent}.png`,
				{ fit: [ width, height ], align:"center", valign:"center" })
			;
		}
		doc.end();
	}


	private addFooter(pageNumber: number, doc:typeof PDFDocument): void {
		const footerStartY = doc.page.height - doc.page.margins.bottom + 10;
		let bottom = doc.page.margins.bottom;

		doc.page.margins.bottom = 0;

		this.setFontFamily(doc, FontFamily.HEADING_SMALL)

		doc.text(
				'Page ' + pageNumber,
				0.5 * (doc.page.width - 100),
				footerStartY,
				{
					width: 100,
					align: 'center',
					lineBreak: false,
				})


		this.setFontFamily(doc, FontFamily.FOOTER_COPYRIGHT);
		doc.text("Copyright (c) // The Mechanical Pencil Database (tmpdb)",
				doc.page.margins.left,
				doc.y,
				{align: "center"}
		);
		doc.text("Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International",
			doc.page.margins.left,
			doc.y,
			{align: "center"}
		);

		doc.page.margins.bottom = bottom;
		doc.text('', doc.page.margins.left, doc.page.margins.top);

	}

	private setFontFamily(pdfDocument: typeof PDFDocument, fontFamily: FontFamily): void {
		switch(fontFamily) {
			case FontFamily.HEADING_LARGE:
				pdfDocument.fontSize(36);
				pdfDocument.font("./fonts/LibreBaskerville-Bold.ttf");
				break;
			case FontFamily.HEADING_MEDIUM:
				pdfDocument.fontSize(24);
				pdfDocument.font("./fonts/LibreBaskerville-Bold.ttf");
				break;
			case FontFamily.HEADING_SMALL:
				pdfDocument.fontSize(18);
				pdfDocument.font("./fonts/LibreBaskerville-Bold.ttf");
				break;
			case FontFamily.PARAGRAPH:
				pdfDocument.fontSize(12);
				pdfDocument.font("./fonts/LibreBaskerville-Regular.ttf");
				break;
			case FontFamily.FOOTER_COPYRIGHT:
				pdfDocument.font("./fonts/LibreBaskerville-Regular.ttf");
				break;
		}
	}

	private drawDebugging(pdfDocument: typeof PDFDocument): void {


	}
}