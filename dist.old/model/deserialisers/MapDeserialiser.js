export class MapDeserialiser {
    deserialize = (value) => {
        let mapToReturn = new Map();
        if (value) {
            Object.keys(value).forEach((key) => {
                mapToReturn.set(key, value['' + key]);
            });
        }
        return mapToReturn;
    };
}
//# sourceMappingURL=MapDeserialiser.js.map