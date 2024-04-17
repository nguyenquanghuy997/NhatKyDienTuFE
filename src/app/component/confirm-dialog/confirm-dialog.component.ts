import { Component, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  title?: string;
  message?: string;
  options?: string[];
  // answer: string = '';
  answer: boolean = false;

  constructor(public bsModalRef: BsModalRef) {}

  // respond(answer: string) {
  //   this.answer = answer;
  //   this.bsModalRef.hide();
  // }

  onConfirm(): void {
    this.answer = true;
    this.bsModalRef.hide();
  }

  onCancel(): void {
    this.answer = false;
    this.bsModalRef.hide();
  }
}
export interface ConfirmModalData {
  title: string;
  message: string;
}
