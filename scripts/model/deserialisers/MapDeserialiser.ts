import {Deserializer, ObjectMapper} from "json-object-mapper";
import {Extra} from "../Extra.ts";

export class MapDeserialiser implements Deserializer {
    deserialize = (value: any): any => {
        let mapToReturn: Map<string, string> = new Map<string, string>();
        if (value) {
            Object.keys(value).forEach((key: string) => {
                mapToReturn.set(key, value['' + key]);
            });
        }
        return mapToReturn;
    }
}