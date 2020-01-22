export type RequestType = "Weather";

export interface MessageRequest {
  command: RequestType;
}

export interface MessageResponse<T> {
  command: RequestType;
  data: T;
}
