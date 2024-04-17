import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftEffectivePeriodEditModalComponent } from './shift-effective-period-edit-modal.component';

describe('ShiftEffectivePeriodEditModalComponent', () => {
  let component: ShiftEffectivePeriodEditModalComponent;
  let fixture: ComponentFixture<ShiftEffectivePeriodEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftEffectivePeriodEditModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftEffectivePeriodEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
