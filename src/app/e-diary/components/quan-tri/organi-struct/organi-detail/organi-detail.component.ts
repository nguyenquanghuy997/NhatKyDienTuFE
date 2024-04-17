import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { OrganizationModel } from 'src/app/e-diary/models/quan-tri/OrganizationModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { OrganizationService } from 'src/app/e-diary/services/quan-tri/organization.service';
import {
  FunctionCode,
  TypeOrg,
  TypeOrgDescription,
} from 'src/app/e-diary/utils/Enum';

@Component({
  selector: 'app-organi-detail',
  templateUrl: './organi-detail.component.html',
  styleUrls: ['./organi-detail.component.css'],
})
export class OrganiDetailComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: OrganizationModel = {};
  @Output() onSetModalEditOrg = new EventEmitter();
  @Output() onSetConfirmDelOrg = new EventEmitter();
  typeOrg = TypeOrg;
  typeOrgDescription = TypeOrgDescription;
  constructor(public toastr: ToastrService) {}
  onOpenModalEditOrg() {
    if (this.model.Id) this.onSetModalEditOrg.emit(this.model.Id);
    else {
      this.toastr.error('Không có dữ liệu', 'Lỗi');
    }
  }
  setStatusName() {
    return this.model.IsActive ? 'Hoạt động' : 'Không hoạt động';
  }
  setParentName(): string {
    return;
  }
  setTypeName() {
    const typeOrgName = TypeOrgDescription[this.model.Type];
    return typeOrgName;
  }
  onOpenConfirmDelOrg() {
    if (this.model.Id) this.onSetConfirmDelOrg.emit(this.model);
    else {
      this.toastr.error('Không có dữ liệu', 'Lỗi');
    }
  }
  compOneCall() {
    console.log('CompOneComponent called successfully ..');
  }
}
