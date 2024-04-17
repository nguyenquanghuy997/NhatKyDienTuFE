import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModalViewSecretkeyComponent } from './user-modal-view-secretkey.component';

describe('UserModalViewSecretkeyComponent', () => {
  let component: UserModalViewSecretkeyComponent;
  let fixture: ComponentFixture<UserModalViewSecretkeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserModalViewSecretkeyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserModalViewSecretkeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
