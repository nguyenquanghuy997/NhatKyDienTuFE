import { PagingModel } from '../Commons/PagingModel';
import { ShiftComponentModel } from './ShiftComponent';
import { ShiftModel } from './ShiftModel';

export interface ShiftEffectivePeriodModel {
  Id?: number;
  ShiftCategoryId?: number;
  ShiftCategoryName?: string;
  Name?: string;
  Note?: string;
  IsActive?: boolean;
  Version?: number;
  Color?: number;
  ShiftModels?: ShiftModel[];
  ShiftComponentModels?: ShiftComponentModel[];

  OrganizationBreadcrumbName?: string;
}

export interface ShiftEffectivePeriodFilter extends PagingModel {
  Name?: string;
  ShiftCategoryId?: number;
  IsActive?: boolean;
}
