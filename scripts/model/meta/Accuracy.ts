export class Accuracy {
	private static ACCURACY_DESCRIPTION = new Map<string, string[]>([
		[ "low" ,
			[
				"Physical pencil not present",
				"Measurements of the pencil were not taken with a precision tool, and may have been estimated from supplied images.",
				"The overall look of the pencil and the relative dimensions should be within reasonable and relative bounds.",
				"The pencil may be based on a third party branded model that is identical to the original.",
				"It is unlikely that internal measurements have any level of relative accuracy, and, where supplied have been estimated.",
				"There may be a low level of accuracy of the colours of the pencil's parts."
			]
		],
		[ "medium" ,
			[
				"Physical pencil present, however no precision measurement tool was used.",
				"Physical not present for measurements, for example an image of the pencil coupled with a measuring scale to be used for scale.",
				"Not all pencil measurements were taken with a precision tool, (especially where there are internal components which access could not be gained)." ,
				"External measurements may have been accurately measured, however internal components may not have been measured.",
				"The pencil may be based on a third party branded model that is identical to the original.",
				"The accuracy of the colours of the pencil's parts may not be reflected by the rendered images."
			]
		],
		[ "high",
			[
				"Physical pencil used for measurements." ,
				"Pencil measurements taken with a high precision tool." ,
				"Internal measurements may not be available due to disassembly challenges.",
				"The accuracy of the colours of the pencil's parts may not be reflected by the rendered images."
			]
		]
	]);

	static getAccuracyLevels(): string[] {
		return([ "low", "medium", "high", "unknown" ]);
	}

	static getAccuracyDescription(level: string): string[] {
		if(Accuracy.ACCURACY_DESCRIPTION.has(level)) {
			return(Accuracy.ACCURACY_DESCRIPTION.get(level));
		} else {
			return([
				"The accuracy level for this mechanical pencil could not be determined.",
				"The accuracy of the colours of the pencil's parts may not be reflected by the rendered images."
			]);
		}
	}
}
