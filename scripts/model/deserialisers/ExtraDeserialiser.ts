import {Deserializer, ObjectMapper} from "json-object-mapper";
import {Extra} from "../Extra.ts";

export class ExtraDeserialiser implements Deserializer {
	deserialize = (value : any): Extra[] => {
		return(ObjectMapper.deserializeArray(Extra, value));
	}
}
