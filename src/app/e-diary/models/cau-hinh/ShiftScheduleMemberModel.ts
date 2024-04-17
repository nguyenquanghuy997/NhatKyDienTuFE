import { RefTypeModel } from './RefTypeModel';

export interface ShiftScheduleMemberModel {
  Id?: number;
  ShiftId?: number;
  ShiftName?: string | '';
  ShiftScheduleId?: number;
  UserId?: number;
  User_Name?: string | '';
  Username?: string | '';
  StartDTG?: Date;
  EndDTG?: Date;

  JobTitleId?: number;
  JobTitleName?: string | '';

  RefTypeId?: number;
  RefTypeName?: string | '';
  RefTypeIds?: number[];
  RefTypes?: RefTypeModel[] | [];

  //GroupTable
  ChildNumber?: number;
  ChildFirst?: boolean;
  index?: number;
}
