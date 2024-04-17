import { PagingModel } from '../Commons/PagingModel';

export interface DiaryModelFilter extends PagingModel {
  Name?: string;
  Code?: string;
  KeySearch?: string;
  IsActive?: boolean;
  fromDate?: Date;
  toDate?: Date;
  equipmentId?: number;
  equipmentTagId?: number;
  refTypeId?: number;
}
