import {Pencil} from "../model/Pencil.ts";
import {PDFDocument} from 'pdfkit';
import fs from "fs";

export class PDFDatasheetRenderer {
	private pencil: Pencil;
	private static fontLibreBaskervilleBold = fs.readFileSync("./fonts/LibreBaskerville-Bold.ttf", "utf8");

	constructor(pencil: Pencil) {
		this.pencil = pencil;
	}

	render(outputFile:string): void {
		const doc = new PDFDocument({size: 'A4'});
		doc.pipe(fs.createWriteStream(outputFile));
		doc.addPage();
		doc.end();
	}
}