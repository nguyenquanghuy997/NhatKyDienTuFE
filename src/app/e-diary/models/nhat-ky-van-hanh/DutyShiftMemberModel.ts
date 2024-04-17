import { RefTypeModel } from '../cau-hinh/RefTypeModel';

export interface DutyShiftMemberModel {
  Id?: number;
  DutyShiftId?: number;

  UserId?: number;
  Username?: string;
  User_Name?: string;

  RefTypes?: RefTypeModel[] | [];

  JobTitleId?: number;
  JobTileName?: string;

  ShiftId?: number;
  ShiftName?: string;
}
