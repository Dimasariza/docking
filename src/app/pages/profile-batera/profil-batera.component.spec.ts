import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilBateraComponent } from './profil-batera.component';

describe('ProfilBateraComponent', () => {
  let component: ProfilBateraComponent;
  let fixture: ComponentFixture<ProfilBateraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilBateraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilBateraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
