import { ResponseTypeES } from "../../utils/Enum";

export interface ResponseModel {
    Type: ResponseTypeES,
    Message?: string,
    Data?: any,
    Exception?: string,
    FunctionCodes: string[]
}