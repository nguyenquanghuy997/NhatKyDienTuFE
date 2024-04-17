import { PagingModel } from '../Commons/PagingModel';

export interface TenantModel {
  Id?: number;
  Name?: number;
  Code?: string;
  Note?: string;
  Version?: number;
  IsActive?: boolean;
  IsDeleted?: boolean;
  CreatedUserId?: number;
  CreatedDTG?: Date;
  UpdatedUserId?: number;
  UpdatedDTG?: Date;
}
export interface TenantFilter extends PagingModel {
  Name?: string;
  Code?: string;
  IsActive?: boolean;
}
