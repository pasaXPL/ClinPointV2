import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMainPageComponent } from './login-main-page.component';

describe('LoginMainPageComponent', () => {
  let component: LoginMainPageComponent;
  let fixture: ComponentFixture<LoginMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginMainPageComponent]
    });
    fixture = TestBed.createComponent(LoginMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
