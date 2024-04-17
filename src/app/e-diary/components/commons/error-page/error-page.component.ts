import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {
  @Input() isNotPermission: boolean = false;
  @Input() isError404: boolean = false;
}
