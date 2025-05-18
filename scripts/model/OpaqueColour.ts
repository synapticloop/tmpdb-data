export class OpaqueColour {
	colour:string;
	opacity:number = 1;

	constructor(colour: string) {
		const splits: string[] = colour.split("%");
		switch(splits.length) {
			case 2:
				this.colour = splits[0];
				let opacityTemp = parseInt(splits[1]);
				if (opacityTemp > 1) {
					this.opacity = opacityTemp/100;
				} else {
					this.opacity = opacityTemp;
				}
				break;
			case 1:
				this.colour = splits[0];
				break;
			default:
				this.colour = colour;
		}
	}
}