import { JsonProperty } from "json-object-mapper";

export default class TodoResponseDto {
  @JsonProperty({ type: String, name: "_id", required: true })
  _id: string = "";
  @JsonProperty({ type: String, name: "userId", required: true })
  userId: string = "";
  @JsonProperty({ type: String, name: "title", required: true })
  title: string = "";
  @JsonProperty({ type: Boolean, name: "deleted", required: true })
  deleted: boolean = false;
  @JsonProperty({ type: Boolean, name: "completed", required: true })
  completed: boolean = false;
  @JsonProperty({ type: String, name: "flag", required: true })
  flag: string = "";
}
