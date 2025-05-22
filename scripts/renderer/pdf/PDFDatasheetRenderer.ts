import {Pencil} from "../../model/Pencil.ts";
import PDFDocument, {rect} from 'pdfkit';
import fs from "fs";
import { imageSize } from 'image-size'

import { formatToTwoPlaces} from "../../utils/formatter.ts";
import {Part} from "../../model/Part.ts";
import {Component} from "../../model/Component.ts";

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
			this.pageTitles.push(this.currentPageTitle);
			// doc.rect(doc.page.margins.left,
			// 		doc.page.margins.top,
			// 		doc.page.width - doc.page.margins.left - doc.page.margins.right,
			// 		doc.page.height - doc.page.margins.top - doc.page.margins.bottom
			// 		)
			// 		.fill("none")
			// 		.stroke("black");
		});

		this.renderFrontPage(doc);

		this.renderComponentsPage(doc);

		this.renderColourVariantsPage(doc);

		this.renderTechnicalDrawing(doc);

		this.renderCopyrightPage(doc);

		this.appendHeaderAndFooter(doc);


		doc.end();
	}

	private renderFrontPage(doc: typeof PDFDocument): void {
		this.pageTitles.push("");

		doc.y = doc.y - 30;
		this.setFontFamily(doc, FontFamily.HEADING_LARGE);
		doc.text(`${this.pencil.brand}`);
		doc.text(`${this.pencil.modelName}`);
		this.setFontFamily(doc, FontFamily.HEADING_MEDIUM);
		doc.text(`${(this.pencil.modelNumber ? "Model #: " + this.pencil.modelNumber + "" : "")}`);

		doc.text("").moveDown(1);
		doc.moveTo(doc.page.margins.left, doc.y)
				.lineTo(doc.page.width - doc.page.margins.right, doc.y)
				.lineCap("butt")
				.lineWidth(6)
				.stroke("#000000");

		doc.text("").moveDown(1);
		this.centreImage(doc,
				`./output/png/pencil/${this.pencilFileDirectory}/${this.pencilFileName}-all-variants.png`,
				450);

		this.addPageWithTitle(doc, "Datasheet");

		this.setFontFamily(doc, FontFamily.PARAGRAPH);
		doc.text('').moveDown();

		this.centreImage(doc,
				`./output/png/technical/${this.pencilFileDirectory}/${this.pencilFileName}.png`,
				500);

		doc.text("").moveDown(2);

		this.setFontFamily(doc, FontFamily.HEADING_SMALL);
		doc.text("Overview").moveDown(1);
		this.setFontFamily(doc, FontFamily.PARAGRAPH);

		// now for the overall table
		// @ts-ignore
		doc.table({
			columnStyles: (i) => {
				if(i % 2 == 0) {
					return({ width: 160, textColor: "black", align: "right", font: { src: "./fonts/LibreBaskerville-Bold.ttf" }} );
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
				[ "Model Name", this.pencil.modelName ],
				[ "Model Number", this.pencil.modelNumber ],
				[ "Lead size", `${this.pencil.leadSize} mm` ],
				[ "Text", `${this.pencil.text}` ],
				[ "Mechanism", `${this.pencil.mechanism}` ],
				[ "Years available", `` ],
				[ "Country of manufacture", `` ],
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

	private renderExternalMeasurementTable(doc: typeof PDFDocument): void {
		doc.text("Measurements - external").moveDown(1);
		this.setFontFamily(doc, FontFamily.PARAGRAPH);

		// now for the component
		let componentData:any[][] = [];
		componentData.push([ "", "", { colSpan: 2, text: "Height", align: "center" }, { colSpan: 2, text: "Width", align: "center" } ]);
		componentData.push([ "Component" , "Length", "Min.", "Max", "Min.", "Max." ]);
		for(const [index, component ] of this.pencil.components.entries()) {
			if(component.length === 0) {
				// TODO - we do want the length and details from the internal end and start
			}
			let componentInner:any[] = [];
			componentInner.push({ text: component.type + (component.isHidden ? "\n(not shown)" : ""), align: "right" });
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

			for(const extra of component.extras) {
				let componentExtra:any[] = [];
				componentExtra.push({ text: component.type + " (extra)", align: "right" });

				componentExtra.push({text: `${formatToTwoPlaces(extra.length)} mm`, align: "center", border: [ 1, 1, 1, 1 ], borderColor: "#aaa"});
				componentExtra.push({text: `${formatToTwoPlaces(extra.height)} mm`, align: "center", colSpan: 2, border: [ 1, 1, 1, 1 ], borderColor: "#aaa" });
				componentExtra.push({text: `${formatToTwoPlaces(extra.width)} mm`, align: "center", colSpan: 2, border: [ 1, 1, 1, 1 ], borderColor: "#aaa" });

				componentData.push(componentExtra);
			}

		}
		componentData.push([
			{ text: "Total length", align: "right",  backgroundColor: "#cfcfcf" },
			{ text: `${formatToTwoPlaces(this.pencil.totalLength)} mm`,  backgroundColor: "#cfcfcf", font: { src: "./fonts/LibreBaskerville-Bold.ttf" }, align: "center" },
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
	}

	private renderExternalMaterialsTable(doc: typeof PDFDocument): void {
		this.setFontFamily(doc, FontFamily.HEADING_SMALL);
		doc.text("").moveDown(1);
		doc.text("Materials - external").moveDown(1);
		this.setFontFamily(doc, FontFamily.PARAGRAPH);

		// now for the component
		let materialsData:any[][] = [];
		materialsData.push([ "Component" , "Material(s)", "Colour(s)", "Shape(s)", "Finish" ]);
		for(const [index, component ] of this.pencil.components.entries()) {
			let componentInner:any[] = [];
			componentInner.push({ text: component.type, align: "right" });
			componentInner.push({ text: component.materials.join("\n"), align: "center" });
			componentInner.push({ text: this.getColours(component), align: "center" });
			componentInner.push({ text: this.getShape(component.parts), align: "center" });
			componentInner.push({ text: this.getFinish(component.parts), align: "center" });

			materialsData.push(componentInner);

			// TODO
			// for(const extra of component.extras) {
			// 	let componentExtra:any[] = [];
			// 	componentExtra.push({ text: component.type + " (extra)", align: "right" });
			// 	componentExtra.push({ text: component.materials.join("\n"), align: "center" });
			// 	componentExtra.push({ text: this.getColours(component), align: "center" });
			// 	if()
			// 	componentExtra.push({ text: this.getShape(component.extras), align: "left" });
			// 	componentExtra.push({ text: this.getFinish(component.extras), align: "left" });
			//
			// 	materialsData.push(componentExtra);
			// }

		}
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
					return({ border: [1, 0, 1, 0], borderColor: "#aaa", backgroundColor: "#cfcfcf", align: "center", font: { src: "./fonts/LibreBaskerville-Bold.ttf" }} );
				}

				if(i % 2 === 0) {
					return({ border: [1, 0, 1, 0], borderColor: "#aaa" } );
				} else {
					return({ border: [1, 0, 1, 0], borderColor: "#aaa", backgroundColor: "#efefef" } );
				}
			},
			data: materialsData
		});
	}

	private renderComponentsPage(doc: typeof PDFDocument): void {
		this.addPageWithTitle(doc, "Components");

		this.setFontFamily(doc, FontFamily.HEADING_SMALL);

		this.centreImage(doc, `./output/png/technical/${this.pencilFileDirectory}/${this.pencilFileName}-components.png`, 500);

		doc.text("").moveDown(1);

		this.renderExternalMeasurementTable(doc);

		this.renderExternalMaterialsTable(doc);

		if(this.pencil.hasHidden) {
			// centre image for internal components
			//this.renderInternalMaterialsTable(doc);
		}

		if(this.pencil.hasInternal) {
			doc.addPage();
			this.setFontFamily(doc, FontFamily.HEADING_SMALL);
			doc.text("Components (exploded view)").moveDown(1);

			this.centreImage(doc, `./output/png/technical/${this.pencilFileDirectory}/${this.pencilFileName}-exploded.png`, 500);

			for (const colourComponent of this.pencil.colourComponents) {
				this.setFontFamily(doc, FontFamily.HEADING_SMALL);
				doc.text("").moveDown(1);
				this.centreImage(doc, `./output/png/technical/${this.pencilFileDirectory}/${this.pencilFileName}-exploded-colour-${colourComponent}.png`, 500);
			}
		}
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

	private renderCopyrightPage(doc: typeof PDFDocument): void {
		this.addPageWithTitle(doc, "Notices");

		this.setFontFamily(doc, FontFamily.HEADING_SMALL);
		doc.text("Mechanical Pencils").moveDown(1);

		this.setFontFamily(doc, FontFamily.PARAGRAPH);
		doc.text("Any and all third-party brand names, logos, and trademarks referenced herein are the property of their " +
			"respective owners. The use of these names, logos, and trademarks is for identification purposes only and does " +
			"not imply any affiliation with or endorsement by their respective owners.").moveDown(1);

		this.setFontFamily(doc, FontFamily.HEADING_SMALL);
		doc.text("Fonts").moveDown(1);

		this.setFontFamily(doc, FontFamily.PARAGRAPH);
		doc.text("All fonts used in this PDF document are licensed under the SIL Open Font License, Version 1.1.  " +
			"This license is included in the source code repository that generated this document, copied below, and " +
			"is also available with a FAQ at: https://openfontlicense.org").moveDown(1);

		this.setFontFamily(doc, FontFamily.HEADING_TINY);
		doc.text("SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007").moveDown(1);

		this.setFontFamily(doc, FontFamily.PARAGRAPH);
		doc.text('PREAMBLE').moveDown(1);
		doc.text('The goals of the Open Font License (OFL) are to stimulate worldwide development of collaborative font projects, to support the font creation efforts of academic and linguistic communities, and to provide a free and open framework in which fonts may be shared and improved in partnership with others.').moveDown(1);
		doc.text('The OFL allows the licensed fonts to be used, studied, modified and redistributed freely as long as they are not sold by themselves. The fonts, including any derivative works, can be bundled, embedded,  redistributed and/or sold with any software provided that any reserved names are not used by derivative works. The fonts and derivatives, however, cannot be released under any other type of license. The requirement for fonts to remain under this license does not apply to any document created using the fonts or their derivatives.').moveDown(1);
		doc.text('DEFINITIONS').moveDown(1);
		doc.text('"Font Software" refers to the set of files released by the Copyright Holder(s) under this license and clearly marked as such. This may include source files, build scripts and documentation.').moveDown(1);
		doc.text('"Reserved Font Name" refers to any names specified as such after the copyright statement(s).').moveDown(1);
		doc.text('"Original Version" refers to the collection of Font Software components as distributed by the Copyright Holder(s).').moveDown(1);
		doc.text('"Modified Version" refers to any derivative made by adding to, deleting, or substituting -- in part or in whole -- any of the components of the Original Version, by changing formats or by porting the Font Software to a new environment.').moveDown(1);
		doc.text('"Author" refers to any designer, engineer, programmer, technical writer or other person who contributed to the Font Software.').moveDown(1);
		doc.text('PERMISSION & CONDITIONS').moveDown(1);
		doc.text('Permission is hereby granted, free of charge, to any person obtaining a copy of the Font Software, to use, study, copy, merge, embed, modify, redistribute, and sell modified and unmodified copies of the Font Software, subject to the following conditions:').moveDown(1);
		doc.text('1) Neither the Font Software nor any of its individual components, in Original or Modified Versions, may be sold by itself.').moveDown(1);
		doc.text('2) Original or Modified Versions of the Font Software may be bundled, redistributed and/or sold with any software, provided that each copy contains the above copyright notice and this license. These can be included either as stand-alone text files, human-readable headers or in the appropriate machine-readable metadata fields within text or binary files as long as those fields can be easily viewed by the user.').moveDown(1);
		doc.text('3) No Modified Version of the Font Software may use the Reserved Font Name(s) unless explicit written permission is granted by the corresponding Copyright Holder. This restriction only applies to the primary font name as presented to the users.').moveDown(1);
		doc.text('4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font Software shall not be used to promote, endorse or advertise any Modified Version, except to acknowledge the contribution(s) of the Copyright Holder(s) and the Author(s) or with their explicit written permission.').moveDown(1);
		doc.text('5) The Font Software, modified or unmodified, in part or in whole, must be distributed entirely under this license, and must not be distributed under any other license. The requirement for fonts to remain under this license does not apply to any document created using the Font Software.').moveDown(1);
		doc.text('TERMINATION').moveDown(1);
		doc.text('This license becomes null and void if any of the above conditions are not met.').moveDown(1);
		doc.text('DISCLAIMER').moveDown(1);
		doc.text('THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,').moveDown(1);
		doc.text('INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM').moveDown(1);
		doc.text('OTHER DEALINGS IN THE FONT SOFTWARE.').moveDown(1);

		this.setFontFamily(doc, FontFamily.HEADING_SMALL);
		doc.text("Data").moveDown(1);

		this.setFontFamily(doc, FontFamily.PARAGRAPH);
		doc.text("All data Copyright (c) // The Mechanical Pencil Database (tmpdb) - Licensed under Creative Commons " +
			"Attribution-NonCommercial-ShareAlike 4.0 International.  Data sourced from Synapticloop and other publicly " +
			"available sources.").moveDown(1);
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
				`${this.pencil.modelName} // ` +
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

		let writablePageHeight: number = pdfDocument.page.height - pdfDocument.page.margins.top - pdfDocument.page.margins.bottom;

		if(pdfDocument.y + moveDown > writablePageHeight) {
			pdfDocument.addPage();
		}

		// if(null == width) {
		// 	let fullWidth:number = pdfDocument.page.width - pdfDocument.page.margins.left - pdfDocument.page.margins.right;
		// 	pdfDocument.image(imageLocation,
		// 			{width: fullWidth});
		// } else {
		// 	pdfDocument.image(imageLocation,
		// 			{width: width});
		// }

		pdfDocument.image(imageLocation,
				pdfDocument.x + ((drawableWidth - width)/2),
				pdfDocument.y,
				{ width: width });

		pdfDocument.y = pdfDocument.y + moveDown;
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

	private getColours(component: Component): string {
		let textSet:Set<string> = new Set<string>();
		let textArray:string[] = [];
		component.opacityColours.forEach(colour => {
			if(!textSet.has(colour.colourName)) {
				textSet.add(colour.colourName);
				textArray.push(colour.colourName);
			}
		});

		return(textArray.join("\n"));
	}

	private getShape(parts: Part[]): string {
		let textSet:Set<string> = new Set<string>();
		let textArray:string[] = [];

		for(const part of parts) {
			const type: string = part.shape;
			if(type === "extra") {
				continue;
			}

			if(!textSet.has(type)) {
				textSet.add(type);
				textArray.push(type);
			}
		}
		return(textArray.join("\n"));
	}

	private getFinish(parts: Part[]): string {
		let textSet:Set<string> = new Set<string>();
		let textArray:string[] = [];

		for(const part of parts) {
			const finishes: string[] = part.finish.split(",");

			for(const finish of finishes) {
				if(!textSet.has(finish)) {
					textSet.add(finish);
					textArray.push(finish);
				}
			}
		}

		if(textArray.length === 0) {
			return("");
		} else {
			return (textArray.join("\n"));
		}
	}

}