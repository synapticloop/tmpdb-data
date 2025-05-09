/**
 * The end piece for the
 *
 * @module EndPiece
 */
export class EndPiece {
	type:string;
	dimensions:number[];
	fill:string = "black";

	/**
	 *
	 * @param jsonObject The json object for the end piece
	 */
	constructor(jsonObject:any) {
		this.type = jsonObject.type ?? this.type;
		const dimensionsTemp:string = jsonObject.dimensions ?? "";
		for(const dimension of dimensionsTemp.split("x")) {
			this.dimensions.push(parseFloat(dimension));
		}
		this.fill = jsonObject.fill ?? this.fill;
	}
}