import { PagingModel } from '../Commons/PagingModel';

export interface NotificationModel {
  Id?: number;
  CreatedDTG?: string;
  DisplayContent?: string;
  ContentSearch?: string;
  Type?: number;
  CreatedUserId?: string;
  CreatedUser_Name?: string;
  SysProcessFormName?: string;
}

export interface NotificationFilterModel extends PagingModel {
  fromDate?: Date;
  toDate?: Date;
  Content?: string;
  Type?: number;
  CreatedUserId?: string;
}

export interface Message {
  NotificationType?: number;
  EventType?: number;
  Detail?: MessageRepositoryDetail;
}
export interface MessageRepositoryDetail {
  ProcessUserId?: number;
  DisplayContent?: string;
  TenantCode?: string;
}
