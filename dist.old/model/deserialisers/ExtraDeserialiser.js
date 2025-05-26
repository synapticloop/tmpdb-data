import { ObjectMapper } from "json-object-mapper";
import { Extra } from "../Extra.ts";
export class ExtraDeserialiser {
    deserialize = (value) => {
        return (ObjectMapper.deserializeArray(Extra, value));
    };
}
//# sourceMappingURL=ExtraDeserialiser.js.map