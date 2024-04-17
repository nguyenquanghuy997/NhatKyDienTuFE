import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { FlowModel } from 'src/app/e-diary/models/cau-hinh/FlowModel';
import { FormModel } from 'src/app/e-diary/models/cau-hinh/FormModel';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { RefTypeService } from 'src/app/e-diary/services/cau-hinh/ref-type.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ShiftCategoryModel } from 'src/app/e-diary/models/danh-muc/ShiftCategoryModel';

@Component({
  selector: 'app-reftype-modal',
  templateUrl: './reftype-modal.component.html',
  styleUrls: ['./reftype-modal.component.css'],
})
export class ReftypeModalComponent implements OnInit {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: RefTypeModel = {
    Id: -1,
    Name: '',
    Note: '',
    FlowId: -1,
    FormId: -1,
    ParentId: null,
    ShiftCategoryId: null,
    HasCA: false,
    HasOTP: false,
    IsDeleted: false,
    CreatedUserId: -1,
    CreatedDTG: new Date(),
    UpdatedUserId: -1,
    UpdatedDTG: new Date(),
    Version: -1,

    FlowName: '',
    FormName: '',
    ShiftCategoryName: '',
  };

  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();
  @Output() onEditModal = new EventEmitter();
  @Output() onDeleteModal = new EventEmitter();

  FunctionCode = FunctionCode;

  popupForm!: FormGroup;
  itemValidate: RefTypeModel = {};
  submitted: boolean = false;

  lstFlow: FlowModel[] = [];
  lstForm: FormModel[] = [];
  lstShiftCategory: ShiftCategoryModel[] = [];
  lstParent: RefTypeModel[] = [];
  lstAllParent: RefTypeModel[] = [];

  get displayHasOTP() {
    return this.model.HasOTP ? 'Có' : 'Không';
  }
  get displayHasCA() {
    return this.model.HasCA ? 'Có' : 'Không';
  }
  ngSelectMessage = NgSelectMessage;
  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }
  //#endregion
  constructor(
    private commonService: CommonService,
    private refTypeService: RefTypeService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.popupForm = this.formBuilder.group({
      Name: [
        this.itemValidate.Name,
        [Validators.required, Validators.maxLength(100)],
      ],
      ParentId: [this.itemValidate.ParentId],
      FlowId: [this.itemValidate.FlowId],
      FormId: [this.itemValidate.FormId],
      HasCA: [this.itemValidate.HasCA, [Validators.required]],
      HasOTP: [this.itemValidate.HasOTP, [Validators.required]],
      ShiftCategoryId: [this.itemValidate.ShiftCategoryId],
      Note: [this.itemValidate, [Validators.maxLength(1000)]],
    });

    // khi document ready thì handle event hide modal
    $(document).ready(function () {
      $('#RefTypeModal').on('hidden.bs.modal', function (e) {
        let is_display_none = $('#RefTypeModal').css('display') === 'none';
        if (is_display_none) $('#closeModalButton').click();
      });
    });
  }

  SetupForm() {
    // load lst flow
    // load lst form
    // load lst shiftcategory
    // để lên màn hình này thì cần có màn hình view, tương tự logic, cần có quyền view mới cho call các api addnew, edit
    // nên call cùng 1 api setup với popup
    // lưu ý áp dụng linh hoạt cho danh mục thôi
    this.refTypeService.GetDataSetupFormView().subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstFlow = result.Data.Flows;
          this.lstForm = result.Data.Forms;
          this.lstShiftCategory = result.Data.ShiftCategories;
          this.lstAllParent = result.Data.Parents;
          this.lstParent = this.lstAllParent.filter(
            (en) =>
              en.Id != this.model.Id &&
              !`>${en.BreadcrumbId}>`.includes(`>${this.model.Id}>`)
          );
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
      }
    );
  }

  ShowModal() {
    ($('#RefTypeModal') as any).modal('show');
    this.submitted = false;
  }

  HideModal() {
    ($('#RefTypeModal') as any).modal('hide');
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
      return;
    }
    // chuyển ra ngoài để thực hiện Create/Edit
    this.onSubmitModal.emit(this.model);
  }

  onEdit() {
    // chuyển trạng thái của modal chứ không cần làm gì nữa
    this.onEditModal.emit(this.model);
    // this.functionCode = FunctionCode.EDIT;
  }

  onDelete() {
    // chuyển ra ngoài ds để dùng chung function delete tại đó
    this.onDeleteModal.emit(this.model);
  }

  onChangeParentId() {
    // nếu có nghiệp vụ cha thì ko cần set Flow, CA, OTP nữa, tất cả theo nghiệp vụ cha hết
    let parent: RefTypeModel = this.lstParent.find(
      (x) => x.Id == this.model.ParentId
    );
    this.model.HasCA = parent?.HasCA ?? false;
    this.model.HasOTP = parent?.HasOTP ?? false;
    this.model.ShiftCategoryId = parent?.ShiftCategoryId;
    // nếu parent có FlowId mà child ko có FlowId thì mặc định chọn theo parent
    if (parent?.FlowId && !this.model.FlowId)
      this.model.FlowId = parent?.FlowId;
  }
}
