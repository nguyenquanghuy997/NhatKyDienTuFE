import { DatePipe } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { UserLogModel } from 'src/app/e-diary/models/quan-tri/UserLogModel';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';

@Component({
  selector: 'app-user-log-modal',
  templateUrl: './user-log-modal.component.html',
  styleUrls: ['./user-log-modal.component.css'],
})
export class UserLogModalComponent {
  @Input() model: UserLogModel;
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Output() onHideModal = new EventEmitter();
  FunctionCode = FunctionCode;
  ActionParams: string = '';
  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.model?.currentValue) {
      let jsonParse = JSON.parse(changes.model.currentValue.ActionParams);
      jsonParse.body = jsonParse.body
        ? JSON.parse(jsonParse.body)
        : jsonParse.body;
      this.ActionParams = jsonParse;
    }
  }

  ShowModal() {
    ($('#UserLogModal') as any).modal('show');
  }

  HideModal() {
    ($('#UserLogModal') as any).modal('hide');
  }

  onHide() {
    // chuyển event ra ngoài, thêm xử lý bên ngoài nếu cần
    this.onHideModal.emit();
    this.HideModal();
  }
}
