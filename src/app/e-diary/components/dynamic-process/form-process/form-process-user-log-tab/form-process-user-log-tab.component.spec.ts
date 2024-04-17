import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProcessUserLogTabComponent } from './form-process-user-log-tab.component';

describe('FormProcessUserLogTabComponent', () => {
  let component: FormProcessUserLogTabComponent;
  let fixture: ComponentFixture<FormProcessUserLogTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormProcessUserLogTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProcessUserLogTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
