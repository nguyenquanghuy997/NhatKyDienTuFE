import { PagingModel } from '../Commons/PagingModel';
import { ShiftScheduleMemberModel } from './ShiftScheduleMemberModel';

export interface ShiftScheduleModel {
  Id?: number;
  ShiftId?: number;
  JobTitleId?: number;
  ShiftCategoryId?: number;
  ShiftCategoryName?: string;
  ShiftEffectivePeriodId?: number;
  ShiftEffectivePeriodName?: string;
  ShiftEffectivePeriodColor?: string;
  ShiftName?: string;
  StartDTG?: Date;
  EndDTG?: Date;
  StartDTGString?: string;
  ChildNumber?: number;
  ChildFirst?: boolean;
  ChildIds?: number[];
  index?: number;
  ShiftScheduleMembers?: ShiftScheduleMemberModel[];
  ShiftScheduleIds?: number[];
}

export interface ShiftScheduleFilter extends PagingModel {
  ShiftEffectivePeriodId?: number;
  StartDTG?: Date;
  ShiftCategoryId?: number;
  fromDate?: Date;
  toDate?: Date;
}
export interface ShiftScheduleDeleteModel {
  Id: number;
  ShiftScheduleIds?: number[];
}
