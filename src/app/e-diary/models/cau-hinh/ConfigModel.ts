import { PagingModel } from "../Commons/PagingModel";

export interface ConfigModel {
  Id?: number;
  Name?: string;
  Code?: string;
  Value?: string;
  Note?: string;
  UpdatedUserId?: number;
  UpdatedDTG?: Date;
}

export interface ConfigModelFilter extends PagingModel {
  Code?: string;
  Name?: string;
}
