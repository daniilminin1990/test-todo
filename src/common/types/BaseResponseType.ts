export type ResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  data: D;
  fieldsErrors: Array<FieldErrorType>;
};
export type FieldErrorType = {
  error: string;
  field: string;
};
