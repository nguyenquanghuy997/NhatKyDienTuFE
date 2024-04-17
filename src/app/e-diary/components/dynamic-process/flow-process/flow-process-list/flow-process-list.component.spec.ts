import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowProcessListComponent } from './flow-process-list.component';

describe('FlowProcessListComponent', () => {
  let component: FlowProcessListComponent;
  let fixture: ComponentFixture<FlowProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowProcessListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
