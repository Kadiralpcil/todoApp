import { JsonProperty } from "json-object-mapper";

export class FlagResponseDto {
  @JsonProperty({ type: String, name: "_id", required: true })
  _id: string = "";
  @JsonProperty({ type: String, name: "name", required: true })
  name: string = "";
}
