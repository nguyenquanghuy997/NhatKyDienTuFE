import { PagingModel } from '../Commons/PagingModel';

export interface RuleModel {
  Id?: number;
  Name?: string | '';
  RuleView?: string | '';
  Formula?: string | '';
  IsActive?: boolean;
  Note?: string | '';
  IsDeleted?: boolean;
  CreatedUserId?: number;
  CreatedDTG?: Date;
  UpdatedUserId?: number;
  UpdatedDTG?: Date;
  Version?: number;
}

export interface RuleFilter extends PagingModel {
  Name?: string;
  IsActive?: boolean;
}
