import { PagingModel } from '../Commons/PagingModel';

export interface UnitModel {
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
}
export interface UnitFilter extends PagingModel {
  Name?: string;
  IsActive?: boolean;
}
