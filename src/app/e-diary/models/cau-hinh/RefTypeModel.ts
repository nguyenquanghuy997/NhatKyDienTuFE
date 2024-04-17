import { PagingModel } from '../Commons/PagingModel';

export interface RefTypeModel {
  Id?: number;
  ParentId?: number;
  Name?: string;
  FlowId?: number;
  FormId?: number;
  ShiftCategoryId?: number;
  HasCA?: boolean;
  HasOTP?: boolean;
  Note?: string;
  IsDeleted?: boolean;
  CreatedUserId?: number;
  CreatedDTG?: Date;
  UpdatedUserId?: number;
  UpdatedDTG?: Date;
  Version?: number;

  FlowName?: string;
  FormName?: string;
  ShiftCategoryName?: string;

  BreadcrumbId?: string;
  BreadcrumbName?: string;

  ParentName?: string;

  OrganizationId?: number;

  StatusDutyShift?: number;
}

export interface RefTypeFilter extends PagingModel {
  Name?: string;
  FlowId?: number;
  FormId?: number;
  ShiftCategoryId?: number;
  HasCA?: boolean;
  HasOTP?: boolean;
}
