import { DutyShiftMemberModel } from './DutyShiftMemberModel';

export class DutyShiftModel {
  Id?: number;
  ShiftId?: number;
  ShiftName?: string;
  
  StartDTG?: Date;
  EndDTG?: Date;
  
  UserId?: number;
  Username?: string;
  User_Name?: string;
  
  JobTitleId?: number;
  JobTitleName?: string;

  DutyShiftMembers?: DutyShiftMemberModel[];
}
