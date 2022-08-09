import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMenuReportComponent } from './sub-menu-report.component';

describe('SubMenuReportComponent', () => {
  let component: SubMenuReportComponent;
  let fixture: ComponentFixture<SubMenuReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubMenuReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMenuReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
