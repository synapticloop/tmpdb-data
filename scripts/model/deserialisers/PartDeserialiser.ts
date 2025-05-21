import {Deserializer, ObjectMapper} from "json-object-mapper";
import {Part} from "../Part.ts";

export class PartDeserialiser implements Deserializer {
	deserialize = (value : any): Part[] => {
		return(ObjectMapper.deserializeArray(Part, value));
	}
}
