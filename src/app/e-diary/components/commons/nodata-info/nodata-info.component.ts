import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nodata-info',
  templateUrl: './nodata-info.component.html',
  styleUrls: ['./nodata-info.component.css'],
})
export class NodataInfoComponent {
  @Input() totalItem: number = 0;
}
