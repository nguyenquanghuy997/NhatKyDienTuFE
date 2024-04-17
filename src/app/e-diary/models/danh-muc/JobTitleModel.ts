import { PagingModel } from '../Commons/PagingModel';

export interface JobTitleModel {
  Id?: number;
  Name?: string;
  Note?: string;
  IsActive?: boolean;
  Version?: number;
  ShiftEffectivePeriodId?: number;
}

export interface JobTitleFilter extends PagingModel {
  Name?: string;
  IsActive?: boolean;
  StartDTG?: string;
  ShiftEffectivePeriodId?: number;
}
