import { ObjectMapper } from "json-object-mapper";
export class ArrayDeserialiser {
    deserialize = (value) => {
        return (ObjectMapper.deserializeArray(T, value));
    };
}
//# sourceMappingURL=ArrayDeserialiser.js.map