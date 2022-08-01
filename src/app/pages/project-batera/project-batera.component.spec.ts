import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBateraComponent } from './project-batera.component';

describe('ProjectBateraComponent', () => {
  let component: ProjectBateraComponent;
  let fixture: ComponentFixture<ProjectBateraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectBateraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBateraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
