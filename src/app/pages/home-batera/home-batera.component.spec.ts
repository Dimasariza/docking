import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBateraComponent } from './home-batera.component';

describe('HomeBateraComponent', () => {
  let component: HomeBateraComponent;
  let fixture: ComponentFixture<HomeBateraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeBateraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBateraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
