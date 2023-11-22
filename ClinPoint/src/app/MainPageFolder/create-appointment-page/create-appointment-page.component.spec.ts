import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAppointmentPageComponent } from './create-appointment-page.component';

describe('CreateAppointmentPageComponent', () => {
  let component: CreateAppointmentPageComponent;
  let fixture: ComponentFixture<CreateAppointmentPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAppointmentPageComponent]
    });
    fixture = TestBed.createComponent(CreateAppointmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
