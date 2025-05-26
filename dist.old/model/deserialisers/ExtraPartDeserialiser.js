import { ObjectMapper } from "json-object-mapper";
import { ExtraPart } from "../ExtraPart.ts";
export class ExtraPartDeserialiser {
    deserialize = (value) => {
        return (ObjectMapper.deserializeArray(ExtraPart, value));
    };
}
//# sourceMappingURL=ExtraPartDeserialiser.js.map