export function formatToTwoPlaces(number: number): string {
	return((Math.round((number) * 100) / 100).toFixed(2));
}

export function formatToOnePlace(number: number): string {
	return((Math.round((number) * 100) / 100).toFixed(1));
}
