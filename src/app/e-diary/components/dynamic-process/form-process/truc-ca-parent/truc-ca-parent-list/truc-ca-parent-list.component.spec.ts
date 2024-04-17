import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucCaParentListComponent } from './truc-ca-parent-list.component';

describe('TrucCaParentListComponent', () => {
  let component: TrucCaParentListComponent;
  let fixture: ComponentFixture<TrucCaParentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrucCaParentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrucCaParentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
