import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentPageComponent } from './appointment-page.component';

describe('AppointmentPageComponent', () => {
  let component: AppointmentPageComponent;
  let fixture: ComponentFixture<AppointmentPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentPageComponent]
    });
    fixture = TestBed.createComponent(AppointmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
