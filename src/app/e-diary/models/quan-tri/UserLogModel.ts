import { PagingModel } from '../Commons/PagingModel';

export interface UserLogModel {
  Id?: number;
  FunctionCode?: string;
  FunctionName?: string;
  FeatureCode?: string;
  FeatureName?: string;
  ActionPath?: string;
  ActionParams?: string;
  ActionTime?: string;
  UserId?: number;
  Username?: string;
}

export interface UserLogFilterModel extends PagingModel {
  Username?: string;
  FeatureName?: string;
  FunctionName?: string;
  fromDate?: Date;
  toDate?: Date;

  // dùng cho truy vấn đến từng bản ghi đối tượng đc ghi log
  RefId?: number;
  RefTypeId?: number;
}
