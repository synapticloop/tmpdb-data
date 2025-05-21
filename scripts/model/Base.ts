import {OpaqueColour} from "./OpaqueColour.ts";

export abstract class Base {
	static OPACITY_COLOUR_WHITE: OpaqueColour = new OpaqueColour(new Map<string, string>(), "white");

	abstract postConstruct(colours: string[], colourMap: Map<string, string>): void;

	public opacityColours: OpaqueColour[] = [];
	public backgroundOpacityColours: OpaqueColour[] = [];
	protected mergedColours: string[] = [];

	protected mergeOpacityColours(colours: string[], baseColours: string[], colourMap: Map<string, string>): void {
		let mergedColours: string[];
		if(colours === undefined || colours.length === 0) {
			mergedColours = baseColours;
		} else {
			mergedColours = colours;
		}

		for(const mergedColour of mergedColours) {
			let opaqueColour:OpaqueColour = new OpaqueColour(colourMap, mergedColour);
			this.opacityColours.push(opaqueColour);
			this.mergedColours.push(opaqueColour.definition);
		}
	}

	protected mergeBackgroundOpacityColours(colours: string[], baseColours: string[], colourMap: Map<string, string>): void {
		let mergedColours: string[];
		if(colours === undefined || colours.length === 0) {
			mergedColours = baseColours;
		} else {
			mergedColours = colours;
		}

		for(const mergedColour of mergedColours) {
			this.backgroundOpacityColours.push(new OpaqueColour(colourMap, mergedColour));
		}
	}

	public getOpacityColour(colourIndex: number): OpaqueColour {
		if(colourIndex === -1) {
			return(Base.OPACITY_COLOUR_WHITE);
		}

		if(this.opacityColours.length === 1) {
			return(this.opacityColours[0]);
		}

		return(this.opacityColours[colourIndex]);
	}

	public getBackgroundOpacityColour(colourIndex: number): OpaqueColour {
		if(null === this.backgroundOpacityColours || this.backgroundOpacityColours.length == 0) {
			return(this.getOpacityColour(colourIndex));
		}

		if(colourIndex === -1) {
			return(Base.OPACITY_COLOUR_WHITE);
		}

		if(this.backgroundOpacityColours.length === 1) {
			return(this.backgroundOpacityColours[0]);
		}

		return(this.backgroundOpacityColours[colourIndex]);
	}
}