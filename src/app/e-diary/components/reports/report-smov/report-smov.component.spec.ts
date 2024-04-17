import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSmovComponent } from './report-smov.component';

describe('ReportSmovComponent', () => {
  let component: ReportSmovComponent;
  let fixture: ComponentFixture<ReportSmovComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSmovComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSmovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
