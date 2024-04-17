import { Component, EventEmitter, Input, Output } from '@angular/core';
import { de } from 'date-fns/locale';
import { PermissionModel } from 'src/app/e-diary/models/quan-tri/PermissionModel';
import { RuleModel } from 'src/app/e-diary/models/quan-tri/RuleModel';
import { ESConst } from 'src/app/e-diary/utils/Const';

@Component({
  selector: 'app-permission-tree',
  templateUrl: './permission-tree.component.html',
  styleUrls: ['./permission-tree.component.css'],
})
export class PermissionTreeComponent {
  @Input() model: PermissionModel;
  @Input() parentModel: PermissionModel;
  @Input() lstRule: RuleModel[];
  @Input() STT?: string;
  @Input() level?: number = 1;

  @Output() onSetCheckboxForParent = new EventEmitter();
  @Output() onShowModalRule = new EventEmitter();

  constructor() {}

  onClickCollapse(isCollapse: boolean) {
    this.model.IsCollapse = isCollapse;
  }

  onClickCheckbox(isChecked: boolean) {
    // https://stackoverflow.com/questions/42221711/how-to-handle-events-in-nested-recursive-component
    // khi đệ quy component, các event sử dụng model đều lấy giá tri của component ngoài cùng
    // => câng phải gán giá trị cho model trong function của event và ko dùng ngModel
    // let isChecked = this.model.IsGranted;

    this.model.IsExistChildGranted = isChecked;
    this.model.IsGranted = isChecked;
    // click cha thì update all thằng con
    this.setCheckboxForChilds(this.model.Childs, isChecked);
    // check all thằng con click thì thằng cha ăn theo
    // thăng con uncheck thì thằng cha bỏ check all ([ ], [-])
    this.setCheckboxForParent(this.parentModel);
    // this.onSetCheckboxForParent.emit(this.parentModel);
  }

  setCheckboxForChilds(childs: PermissionModel[], isChecked: boolean) {
    if (childs) {
      for (let child of childs) {
        child.IsGranted = isChecked;
        child.IsExistChildGranted = false;
        this.setCheckboxForChilds(child.Childs, isChecked);
      }
    }
  }

  // function xử lý của event component con bắn ra
  setCheckboxForParent(item: PermissionModel) {
    if (!item || !item.Childs) return;

    // nếu tất cả đều ko IsGranted và ko IsExistChildGranted thì uncheck thằng cha [x]
    if (
      item.Childs.every(
        (child) => !child.IsGranted && !child.IsExistChildGranted
      )
    ) {
      item.IsGranted = false;
      item.IsExistChildGranted = false;
    }
    // nếu tất cả đều IsGranted thì check thằng cha [v]
    else if (item.Childs.every((child) => child.IsGranted)) {
      item.IsGranted = true;
      item.IsExistChildGranted = true;
    }
    // ngược lại thì hiển thị [-]
    else {
      item.IsGranted = false;
      item.IsExistChildGranted = true;
    }

    // bắn event ra cho thằng component cha xử lý
    this.onSetCheckboxForParent.emit(this.parentModel);
  }

  onClickRuleName(ruleId: number) {
    this.onShowModalRule.emit(ruleId);
  }

  onShowModalRuleFromChild(ruleId: number) {
    this.onShowModalRule.emit(ruleId);
  }

  buildQueryParamsForRuleLink(item: PermissionModel) {
    let param = {};
    param[ESConst.PatchParams.id] = item.RuleId;
    return param;
  }
}
