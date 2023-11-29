
import { Component, ViewChild, Renderer2, ElementRef  } from '@angular/core';
import { Sidenav, initTE, Modal } from "tw-elements";
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { Clinic } from 'src/app/Models/model.model';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent {

  clinicList: any[] = [];
  patientList: any[] = [];
  appointmentList: any[] = [];
  userList: any[] = [];

  role = "";
  name = "";

  appointmentCount = 0;
  clinicCount = 0;
  userCount = 0;
  patientCount = 0;

  constructor(private router:Router, private auth:AuthService, private data:DataService){}

  async ngOnInit(){
    this.getAllClinics();
    this.getAllAppointments();
    this.getAllUsers();
    this.getAllPatients();

    this.role = this.auth.getAuth()!;

    var token = this.auth.getToken()!;
    var user: any;
    if(this.role == "Physician"){
      user = await this.data.getPatientById(token);
      this.name = user.firstname + " " + user.lastname;
    }
    else if(this.role == "Admin"){
      this.name = "ClinPoint";
    }
    else if (this.role == "Patient"){
      user  = await this.data.getPhysicianById(token);
      this.name = user.firstname + " " + user.lastname;
    }
    else if(this.role == "Clinic"){
      user = await this.data.getClinicById(token);
      this.name = user.clinicName
    }
  }

  getAllClinics() {
    this.data.getAllClinics().subscribe(res => {
      this.clinicList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      });

      this.clinicList = this.clinicList.filter(att => att.status == 'Approved');
      this.clinicCount = this.clinicList.length;
    }, err => {
      this.clinicCount = 0;
      alert('Error while fetching clinics data');
    })
  }

  getAllPatients() {
    this.data.getAllPatients().subscribe(res => {
      this.patientList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      });

      this.patientCount = this.patientList.length;
    }, err => {
      this.patientCount = 0;
      alert('Error while fetching clinics data');
    })
  }

  getAllAppointments() {
    this.data.getAllAppointments().subscribe(res => {
      this.appointmentList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      });
      this.appointmentCount = this.appointmentList.length;
    }, err => {
      this.appointmentCount = 0;
      alert('Error while fetching appointments data');
    })
  }

  getAllUsers() {
    this.data.getAllUsers().subscribe(res => {
      this.userList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      });
      this.userCount = this.userList.length;
    }, err => {
      this.userCount = 0;
      alert('Error while fetching appointments data');
    })
  }
}
