import { PagingModel } from '../Commons/PagingModel';

export interface ProcessFlowModel {
  Id?: number;
  RefId?: number;
  RefTypeId?: number;
  FlowId?: number;
  Name?: string;
  StartDTG?: Date;
  EndDTG?: Date;
  SubmittedUserId?: number;
  SubmittedDTG?: Date;
  ApprovedUserId?: number;
  ApprovedDTG?: Date;
  Status?: number;
  SubmittedNote?: string;
  IsDeleted?: boolean;
  CreatedUserId?: number;
  CreatedDTG?: Date;
  UpdatedUserId?: number;
  UpdatedDTG?: Date;
  Version?: number;

  ProcessFlowActives?: ProcessFlowActiveModel[];
}

export interface ProcessFlowActiveModel {
  Id?: number;
  ProcessFlowId?: number;
  FlowActiveId?: number;
  Name?: string;
  Note?: string;
  ApprovedNote?: number;
  RuleId?: number;
  SubmittedUserId?: number;
  SubmittedDTG?: Date;
  ApprovedUserId?: number;
  ApprovedDTG?: Date;
  Status?: number;
  IsDeleted?: boolean;
  CreatedUserId?: number;
  CreatedDTG?: Date;
  UpdatedUserId?: number;
  UpdatedDTG?: Date;
  Version?: number;
  NO?: number;
  IsLastFlowActive?: boolean;

  RuleName?: string;
  RuleView?: string;
  RuleFormula?: string;

  RefId?: number;
  RefTypeId?: number;
  FlowId?: number;

  ApprovedUsername?: string;
  ApprovedUser_Name?: string;
}

export interface ProcessFlowFilter extends PagingModel {
  RefId?: number;
  RefTypeId?: number;
  FlowId?: number;
}
