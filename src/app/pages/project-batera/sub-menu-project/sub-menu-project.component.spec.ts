import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMenuProjectComponent } from './sub-menu-project.component';

describe('SubMenuProjectComponent', () => {
  let component: SubMenuProjectComponent;
  let fixture: ComponentFixture<SubMenuProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubMenuProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMenuProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
