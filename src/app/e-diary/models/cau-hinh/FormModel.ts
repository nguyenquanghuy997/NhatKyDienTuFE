import { PagingModel } from "../Commons/PagingModel";

export interface FormModel{
    Id?:number;
    Name?: string;
    Note?: string;
    Content?: string;
    IsActive?: boolean;
    IsDeleted?: boolean;
    CreatedUserId?: number;
    CreatedDTG?: Date;
    UpdatedUserId?: number;
    UpdatedDTG?: Date;
    Version?: number;
}

export interface FormFilter extends PagingModel
{
    Name?: string;
    IsActive?: boolean;
}