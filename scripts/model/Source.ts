export class Source {
	name: string;
	url: string;

	constructor(jsonObject: any, colours: string[]) {
		this.name = jsonObject.name ?? this.name;
		this.url = jsonObject.url ?? this.url;
	}
}