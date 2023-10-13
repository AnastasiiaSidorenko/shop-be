import { IProduct } from "./IProduct";

export interface IResponseMessage {
    message: string;
}

export type ResponseType = IResponseMessage | IProduct | IProduct[];