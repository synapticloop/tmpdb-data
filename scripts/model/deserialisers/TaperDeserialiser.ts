import {Deserializer, ObjectMapper} from "json-object-mapper";
import {Part} from "../Part.ts";
import {Taper} from "../Taper.ts";

export class TaperDeserialiser implements Deserializer {
	deserialize = (value : any): Taper[] => {
		return(ObjectMapper.deserializeArray(Taper, value));
	}
}
