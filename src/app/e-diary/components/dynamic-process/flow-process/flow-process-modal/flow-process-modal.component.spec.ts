import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowProcessModalComponent } from './flow-process-modal.component';

describe('FlowProcessModalComponent', () => {
  let component: FlowProcessModalComponent;
  let fixture: ComponentFixture<FlowProcessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowProcessModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowProcessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
