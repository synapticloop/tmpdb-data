export class Accuracy {
	private static ACCURACY_DESCRIPTION = new Map<string, string>([
		[ "low" , "Measurements of the pencil were not taken with a precision tool, and/or may have been estimated from supplied images.  The overall look of the pencil and the relative dimensions should be within reasonable bounds. There may be a low level of accuracy of the colours of the pencil's parts." ],
		[ "medium" , "Not all pencil measurements were taken with a precision tool, (especially where there are internal components which access could not be gained).  The accuracy of the colours of the pencil's parts may not be reflected by the rendered images." ],
		[ "high", "Pencil measurements taken with a high precision tool.  The accuracy of the colours of the pencil's parts may not be reflected by the rendered images." ]
	]);

	static getAccuracyDescription(level: string): string {
		if(Accuracy.ACCURACY_DESCRIPTION.has(level)) {
			return(Accuracy.ACCURACY_DESCRIPTION.get(level));
		} else {
			return("The accuracy level for this mechanical pencil could not be determined.");
		}
	}
}
