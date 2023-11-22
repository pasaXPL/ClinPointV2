import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

//Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//PWA
import { ServiceWorkerModule } from '@angular/service-worker';

//File Saver
import { FileSaverModule } from 'ngx-filesaver';

//Firebase
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { LandingPageComponent } from './LandingPageFolder/landing-page/landing-page.component';
import { LoginMainPageComponent } from './LoginPageFolder/login-main-page/login-main-page.component';
import { SignupComponentComponent } from './LoginPageFolder/signup-component/signup-component.component';
import { LoginComponentComponent } from './LoginPageFolder/login-component/login-component.component';
import { AppointmentPageComponent } from './MainPageFolder/appointment-page/appointment-page.component';
import { ClinicPageComponent } from './MainPageFolder/clinic-page/clinic-page.component';
import { DashboardPageComponent } from './MainPageFolder/dashboard-page/dashboard-page.component';
import { DoctorPageComponent } from './MainPageFolder/doctor-page/doctor-page.component';
import { InvoicePageComponent } from './MainPageFolder/invoice-page/invoice-page.component';
import { MainPageComponent } from './MainPageFolder/main-page/main-page.component';
import { MapPageComponent } from './MainPageFolder/map-page/map-page.component';
import { MessagePageComponent } from './MainPageFolder/message-page/message-page.component';
import { PatientPageComponent } from './MainPageFolder/patient-page/patient-page.component';
import { SchedulerPageComponent } from './MainPageFolder/scheduler-page/scheduler-page.component';
import { SettingPageComponent } from './MainPageFolder/setting-page/setting-page.component';
import { BlockedUserComponent } from './MainPageFolder/blocked-user/blocked-user.component';
import { MobileMainPageComponent } from './MainPageFolder/mobile-main-page/mobile-main-page.component';
import { ServicesPageComponent } from './MainPageFolder/services-page/services-page.component';
import { AppointmentResultPageComponent } from './MainPageFolder/appointment-result-page/appointment-result-page.component';
import { CreateAppointmentPageComponent } from './MainPageFolder/create-appointment-page/create-appointment-page.component';

const firebaseConfig = {
  apiKey: "AIzaSyBnTUq3eFmvr1XTmZrU-ThBMZBEFKosxDU",
  authDomain: "clinicpoint-c1afd.firebaseapp.com",
  databaseURL: "https://clinicpoint-c1afd-default-rtdb.firebaseio.com",
  projectId: "clinicpoint-c1afd",
  storageBucket: "clinicpoint-c1afd.appspot.com",
  messagingSenderId: "12464416315",
  appId: "1:12464416315:web:cb91206351053989d51e1e",
  measurementId: "G-4H4V8N85X5"
};

@NgModule({
  declarations: [
    AppComponent,

    //Pages
    LandingPageComponent,
    LoginMainPageComponent,
    SignupComponentComponent,
    LoginComponentComponent,
    AppointmentPageComponent,
    ClinicPageComponent,
    DashboardPageComponent,
    DoctorPageComponent,
    InvoicePageComponent,
    MainPageComponent,
    MapPageComponent,
    MessagePageComponent,
    PatientPageComponent,
    SchedulerPageComponent,
    SettingPageComponent,
    BlockedUserComponent,
    MobileMainPageComponent,
    ServicesPageComponent,
    AppointmentResultPageComponent,
    CreateAppointmentPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    FileSaverModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
