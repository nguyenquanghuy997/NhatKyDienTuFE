import { ComponentFixture, TestBed } from '@angular/core/testing';

import ReftypeListComponent from './reftype-list.component';

describe('ReftypeListComponent', () => {
  let component: ReftypeListComponent;
  let fixture: ComponentFixture<ReftypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReftypeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReftypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
