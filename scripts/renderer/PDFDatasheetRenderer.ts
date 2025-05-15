import {Pencil} from "../model/Pencil.ts";
import PDFDocument from 'pdfkit';
import fs from "fs";
import { imageSize } from 'image-size'

import { formatToTwoPlaces} from "../utils/formatter.ts";

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
	private pencilFileName: string;
	private pencilFileDirectory: string;
	private pageTitles: string[] = [];
	private currentPageTitle: string;

	constructor(pencil: Pencil, pencilFileDirectory: string, pencilFileName: string) {
		this.pencil = pencil;
		this.pencilFileName = pencilFileName;
		this.pencilFileDirectory = pencilFileDirectory;
	}

	render(outputFile:string): void {
		let doc:typeof PDFDocument = new PDFDocument({
			size: 'A4',
			margins: {
				top: 3.5/2.54 * 72,
				bottom: 3.5/2.54 * 72,
				left: 1.5/2.54 * 72,
				right: 1.5/2.54 * 72
			},
			bufferPages: true
		});

		doc.pipe(fs.createWriteStream(outputFile));

		doc.on('pageAdded', (): void => {
			this.pageTitles.push(this.currentPageTitle)
		});

		this.renderFrontPage(doc);

		this.renderComponentsPage(doc);

		this.renderColourVariantsPage(doc);

		this.renderTechnicalDrawing(doc);

		this.appendHeaderAndFooter(doc);

		doc.end();
	}

	private renderFrontPage(doc: typeof PDFDocument): void {
		doc.y = doc.y - 30;
		this.setFontFamily(doc, FontFamily.HEADING_LARGE);
		doc.text(`${this.pencil.brand}`);
		doc.text(`${this.pencil.model} ${(this.pencil.modelNumber ? "(" + this.pencil.modelNumber + ")" : "")}`);

		this.setFontFamily(doc, FontFamily.HEADING_MEDIUM);
		doc.text("").moveDown(1);
		doc.moveTo(doc.page.margins.left, doc.y)
				.lineTo(doc.page.width - doc.page.margins.right, doc.y)
				.lineCap("butt")
				.lineWidth(6)
				.stroke("#000000");

		doc.text("").moveDown(1);

		this.pageTitles.push("Datasheet");

		doc.text("Datasheet");
		this.currentPageTitle = "Datasheet";

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
				[ "Lead size", `${this.pencil.leadSize} mm` ],
				[ "Text", `${this.pencil.text}` ],
				[ "Years available", `` ],
				[
					"Dimensions",
					`${formatToTwoPlaces(this.pencil.totalLength)} mm` +
					` (length)\n` +
					`${formatToTwoPlaces(this.pencil.maxWidth)} mm` +
					` (width)\n` +
					`${formatToTwoPlaces(this.pencil.maxHeight)} mm` +
					` (height)`
				],
				[ "Weight", `${(this.pencil.weight ? this.pencil.weight + " grams" : "")}` ],
				[ "Materials", `${this.pencil.materials.join("\n")}` ],
				[ `Colour variants`, `${this.pencil.colourComponents.join("\n")}` ],
				[ "Features", `` ],
			]
		});
	}

	private renderComponentsPage(doc: typeof PDFDocument): void {
		this.addPageWithTitle(doc, "Components");

		this.setFontFamily(doc, FontFamily.HEADING_SMALL);

		doc.text("Details").moveDown(1);
		this.centreImage(doc, `./output/png/technical/${this.pencilFileDirectory}/${this.pencilFileName}-components.png`, 500);

		doc.text("").moveDown(2);
		this.setFontFamily(doc, FontFamily.PARAGRAPH);

		// now for the component
		let componentData:any[][] = [];
		componentData.push([ "", "", "", { colSpan: 2, text: "Height", align: "center" }, { colSpan: 2, text: "Width", align: "center" } ]);
		componentData.push([ "Component", "Material", "Length", "Min.", "Max", "Min.", "Max." ]);
		for(const [index, component ] of this.pencil.components.entries()) {
			let componentInner:any[] = [];
			componentInner.push({ text: component.type, align: "right" });
			componentInner.push({ text: component.materials.join("\n"), align: "center" });
			componentInner.push({ text: `${formatToTwoPlaces(component.length)} mm`, align: "center", border: [ 1, 1, 1, 1 ], borderColor: "#aaa"});
			if(component.minHeight === component.maxHeight) {
				componentInner.push({ text: `${formatToTwoPlaces(component.minHeight)} mm`, align: "center", colSpan: 2, border: [ 1, 1, 1, 1 ], borderColor: "#aaa" });
			} else {
				componentInner.push({ text: `${formatToTwoPlaces(component.minHeight)} mm`, align: "center", border: [ 1, 1, 1, 1 ], borderColor: "#aaa" });
				componentInner.push({ text: `${formatToTwoPlaces(component.maxHeight)} mm`, align: "center", border: [ 1, 1, 1, 1 ], borderColor: "#aaa" });
			}

			if(component.maxWidth === component.minWidth) {
				componentInner.push({text: `${formatToTwoPlaces(component.minWidth)} mm`, align: "center", colSpan: 2, border: [ 1, 1, 1, 1 ], borderColor: "#aaa" });
			} else {
				componentInner.push({text: `${formatToTwoPlaces(component.minWidth)} mm`, align: "center", border: [ 1, 1, 1, 1 ], borderColor: "#aaa"});
				componentInner.push({text: `${formatToTwoPlaces(component.maxWidth)} mm`, align: "center", border: [ 1, 1, 1, 1 ], borderColor: "#aaa"});
			}

			componentData.push(componentInner);

			for(const extraPart of component.extraParts) {
				let componentExtra:any[] = [];
				componentExtra.push({ text: component.type + " (extra)", align: "right" });
				componentExtra.push({ text: component.materials.join("\n"), align: "center" });

				componentExtra.push({text: `${formatToTwoPlaces(extraPart.extraLength)} mm`, align: "center", border: [ 1, 1, 1, 1 ], borderColor: "#aaa"});
				componentExtra.push({text: `${formatToTwoPlaces(extraPart.extraHeight)} mm`, align: "center", colSpan: 2, border: [ 1, 1, 1, 1 ], borderColor: "#aaa" });
				componentExtra.push({text: `${formatToTwoPlaces(extraPart.extraWidth)} mm`, align: "center", colSpan: 2, border: [ 1, 1, 1, 1 ], borderColor: "#aaa" });

				componentData.push(componentExtra);
			}

		}
		componentData.push([
			{ colSpan: 2, text: "Total length", align: "right",  backgroundColor: "#cfcfcf" },
			{ text: `${formatToTwoPlaces(this.pencil.totalLength)} mm`,  backgroundColor: "#cfcfcf", font: { src: "./fonts/LibreBaskerville-Bold.ttf" }},
			{text: "", colSpan: 4,  backgroundColor: "#cfcfcf" }
		]);
		// @ts-ignore
		doc.table({
			columnStyles: (i) => {
				if(i === 0) {
					return({ width: 100, textColor: "black", align: "right", font: { src: "./fonts/LibreBaskerville-Bold.ttf" }} );
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

		doc.addPage();
		this.setFontFamily(doc, FontFamily.HEADING_SMALL);
		doc.text("Components (exploded)").moveDown(1);

		this.centreImage(doc, `./output/png/technical/${this.pencilFileDirectory}/${this.pencilFileName}-exploded.png`, 500);

	}

	private renderColourVariantsPage(doc: typeof PDFDocument): void {
		this.addPageWithTitle(doc, "Colour variants");

		this.setFontFamily(doc, FontFamily.PARAGRAPH);
		doc.text(`Variants are designated by the colour of the ${this.pencil.colourComponent}`).moveDown(2);

		let data:string[][] = [];
		data.push(["Colour", "SKU", "Render colour"]);
		for(const [index, colourComponent ] of this.pencil.colourComponents.entries()) {
			let colourData:string[] = [];
			colourData.push(colourComponent);
			if(this.pencil.skus[index]) {
				colourData.push(this.pencil.skus[index]);
			} else {
				colourData.push("not recorded");
			}

			let renderColour = this.pencil.colourMap[colourComponent];
			if(renderColour) {
				colourData.push(renderColour);
			} else {
				colourData.push(colourComponent);
			}
			data.push(colourData);
		}

		// @ts-ignore
		doc.table({
			columnStyles: (i) => {
				switch(i % 3) {
					case 0:
						return({ width: 140, align: "right", font: { src: "./fonts/LibreBaskerville-Bold.ttf" } } );
					case 1:
						return({ width: "140", textColor: "black"} );
					case 2:
						return({ width: "*", align: "left", textColor: "black", font: { src: "./fonts/Inconsolata-Medium.ttf" } } );
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
			this.setFontFamily(doc, FontFamily.HEADING_SMALL);

			doc.text(`${this.pencil.colourComponent} colour - ${colourComponent}`, { align: "center"} );

			this.centreImage(doc,
					`./output/png/pencil/${this.pencilFileDirectory}/${this.pencilFileName}-colour-${colourComponent}.png`,
					400);
			doc.text('').moveDown(1);

			this.setFontFamily(doc, FontFamily.PARAGRAPH);

			const componentData:any[] = [];
			componentData.push({ text: "Component", align: "right" });
			for(const component of this.pencil.components) {
				if(this.pencil.colourComponents.length != component.colours.length) {
					componentData.push({text: component.type, colSpan: component.colours.length, align: "center", valign: "top"});
				} else {
					componentData.push({text: component.type});
				}
			}

			componentData.push("");

			const colourData:any[] = [];
			colourData.push("Colour");
			for(const component of this.pencil.components) {
				// we have more colours than the number of components - meaning that
				// the parts also have an additional colour
				if(this.pencil.colourComponents.length != component.colours.length) {
					for(const partColour of component.colours) {
						let renderColour = this.pencil.colourMap[partColour];

						if (renderColour) {
							colourData.push({text: "", backgroundColor: renderColour, border: [1, 1, 1, 1], borderColor: "#aaa"});
						} else {
							colourData.push({
								text: "",
								backgroundColor: partColour,
								border: [1, 1, 1, 1],
								borderColor: "#aaa"
							});
						}
					}
				} else {
					let renderColour = this.pencil.colourMap[component.colours[index]];

					if (renderColour) {
						colourData.push({text: "", backgroundColor: renderColour, border: [1, 1, 1, 1], borderColor: "#aaa"});
					} else {
						colourData.push({
							text: "",
							backgroundColor: component.colours[index],
							border: [1, 1, 1, 1],
							borderColor: "#aaa"
						});
					}
				}
			}
			colourData.push("");
			const numColumns: number = colourData.length;

			const colourNameData:any[] = [];
			colourNameData.push("Colour name");
			for(const component of this.pencil.components) {
				if(this.pencil.colourComponents.length != component.colours.length) {
					colourNameData.push({text: component.colours.join("\n"), align: "center", colSpan: component.colours.length });
				} else {
					colourNameData.push({text: component.colours[index]});
				}
			}
			colourNameData.push("");

			const renderData:any[] = [];
			renderData.push("Render colour");
			for(const component of this.pencil.components) {
				if(this.pencil.colourComponents.length != component.colours.length) {

					let multiPartColours: string[] = [];

					for(const partColour of component.colours) {
						let renderColour = this.pencil.colourMap[partColour];

						if (renderColour) {
							multiPartColours.push(renderColour);
						} else {
							multiPartColours.push(partColour);
						}
					}

					renderData.push({text: multiPartColours.join("\n"), colSpan: component.colours.length, align:"center" });

				} else {
					let renderColour = this.pencil.colourMap[component.colours[index]];
					if (renderColour) {
						renderData.push({text: renderColour});
					} else {
						renderData.push({text: component.colours[index]});
					}
				}
			}
			renderData.push("");

			const headingData: any[] = [];
			headingData.push({ text: "Colours for individual components", colSpan: numColumns, align: "center", font: { size: 14, src: "./fonts/LibreBaskerville-Bold.ttf" } });

			// now a table for the components
			// @ts-ignore
			doc.table({
				columnStyles: (i) => {
					switch(i) {
						case 0:
							return({ width: "*", align: "right", font: { src: "./fonts/LibreBaskerville-Bold.ttf" } } );
						case numColumns - 1:
							return({ width: "*", align: "right" } );
						default:
							return({ width: 24, padding: 5, textOptions: { rotation: 90, valign: "center" }, textColor: "black", font: { src: "./fonts/Inconsolata-Medium.ttf" } } );
					}
				},
				rowStyles: (i) => {
					if(i === 4) {
						return({ border: [1, 0, 1, 0], align: "right", valign: "top", borderColor: "#aaa", backgroundColor: "#cfcfcf", font: { src: "./fonts/LibreBaskerville-Bold.ttf" }} );
					}

					if(i % 2 === 0) {
						return({ border: [1, 0, 1, 0], borderColor: "#aaa" } );
					} else {
						return({ border: [1, 0, 1, 0], borderColor: "#aaa", backgroundColor: "#efefef" } );
					}
				},
				data: [
					headingData,
					colourData,
					colourNameData,
					renderData,
					componentData
				]
			});

			doc.text('').moveDown(2);
			if(index === 0 && index !== this.pencil.colourComponents.length - 1) {
				doc.addPage();
			}
		}
	}

	private renderTechnicalDrawing(doc: typeof PDFDocument): void {
		this.currentPageTitle = "Technical Drawing";
		doc.addPage({
			size: 'A3',
			layout: 'landscape',
			margins: {
				top: 3.5/2.54 * 72,
				bottom: 3.5/2.54 * 72,
				left: 1.5/2.54 * 72,
				right: 1.5/2.54 * 72
			},
			bufferPages: true
		});

		this.centreImage(doc, `./output/png/technical/${this.pencilFileDirectory}/${this.pencilFileName}.png`, 1100)
	}

	private addPageWithTitle(doc: typeof PDFDocument, pageTitle: string): void {
		this.currentPageTitle = pageTitle;
		doc.addPage();
	}

	private addHeader(doc:typeof PDFDocument, pageNumber: number): void {
		this.setFontFamily(doc, FontFamily.HEADING_MEDIUM);
		if(pageNumber === 0) {
			return;
		} else {
			doc.text('').moveUp(2);

			const currentTitle: string = this.pageTitles[pageNumber];
			const previousTitle: string  = this.pageTitles[pageNumber -1];
			if(currentTitle === previousTitle) {
				doc.fillColor("black")
					.text(currentTitle, {continued: true})
					.font("./fonts/LibreBaskerville-Italic.ttf")
					.fontSize(12)
					.text(" (cont.)", { continued: true });
			} else {
				doc.fillColor("black")
					.text(currentTitle);
			}
		}

		this.setFontFamily(doc, FontFamily.FOOTER_COPYRIGHT)

		doc.fillColor("black")
			.text(`${this.pencil.brand} ` +
				`- ` +
				`${this.pencil.model} // ` +
				`${(this.pencil.modelNumber ? this.pencil.modelNumber : "")}`, doc.page.margins.left, 20, { align: "right" });

		doc.moveTo(doc.page.margins.left, doc.page.margins.top - 10)
			.lineCap("butt")
			.lineWidth(1)
			.lineTo(doc.page.width - doc.page.margins.right, doc.page.margins.top - 10)
			.stroke("#5f5f5f");

		doc.moveTo(doc.page.margins.left, doc.page.margins.top - 9)
			.lineCap("butt")
			.lineWidth(1)
			.lineTo(doc.page.width - doc.page.margins.right, doc.page.margins.top - 9)
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

		doc.fillColor("black")
			.text(
				'Page ' + pageNumber,
				0.5 * (doc.page.width - 100),
				footerStartY + 10,
				{
					width: 100,
					align: 'center',
					lineBreak: false,
				});


		this.setFontFamily(doc, FontFamily.FOOTER_COPYRIGHT);
		doc.text('').moveDown(1);
		doc.fillColor("black")
			.text("Copyright (c) // The Mechanical Pencil Database (tmpdb)",
				doc.page.margins.left,
				doc.y,
				{align: "center"}
		);

		doc.fillColor("black")
			.text("Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International",
			doc.page.margins.left,
			doc.y,
			{align: "center"}
		);

		doc.page.margins.bottom = bottom;
		doc.fillColor("black")
			.text('', doc.page.margins.left, doc.page.margins.top);
	}

	private setFontFamily(pdfDocument: typeof PDFDocument, fontFamily: FontFamily): void {
		pdfDocument.fillColor("black");
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

		const moveDown: number = width/imageWidth * imageHeight;

		let pageAdded: boolean = false;
		if(pdfDocument.y + moveDown > (pdfDocument.page.height - pdfDocument.page.margins.top - pdfDocument.page.margins.bottom)) {
			pdfDocument.addPage();
			pageAdded = true;
		}

		pdfDocument.image(imageLocation,
				pdfDocument.x + ((drawableWidth - width)/2),
				pdfDocument.y,
				{ width: width });
		if(!pageAdded) {
			pdfDocument.y = pdfDocument.y + moveDown;
		}
	}

	private appendHeaderAndFooter(pdfDocument: typeof PDFDocument): void {
		let pages = pdfDocument.bufferedPageRange();
		for (let i = 0; i < pages.count; i++) {
			pdfDocument.switchToPage(i);
			if(i !== 0) {
				this.addHeader(pdfDocument, i);
			}

			this.addFooter(i + 1, pdfDocument);
		}
	}
}