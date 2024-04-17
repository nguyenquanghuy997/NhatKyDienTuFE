import { PagingModel } from '../Commons/PagingModel';
import { FlowActiveModel } from './FlowActiveModel';

export interface FlowModel {
    Id?: number;
    Name?: string;
    Note?: string;
    IsActive?: boolean;
    IsDeleted?: boolean;
    CreatedUserId?: number;
    CreatedDTG?: Date;
    UpdatedUserId?: number;
    UpdatedDTG?: Date;
    Version?: number;
    NO?: number;

    FlowActives?: FlowActiveModel[];
}

export interface FlowFilter extends PagingModel {
    Name?: string;
    IsActive?: boolean;
}
