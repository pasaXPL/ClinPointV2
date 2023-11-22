import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './MainPageFolder/main-page/main-page.component';
import { DashboardPageComponent } from './MainPageFolder/dashboard-page/dashboard-page.component';
import { AppointmentPageComponent } from './MainPageFolder/appointment-page/appointment-page.component';
import { DoctorPageComponent } from './MainPageFolder/doctor-page/doctor-page.component';
import { InvoicePageComponent } from './MainPageFolder/invoice-page/invoice-page.component';
import { MapPageComponent } from './MainPageFolder/map-page/map-page.component';
import { MessagePageComponent } from './MainPageFolder/message-page/message-page.component';
import { PatientPageComponent } from './MainPageFolder/patient-page/patient-page.component';
import { SchedulerPageComponent } from './MainPageFolder/scheduler-page/scheduler-page.component';
import { SettingPageComponent } from './MainPageFolder/setting-page/setting-page.component';
import { LoginMainPageComponent } from './LoginPageFolder/login-main-page/login-main-page.component';
import { LoginComponentComponent } from './LoginPageFolder/login-component/login-component.component';
import { SignupComponentComponent } from './LoginPageFolder/signup-component/signup-component.component';
import { LandingPageComponent } from './LandingPageFolder/landing-page/landing-page.component';
import { GuardGuard } from './Services/guard.guard';
import { ClinicPageComponent } from './MainPageFolder/clinic-page/clinic-page.component';
import { BlockedUserComponent } from './MainPageFolder/blocked-user/blocked-user.component';
import { MobileMainPageComponent } from './MainPageFolder/mobile-main-page/mobile-main-page.component';
import { ServicesPageComponent } from './MainPageFolder/services-page/services-page.component';
import { AppointmentResultPageComponent } from './MainPageFolder/appointment-result-page/appointment-result-page.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: MainPageComponent,
    canActivate: [GuardGuard],
    children :[
      { path: '', component: DashboardPageComponent, canActivate:[GuardGuard] },
      { path: 'appointment', component: AppointmentPageComponent, canActivate:[GuardGuard]},
      { path: 'physician', component: DoctorPageComponent, canActivate:[GuardGuard] },
      { path: 'invoice', component: InvoicePageComponent, canActivate:[GuardGuard] },
      { path: 'map', component: MapPageComponent, canActivate:[GuardGuard] },
      { path: 'message', component: MessagePageComponent, canActivate:[GuardGuard] },
      { path: 'patient', component: PatientPageComponent, canActivate:[GuardGuard] },
      { path: 'scheduler', component: SchedulerPageComponent, canActivate:[GuardGuard] },
      { path: 'settings', component: SettingPageComponent, canActivate:[GuardGuard] },
      { path: 'clinic', component: ClinicPageComponent, canActivate:[GuardGuard] },
      { path: 'blocked', component: BlockedUserComponent, canActivate:[GuardGuard] },
      { path: 'services', component: ServicesPageComponent, canActivate:[GuardGuard] },
      { path: 'results', component: AppointmentResultPageComponent, canActivate:[GuardGuard] },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: '**', redirectTo:'/dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'mobiledashboard',
    component: MobileMainPageComponent,
    canActivate: [GuardGuard],
    children :[
      { path: '', component: DashboardPageComponent, canActivate:[GuardGuard] },
      { path: 'appointment', component: AppointmentPageComponent, canActivate:[GuardGuard]},
      { path: 'physician', component: DoctorPageComponent, canActivate:[GuardGuard] },
      { path: 'invoice', component: InvoicePageComponent, canActivate:[GuardGuard] },
      { path: 'map', component: MapPageComponent, canActivate:[GuardGuard] },
      { path: 'message', component: MessagePageComponent, canActivate:[GuardGuard] },
      { path: 'patient', component: PatientPageComponent, canActivate:[GuardGuard] },
      { path: 'scheduler', component: SchedulerPageComponent, canActivate:[GuardGuard] },
      { path: 'settings', component: SettingPageComponent, canActivate:[GuardGuard] },
      { path: 'clinic', component: ClinicPageComponent, canActivate:[GuardGuard] },
      { path: 'blocked', component: BlockedUserComponent, canActivate:[GuardGuard] },
      { path: 'services', component: ServicesPageComponent, canActivate:[GuardGuard] },
      { path: 'results', component: AppointmentResultPageComponent, canActivate:[GuardGuard] },
      { path: '', redirectTo: '/mobiledashboard', pathMatch: 'full' },
      { path: '**', redirectTo:'/mobiledashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'account',
    component: LoginMainPageComponent,
    children: [
      { path: 'login', component: LoginComponentComponent },
      { path: 'signup', component: SignupComponentComponent },
      { path: '**', redirectTo:'/account/login', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: LandingPageComponent
  },
  { path: '**', redirectTo:'', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
