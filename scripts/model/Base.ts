export abstract class Base {
	abstract postConstruct(colours: string[], colourMap: { [id: string]: string}): void;
}