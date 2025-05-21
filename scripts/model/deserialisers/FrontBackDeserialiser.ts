import {Deserializer, ObjectMapper} from "json-object-mapper";
import {Part} from "../Part.ts";
import {Taper} from "../Taper.ts";
import {FrontBack} from "../FrontBack.ts";

export class FrontBackDeserialiser implements Deserializer {
	deserialize = (value : any): FrontBack[] => {
		return(ObjectMapper.deserializeArray(FrontBack, value));
	}
}
