import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentResultPageComponent } from './appointment-result-page.component';

describe('AppointmentResultPageComponent', () => {
  let component: AppointmentResultPageComponent;
  let fixture: ComponentFixture<AppointmentResultPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentResultPageComponent]
    });
    fixture = TestBed.createComponent(AppointmentResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
