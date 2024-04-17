import { VerifyPasswordModel, VerifyTOTPModel } from '../Commons/VerifyTOTPModel';
import { RefTypeModel } from '../cau-hinh/RefTypeModel';
import { ShiftScheduleMemberModel } from '../cau-hinh/ShiftScheduleMemberModel';
import { DutyShiftModel } from './DutyShiftModel';

export interface SysProcessFormDeliveyModel {
  Id?: number;
  ParentId?: number;
  RefTypeId?: number;
  Name?: string;
  Code?: string;
  Note?: string;
  DutyShiftId?: number;
  ShiftId?: number;
  ShiftName?: string;
  ShiftCode?: string;
  ShiftNote?: string;
  ShiftScheduleId?: number;
  Status?: number;
  Version?: number;
  StatusDutyShift?: number;
  StartDTG?: Date;
  EndDTG?: Date;
  TimeShift?: string;
  Members?: SysProcessMemberModel[];
  ProcessFormNext?: SysProcessFormDeliveyModel;
  VerifyTOTPs?: VerifyTOTPModel[];
  VerifyPasswords?: VerifyPasswordModel[];
  DutyShift?: DutyShiftModel;
}
export interface SysProcessMemberModel {
  Id?: number;
  ShiftId?: number;
  ShiftName?: string;
  ShiftScheduleId?: number;
  UserId?: number;
  User_Name?: string;

  JobTitleId?: number;
  JobTitleName?: string;

  RefTypes?: RefTypeModel[];

  StatusDutyShift?: number;
  TOTP?: string;
  Password?: string;

  ShiftComponentNO?: number;
}
