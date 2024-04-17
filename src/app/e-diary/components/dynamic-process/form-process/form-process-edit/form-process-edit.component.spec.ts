import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProcessEditComponent } from './form-process-edit.component';

describe('FormProcessEditComponent', () => {
  let component: FormProcessEditComponent;
  let fixture: ComponentFixture<FormProcessEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormProcessEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProcessEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
