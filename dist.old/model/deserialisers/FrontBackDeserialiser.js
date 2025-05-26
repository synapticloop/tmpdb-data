import { ObjectMapper } from "json-object-mapper";
import { FrontBack } from "../FrontBack.ts";
export class FrontBackDeserialiser {
    deserialize = (value) => {
        return (ObjectMapper.deserializeArray(FrontBack, value));
    };
}
//# sourceMappingURL=FrontBackDeserialiser.js.map