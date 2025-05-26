import { ObjectMapper } from "json-object-mapper";
import { Taper } from "../Taper.ts";
export class TaperDeserialiser {
    deserialize = (value) => {
        return (ObjectMapper.deserializeArray(Taper, value));
    };
}
//# sourceMappingURL=TaperDeserialiser.js.map