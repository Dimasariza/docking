import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManajemenFileComponent } from './manajemen-file.component';

describe('ManajemenFileComponent', () => {
  let component: ManajemenFileComponent;
  let fixture: ComponentFixture<ManajemenFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManajemenFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManajemenFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
