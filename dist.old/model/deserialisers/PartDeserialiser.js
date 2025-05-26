import { ObjectMapper } from "json-object-mapper";
import { Part } from "../Part.ts";
export class PartDeserialiser {
    deserialize = (value) => {
        return (ObjectMapper.deserializeArray(Part, value));
    };
}
//# sourceMappingURL=PartDeserialiser.js.map