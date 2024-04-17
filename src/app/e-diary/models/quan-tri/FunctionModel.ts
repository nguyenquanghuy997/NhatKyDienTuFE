import { PagingModel } from "../Commons/PagingModel";

export interface FunctionModel {
    Id?: number,
    Name?: string,
    Code?: string,
    IsActive?: boolean,
    Note?: string,
    Version?: number,
}

export interface FunctionFilter extends PagingModel {
    Name?: string,
    Code?: string,
    IsActive?: boolean,
}
