import { PagingModel } from '../Commons/PagingModel';
import {
  VerifyPasswordModel,
  VerifyTOTPModel,
} from '../Commons/VerifyTOTPModel';
import { DutyShiftModel } from './DutyShiftModel';

export interface ProcessFormModel {
  Id?: number;
  ParentId?: number;
  RefTypeId?: number;
  Name?: string;
  Note?: string;
  Content?: string;
  Context?: string;
  IsDeleted?: boolean;
  InchargeUserId?: number;
  InchargeUser_Name?: string;
  InchargeUsername?: string;
  CreatedUserId?: number;
  CreatedDTG?: Date;
  UpdatedUserId?: number;
  UpdatedUser_Name?: string;
  UpdatedDTG?: Date;
  Version?: number;

  DutyShiftId?: number;
  ShiftId?: number;
  ShiftName?: string;
  ShiftNote?: string;
  Status?: number;
  StatusDutyShift?: number;
  StartDTG?: Date;
  EndDTG?: Date;
  Highlights?: HighlightModel[];
  ContentElastic?: any; // dùng để lưu jsonArray to elastic

  RefTypeName?: string;

  DutyShift?: DutyShiftModel;

  ChildSysProcessform?: ProcessFormModel[];

  VerifyTOTPs?: VerifyTOTPModel[];
  VerifyPasswords?: VerifyPasswordModel[];

  ProcessFormNext?: ProcessFormModel;
}

export interface HighlightModel {
  Description?: string;
  DisplayName?: string;
  HighlightValue?: string;
}

export interface ProcessFormFilter extends PagingModel {
  Name?: string;
  Status?: number | null;
  StatusDutyShift?: number | null;
  RefTypeId?: number;
  FromDate?: Date;
  ToDate?: Date;
}

export interface contentSearch {
  value?: string;
  tagName?: string;
  minBlock?: number;
  maxBlock?: number;
  minWarn?: number;
  maxWarn?: number;
  equipmentId?: number;
  equipmentTagId?: number;
}

export interface contentStatistic {
  id?: number;
  value?: string;
  tagName?: string;
  minBlock?: number;
  maxBlock?: number;
  minWarn?: number;
  maxWarn?: number;
  equipmentId?: number;
  equipmentTagId?: number;
  timeFollow?: Date;
  equipmentName?: string;
  equipmentTagName?: string;
  timeFollowStr?: string;
  equipmentCode?: string;
}
