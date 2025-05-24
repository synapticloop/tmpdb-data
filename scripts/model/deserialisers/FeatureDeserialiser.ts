import {Deserializer, ObjectMapper} from "json-object-mapper";
import {Extra} from "../Extra.ts";
import {Feature} from "../Feature.ts";

export class FeatureDeserialiser implements Deserializer {
	deserialize = (value : any): Feature[] => {
		return(ObjectMapper.deserializeArray(Feature, value));
	}
}
