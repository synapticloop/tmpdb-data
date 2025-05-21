import {Deserializer, ObjectMapper} from "json-object-mapper";
import {Component} from "../Component.ts";

export class ComponentDeserialiser implements Deserializer {
	deserialize = (value : any): Component[] => {
		return(ObjectMapper.deserializeArray(Component, value));
	}
}
