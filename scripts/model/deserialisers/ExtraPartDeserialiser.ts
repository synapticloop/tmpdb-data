import {Deserializer, ObjectMapper} from "json-object-mapper";
import {Extra} from "../Extra.ts";
import {ExtraPart} from "../ExtraPart.ts";

export class ExtraPartDeserialiser implements Deserializer {
	deserialize = (value : any): ExtraPart[] => {
		return(ObjectMapper.deserializeArray(ExtraPart, value));
	}
}
