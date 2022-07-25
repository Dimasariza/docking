import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BerkasSayaComponent } from './berkas-saya.component';

describe('BerkasSayaComponent', () => {
  let component: BerkasSayaComponent;
  let fixture: ComponentFixture<BerkasSayaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BerkasSayaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BerkasSayaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
