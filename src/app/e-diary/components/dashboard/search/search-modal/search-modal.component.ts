import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, } from '@angular/core';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.css'],
})
export class SearchModalComponent {
  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();
  @Input() isVisible = true;
  @Input() isVisibleModal = true;
  htmlContent: string = ``;

  @ViewChild('textarea') $textarea: ElementRef<HTMLTextAreaElement>;
  constructor() { }
  HideModal() {
    $('#closeModalButton').click();
  }

  onHide() {
    // chuyển event ra ngoài, thêm xử lý bên ngoài nếu cần
    this.onHideModal.emit();
    this.isVisible = false;
  }
}
