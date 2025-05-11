import {Pencil} from "../model/Pencil.ts";
import PDFDocument from 'pdfkit';
import fs from "fs";

export class PDFDatasheetRenderer {
	private pencil: Pencil;
	private static fontLibreBaskervilleBold = fs.readFileSync("./fonts/LibreBaskerville-Bold.ttf", "utf8");

	constructor(pencil: Pencil) {
		this.pencil = pencil;
	}

	render(outputFile:string): void {
		const doc:PDFDocument = new PDFDocument({
			size: 'A4',
			margins: {
				top: "1.5cm",
				bottom: "3.5cm",
				left: "2.5cm",
				right: "1.5cm"
			}
		});
		doc.pipe(fs.createWriteStream(outputFile));

		let pageNumber: number = 1;
		doc.on('pageAdded', (): void => {
			this.addFooter(pageNumber, doc);
			pageNumber++;
		});

		doc.fontSize(36);
		doc.font("./fonts/SmoochSans-Bold.ttf")
				.text(this.pencil.brand);

		doc.fontSize(24);
		doc.text(`${this.pencil.model}`);

		doc.font("./fonts/SmoochSans-Medium.ttf")
		doc.text(`${this.pencil.model}`);

		doc.image("./output/png/technical/ohto/sharp-pencil-2.0.png", { scale: 0.3, align:"center" , valign:"center" });
		this.addFooter(pageNumber, doc);
		pageNumber++;

		doc.addPage();
		doc.fontSize(24);
		doc.text(`${this.pencil.model}`);

		doc.font("./fonts/SmoochSans-Medium.ttf")
		doc.text(`${this.pencil.model}`);
		doc.end();
	}


	private addFooter(pageNumber: number, doc:PDFDocument): void {
		const footerStartY = doc.page.height - doc.page.margins.bottom + 10;
		let bottom = doc.page.margins.bottom;
		doc.page.margins.bottom = 0;
		let fontSize = doc.fontSize;

		doc.font("./fonts/SmoochSans-SemiBold.ttf");
		doc.fontSize(12);

		doc.text(
				'Page ' + pageNumber,
				0.5 * (doc.page.width - 100),
				footerStartY,
				{
					width: 100,
					align: 'center',
					lineBreak: false,
				})


		doc.text("Copyright (c) // The Mechanical Pencil Database (tmpdb) // Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International",
				doc.page.margins.left,
				doc.page.height - 30,
				{align: "center"}
		);

		doc.page.margins.bottom = bottom;
		doc.text('', doc.page.margins.left, doc.page.margins.top);
		doc.fontSize(fontSize);
		doc.rect(doc.page.margins.left,
				doc.page.margins.top,
				doc.page.width - doc.page.margins.right - doc.page.margins.left,
				doc.page.height - doc.page.margins.bottom - doc.page.margins.top).stroke();
	}

}