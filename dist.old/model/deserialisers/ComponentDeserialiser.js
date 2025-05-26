import { ObjectMapper } from "json-object-mapper";
import { Component } from "../Component.ts";
export class ComponentDeserialiser {
    deserialize = (value) => {
        return (ObjectMapper.deserializeArray(Component, value));
    };
}
//# sourceMappingURL=ComponentDeserialiser.js.map