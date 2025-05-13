import {Pencil} from "../model/Pencil.ts";
import PDFDocument from 'pdfkit';
import fs from "fs";
import { imageSize } from 'image-size'

enum FontFamily {
	HEADING_LARGE,
	HEADING_MEDIUM,
	HEADING_SMALL,
	HEADING_TINY,
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
				top: 2.5/2.54 * 72,
				bottom: 3.5/2.54 * 72,
				left: 1.5/2.54 * 72,
				right: 1.5/2.54 * 72
			},
			bufferPages: true
		});
		doc.pipe(fs.createWriteStream(outputFile));

		// let pageNumber: number = 1;
		// doc.on('pageAdded', (): void => {
		// 	this.addFooter(pageNumber, doc);
		// 	this.addHeader(doc);
		// 	pageNumber++;
		// });

		this.setFontFamily(doc, FontFamily.HEADING_LARGE);
		doc.text(`${this.pencil.brand}`);
		doc.text(`${this.pencil.model} ${(this.pencilFileDirectory.modelNumber ? "(" + this.pencilFileDirectory.modelNumber + ")" : "")}`);

		this.setFontFamily(doc, FontFamily.HEADING_MEDIUM);
		doc.text("").moveDown(1);
		doc.moveTo(doc.page.margins.left, doc.y)
			.lineTo(doc.page.width - doc.page.margins.right, doc.y)
			.lineCap("butt")
			.lineWidth(6)
			.stroke("#000000");

		doc.text("").moveDown(1);

		doc.text("Datasheet");
		doc.text('').moveDown(1);

		this.setFontFamily(doc, FontFamily.PARAGRAPH);
		doc.text('').moveDown();

		this.centreImage(doc,
			`./output/png/technical/${this.pencilFileDirectory}/${this.pencilFileName}.png`,
			500);

		doc.text("").moveDown(2);

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
				if(i % 2 === 1) {
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
					` (height)\n` +
					`${(Math.round((this.pencil.totalLength/5) * 100) / 100).toFixed(2)}mm` +
					` (length)`
				],
				[ "Materials", `${this.pencil.materials.join("\n")}` ],
				[ `Colour variants\nbased on the \n${this.pencil.colourComponent} colour`, `${this.pencil.colourComponents.join("\n")}` ],
			]
		});

		doc.addPage();

		this.setFontFamily(doc, FontFamily.HEADING_SMALL);
		doc.text("Components");
		doc.text('').moveDown(1);

		this.centreImage(doc, `./output/png/technical/${this.pencilFileDirectory}/${this.pencilFileName}-components.png`, 500);

		doc.text("").moveDown(2);
		this.setFontFamily(doc, FontFamily.PARAGRAPH);

		// now for the component
		let componentData:any[][] = [];
		componentData.push([ "", "", "", { colSpan: 2, text: "Height", align: "center" }, { colSpan: 2, text: "Width", align: "center" } ]);
		componentData.push([ "Component", "Material", "Length", "Max.", "Min", "Max.", "Min" ]);
		for(const [index, component ] of this.pencil.components.entries()) {
			let componentInner:any[] = [];
			componentInner.push({ text: component.type, align: "center" });
			componentInner.push({ text: component.materials.join("\n"), align: "center" });
			componentInner.push({ text: `${(Math.round((component.width) * 100) / 100).toFixed(2)} mm`, align: "center" });

			componentData.push(componentInner);
		}
		// @ts-ignore
		doc.table({
			columnStyles: (i) => {
				if(i === 0) {
					return({ width: 80, textColor: "black", align: "right", font: { src: "./fonts/LibreBaskerville-Bold.ttf" }} );
				} else {
					return({ width: "*" });
				}
			},
			rowStyles: (i) => {
				if(i === 0) {
					return({ border: [1, 0, 0, 0], borderColor: "#aaa", backgroundColor: "#cfcfcf", font: { src: "./fonts/LibreBaskerville-Bold.ttf" }} );
				}

				if(i === 1) {
					return({ border: [0, 0, 1, 0], borderColor: "#aaa", backgroundColor: "#cfcfcf", align: "center", font: { src: "./fonts/LibreBaskerville-Bold.ttf" }} );
				}

				if(i % 2 === 0) {
					return({ border: [1, 0, 1, 0], borderColor: "#aaa" } );
				} else {
					return({ border: [1, 0, 1, 0], borderColor: "#aaa", backgroundColor: "#efefef" } );
				}
			},
			data: componentData
		});
		doc.text("").moveDown(2);
		// @ts-ignore
		doc.addPage();

		this.setFontFamily(doc, FontFamily.HEADING_SMALL);
		doc.text("Colour variants");
		doc.text('').moveDown(1);

		this.setFontFamily(doc, FontFamily.PARAGRAPH);
		let data:string[][] = [];
		data.push(["Colour", "SKU"]);
		for(const [index, colourComponent ] of this.pencil.colourComponents.entries()) {
			let colourData:string[] = [];
			colourData.push(colourComponent);
			if(this.pencil.skus[index]) {
				colourData.push(this.pencil.skus[index]);
			} else {
				colourData.push("not recorded");
			}
			data.push(colourData);
		}
		// @ts-ignore
		doc.table({
			columnStyles: (i) => {
				if(i % 2 == 1) {
					return({ width: "*", textColor: "black"} );
				} else {
					return({ width: 140, align: "right", font: { src: "./fonts/LibreBaskerville-Bold.ttf" }});
				}
			},
			rowStyles: (i) => {
				if(i === 0) {
					return({ border: [1, 0, 1, 0], borderColor: "#aaa", backgroundColor: "#cfcfcf", font: { src: "./fonts/LibreBaskerville-Bold.ttf" }} );
				}

				if(i % 2 === 0) {
					return({ border: [1, 0, 1, 0], borderColor: "#aaa" } );
				} else {
					return({ border: [1, 0, 1, 0], borderColor: "#aaa", backgroundColor: "#efefef" } );
				}
			},
			data: data
		});
		doc.text("").moveDown(2);


		for(const [index, colourComponent ] of this.pencil.colourComponents.entries()) {
			this.setFontFamily(doc, FontFamily.HEADING_TINY);
			doc.text(`Colour for ${this.pencil.colourComponent} - ${colourComponent}`, { align: "center"} );

			this.centreImage(doc,
				`./output/png/pencil/${this.pencilFileDirectory}/${this.pencilFileName}-colour-${colourComponent}.png`,
				400);
			doc.text('').moveDown(2);

			this.setFontFamily(doc, FontFamily.PARAGRAPH);
		}

		doc.addPage({
			size: 'A3',
			layout: 'landscape',
			margins: {
				top: 1.5/2.54 * 72,
				bottom: 3.5/2.54 * 72,
				left: 1.5/2.54 * 72,
				right: 1.5/2.54 * 72
			},
			bufferPages: true
		});
		this.setFontFamily(doc, FontFamily.HEADING_LARGE);
		doc.text("Technical Drawing").moveDown(1);
		doc.image(`./output/png/technical/${this.pencilFileDirectory}/${this.pencilFileName}.png`,
			doc.x,
			doc.y,
			{ scale: 0.73 }
		);
		this.writeHeaderAndFooter(doc);
		doc.end();
	}

	private addHeader(doc:typeof PDFDocument): void {
		this.setFontFamily(doc, FontFamily.FOOTER_COPYRIGHT)
		doc.text(`${this.pencil.brand} - ${this.pencil.model}`, doc.page.margins.left, 20, { align: "right" });
		doc.moveTo(doc.page.margins.left, doc.page.margins.top -5)
			.lineCap("butt")
			.lineWidth(1)
			.lineTo(doc.page.width - doc.page.margins.right, doc.page.margins.top - 5)
			.stroke("#5f5f5f");

		doc.moveTo(doc.page.margins.left, doc.page.margins.top - 4)
			.lineCap("butt")
			.lineWidth(1)
			.lineTo(doc.page.width - doc.page.margins.right, doc.page.margins.top - 4)
			.stroke("#afafaf");
	}

	private addFooter(pageNumber: number, doc:typeof PDFDocument): void {
		const footerStartY = doc.page.height - doc.page.margins.bottom + 10;
		let bottom = doc.page.margins.bottom;
		doc.moveTo(doc.page.margins.left, footerStartY)
			.lineCap("butt")
			.lineWidth(1)
			.lineTo(doc.page.width - doc.page.margins.right, footerStartY)
			.stroke("#afafaf");
		doc.moveTo(doc.page.margins.left, footerStartY +1)
			.lineCap("butt")
			.lineWidth(1)
			.lineTo(doc.page.width - doc.page.margins.right, footerStartY +1)
			.stroke("#5f5f5f");

		doc.page.margins.bottom = 0;

		this.setFontFamily(doc, FontFamily.HEADING_TINY)

		doc.text(
				'Page ' + pageNumber,
				0.5 * (doc.page.width - 100),
				footerStartY + 10,
				{
					width: 100,
					align: 'center',
					lineBreak: false,
				})


		this.setFontFamily(doc, FontFamily.FOOTER_COPYRIGHT);
		doc.text('').moveDown(1);
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
			case FontFamily.HEADING_TINY:
				pdfDocument.fontSize(14);
				pdfDocument.font("./fonts/LibreBaskerville-Bold.ttf");
				break;
			case FontFamily.PARAGRAPH:
				pdfDocument.fontSize(10);
				pdfDocument.font("./fonts/LibreBaskerville-Regular.ttf");
				break;
			case FontFamily.FOOTER_COPYRIGHT:
				pdfDocument.fontSize(10);
				pdfDocument.font("./fonts/LibreBaskerville-Italic.ttf");
				break;
		}
	}

	private centreImage(pdfDocument: typeof PDFDocument, imageLocation: string, width: number): void {
		const buffer = fs.readFileSync(imageLocation);
		const dimensions = imageSize(buffer);
		const imageWidth = dimensions.width;
		const imageHeight = dimensions.height;

		const drawableWidth: number = pdfDocument.page.width - pdfDocument.page.margins.left - pdfDocument.page.margins.right;

		pdfDocument.image(imageLocation,
			pdfDocument.x + ((drawableWidth - width)/2),
			pdfDocument.y,
			{ width: width });
		const moveDown: number = width/imageWidth * imageHeight
		pdfDocument.y = pdfDocument.y + moveDown;
	}

	private drawDebugging(pdfDocument: typeof PDFDocument): void {
	}

	private writeHeaderAndFooter(pdfDocument: typeof PDFDocument): void {
		let pages = pdfDocument.bufferedPageRange();
		for (let i = 0; i < pages.count; i++) {
			pdfDocument.switchToPage(i);
			if(i !== 0) {
				this.addHeader(pdfDocument);
			}

			this.addFooter(i + 1, pdfDocument);
		}
	}
}