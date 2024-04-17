import { PagingModel } from '../Commons/PagingModel';

export interface TagModel {
  Id?: number;
  UnitID?: number;
  Name?: string;
  UnitName?: string;
  Code?: string;
  Note?: string;
  IsActive?: boolean;
  IsDeleted?: boolean;
  CreatedUserId?: number;
  CreatedDTG?: Date;
  UpdatedUserId?: number;
  UpdatedDTG?: Date;
  Version?: number;
}
export interface TagFilter extends PagingModel {
  Name?: string;
  Code?: string;
  IsActive?: boolean;
  UnitId?: number;
}
