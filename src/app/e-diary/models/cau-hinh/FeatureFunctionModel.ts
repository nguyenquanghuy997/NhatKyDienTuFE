export interface FeatureFunctionModel {
    Id?: number,
    FeatureId?: number,
    FunctionId?: number,
    RuleId?: number,

    FunctionCode?: string,
    FunctionName?: string,

    RuleName?: string,

    IsChecked?:boolean,
}