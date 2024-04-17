import { PagingModel } from '../Commons/PagingModel';
import { FeatureFunctionModel } from './FeatureFunctionModel';

export interface FeatureModel {
  Id?: number;
  ParentId?: number;
  Name?: string;
  Icon?: string;
  Url?: string;
  IsActive?: boolean;
  OnMobile?: boolean;
  IsDefault?: boolean;
  Note?: string;
  RefTypeId?: number;
  NO?: number;
  DisplayNO?: string;

  RefTypeName?: string;
  ParentName?: string;

  SubFeature?: FeatureModel[];
  FeatureFunctions?: FeatureFunctionModel[];
  IsChecked?: boolean;

  BreadcrumbId?: string;
  BreadcrumbName?: string;
}

export interface FeatureFilter extends PagingModel {
  Name?: string;
  ParentName?: string;
  RefTypeId?: number;
  IsActive?: boolean;
  OnMobile?: boolean;
  Url?: string;
  FunctionId?: number;
}
