import { PagingModel } from '../Commons/PagingModel';
import { ShiftScheduleMemberModel } from '../cau-hinh/ShiftScheduleMemberModel';

export interface ShiftModel {
  Id?: number;
  Name?: string;
  NO?: number;
  Note?: string;

  StartTime?: string;
  EndTime?: string;

  StartDTG?: Date;
  EndDTG?: Date;

  IsActive?: boolean;

  Version?: number;

  ShiftEffectivePeriodId?: number;

  ShiftEffectivePeriodStartDTG?: Date;

  ShiftScheduleMembers?: ShiftScheduleMemberModel[];

}

export interface ShiftFilter extends PagingModel {
  Name?: string;
  IsActive?: boolean;
  ShiftEffectivePeriodId?: number;
  StartDTG?: string;
  DutyShiftDate?: Date;
}
