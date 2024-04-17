import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { ESConst } from 'src/app/e-diary/utils/Const';
import {
  FunctionCode,
  NgSelectMessage,
  ResponseTypeES,
} from 'src/app/e-diary/utils/Enum';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  ColumnInfoModel,
  TableInfoModel,
} from 'src/app/e-diary/models/Commons/TableInfoModel';
import { RuleModel } from 'src/app/e-diary/models/quan-tri/RuleModel';
import { RuleService } from 'src/app/e-diary/services/cau-hinh/rule.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-rule-modal',
  templateUrl: './rule-modal.component.html',
  styleUrls: ['./rule-modal.component.css'],
})
export class RuleModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: RuleModel = {};

  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();
  @Output() onEditModal = new EventEmitter();
  @Output() onDeleteModal = new EventEmitter();

  FunctionCode = FunctionCode;

  popupForm!: FormGroup;
  itemValidate: RuleModel = {};
  submitted: boolean = false;
  isValidFormula: boolean = true;

  lstTableInfo: TableInfoModel[] = [];
  lstColumnInfo: ColumnInfoModel[] = [];
  lstDefaultParam = ESConst.DefaultParams;
  lstSqlOperator = ESConst.SqlOperators;

  //#region BuildFormula
  columnName?: string = null;
  defaultParam?: string = null;
  sqlOperator?: string = null;
  //#endregion

  ngSelectMessage = NgSelectMessage;

  get dislayIsActive() {
    return this.model.IsActive ? 'Hoạt động' : 'Không hoạt động';
  }

  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }
  //#endregion

  constructor(
    private ruleService: RuleService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.popupForm = this.formBuilder.group({
      Name: [
        this.itemValidate.Name,
        [Validators.required, Validators.maxLength(100)],
      ],
      IsActive: [this.itemValidate.IsActive, [Validators.required]],
      Note: [this.itemValidate.Note, [Validators.maxLength(1000)]],
      Formula: [
        this.itemValidate.Formula,
        [Validators.required, Validators.maxLength(1000)],
      ],
      RuleView: [
        this.itemValidate.RuleView,
        [Validators.required, Validators.maxLength(100)],
      ],

      columnName: [this.columnName],
      defaultParam: [this.defaultParam],
      sqlOperator: [this.sqlOperator],
    });

    // khi document ready thì handle event hide modal
    $(document).ready(function () {
      $('#RuleModal').on('hidden.bs.modal', function (e) {
        let is_display_none = $('#RuleModal').css('display') === 'none';
        if (is_display_none) $('#closeModalButton').click();
      });
    });
  }

  SetupModalAddnew() {
    // lấy ds table, view và các field của nó trong hệ thống
    this.commonService.getListTable().subscribe((result: ResponseModel) => {
      if (this.commonService.checkTypeResponseData(result)) {
        this.lstTableInfo = result.Data;

        $(document).ready(function () {
          // Focus mặc định
          $('#RuleModal').on('shown.bs.modal', function () {
            $('#Name').focus();
          });
        });
      } else {
        this.toastr.error(`${result.Message}`, 'Lỗi');
      }
    });

    // clear cac selector
    this.lstColumnInfo = [];
    this.columnName = null;
    this.defaultParam =
      this.lstDefaultParam.length > 0 ? this.lstDefaultParam[0] : null;
    this.sqlOperator =
      this.lstSqlOperator.length > 0 ? this.lstSqlOperator[0] : null;
    this.isValidFormula = true;
  }

  SetupModalEdit() {
    // lấy ds table, view và các field của nó trong hệ thống
    this.commonService.getListTable().subscribe((result: ResponseModel) => {
      if (this.commonService.checkTypeResponseData(result)) {
        this.lstTableInfo = result.Data;

        this.onGetColumnsOfRuleTable();

        $(document).ready(function () {
          // Focus mặc định
          $('#RuleModal').on('shown.bs.modal', function () {
            $('#Name').focus();
          });
        });
      } else {
        this.toastr.error(`${result.Message}`, 'Lỗi');
      }
    });

    // clear cac selector
    this.defaultParam =
      this.lstDefaultParam.length > 0 ? this.lstDefaultParam[0] : null;
    this.sqlOperator =
      this.lstSqlOperator.length > 0 ? this.lstSqlOperator[0] : null;
    this.isValidFormula = true;
  }

  ShowModal() {
    $('#RuleModal').modal('show');
    this.submitted = false;
  }
  HideModal() {
    $('#RuleModal').modal('hide');
    this.submitted = false;
  }
  onHide() {
    // chuyển event ra ngoài, thêm xử lý bên ngoài nếu cần
    this.onHideModal.emit();
    this.submitted = false;
    this.HideModal();
  }

  onSubmit() {
    this.submitted = true;
    if (this.popupForm?.invalid) {
      this.popupForm.markAllAsTouched();
      return;
    }
    // chuyển ra ngoài để thực hiện Create/Edit
    let item = Object.assign({}, this.model);
    this.onSubmitModal.emit(item);
  }

  onEdit() {
    // chuyển trạng thái của modal chứ không cần làm gì nữa
    this.onEditModal.emit(this.model.Id);
    // this.functionCode = FunctionCode.EDIT;
  }

  onDelete() {
    // chuyển ra ngoài ds để dùng chung function delete tại đó
    let item = Object.assign({}, this.model);
    this.onDeleteModal.emit(item);
  }

  //#region BuildFormula
  onChangeRuleView(event?: any) {
    this.onGetColumnsOfRuleTable();
  }
  onGetColumnsOfRuleTable() {
    let table = this.lstTableInfo.find((x) => x.Name == this.model.RuleView);
    if (table && table.Columns && table.Columns.length > 0) {
      this.lstColumnInfo = table?.Columns;
      this.columnName = this.lstColumnInfo[0]?.Name;
    } else {
      this.lstColumnInfo = [];
      this.columnName = null;
    }
  }
  onAddColumnOfRuleViewBuildFormula() {
    if (!this.columnName) return;
    if (!this.model.Formula) {
      this.model.Formula = '';
    }
    this.model.Formula += this.columnName;
  }
  onAddDefultParamBuildFormula() {
    if (!this.defaultParam) return;
    if (!this.model.Formula) {
      this.model.Formula = '';
    }
    this.model.Formula += this.defaultParam;
  }
  onAddSqlOperatorBuildFormula() {
    if (!this.sqlOperator) return;
    if (!this.model.Formula) {
      this.model.Formula = '';
    }
    this.model.Formula += this.sqlOperator;
  }
  onCheckFormula() {
    this.ruleService.checkFormula(this.model).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          if (result.Data == true) {
            this.toastr.success(
              result.Message ?? '[Công thức] hợp lệ',
              'Thành công'
            );
          } else {
            console.error(`${result.Exception}`);
            this.toastr.error(`${result.Message}`, 'Công thức lỗi');
            this.isValidFormula = false;
          }
        } else {
          this.toastr.error(`${result.Message}`, 'Công thức lỗi');
        }
      },
      (error) => {
        this.isValidFormula = false;
      }
    );
  }
  onKeyDownFormula() {
    // khi thay đổi text thì bỏ cảnh báo sai công thức đi
    this.isValidFormula = true;
  }
  //#endregion
}
