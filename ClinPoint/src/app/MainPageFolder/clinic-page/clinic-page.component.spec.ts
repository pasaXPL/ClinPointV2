import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicPageComponent } from './clinic-page.component';

describe('ClinicPageComponent', () => {
  let component: ClinicPageComponent;
  let fixture: ComponentFixture<ClinicPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClinicPageComponent]
    });
    fixture = TestBed.createComponent(ClinicPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
