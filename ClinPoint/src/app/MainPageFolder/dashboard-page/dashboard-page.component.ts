
import { Component, ViewChild, Renderer2, ElementRef  } from '@angular/core';
import { Sidenav, initTE, Modal } from "tw-elements";
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { Clinic } from 'src/app/Models/model.model';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
  physicianList: any[] = [];

  role = "";
  name = "";

  appointmentCount = 0;
  clinicCount = 0;
  userCount = 0;
  patientCount = 0;
  physicianCount = 0;
  isActive = false;
  token = '';

  appointmentChart: any;
  appointmentCharts: any;
  

  constructor(private router:Router, private auth:AuthService, private data:DataService){}

  async ngOnInit(){

    this.role = this.auth.getAuth()!;

    this.token = this.auth.getToken()!;
    var user: any;

    if(this.role == "Admin"){
      this.getAllAppointments();
      this.getAllUsers();
      this.getAllPatients();
      this.getAllPhysicians();
    }
    else{
      this.getAllAppointments();
    }
    this.getAllClinics();

    try{
      if(this.role == "Patient"){
        user = await this.data.getPatientById(this.token);
        console.log('test' + user)
        this.name = user.firstname + " " + user.lastname;

      }
      else if(this.role == "Admin"){
        this.name = "ClinPoint";
      }
      else if (this.role == "Physician"){
        user  = await this.data.getPhysicianById(this.token);
        this.name = user.firstname + " " + user.lastname;
        if(user.status == 'Approved'){
          this.isActive = true;
        }
      }
      else if(this.role == "Clinic"){
        user = await this.data.getClinicById(this.token);
        this.name = user.clinicName;
        if(user.status == 'Approved'){
          this.isActive = true;
        }
      }
      }catch{}

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

  getAllPhysicians() {
    this.data.getAllPhysicians().subscribe(res => {
      this.physicianList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      });

      this.physicianList = this.physicianList.filter(att => att.status == 'Approved');
      this.physicianCount = this.physicianList.length;
    }, err => {
      this.physicianCount = 0;
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

      if(this.role == 'Physician'){
        this.appointmentList = this.appointmentList.filter(att => att.physicianId == this.token);
      }
      else if(this.role == 'Patient'){
        this.appointmentList = this.appointmentList.filter(att => att.patientId == this.token);
      }
      else if(this.role == 'Clinic'){
        this.appointmentList = this.appointmentList.filter(att => att.clinicId == this.token);
      }


      this.appointmentCount = this.appointmentList.length;

      this.SetAppointmentChart();
      
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

  SetAppointmentChart123(){
    this.appointmentChart = new Chart("myAppointments", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.displayPreviousDays(),  
	       datasets: [
          {
            label: "Sales",
            data: ['467','576', '572', '79', '92',
								 '574', '573', '576'],
            backgroundColor: 'blue'
          },
          {
            label: "Profit",
            data: ['542', '542', '536', '327', '17',
									 '0.00', '538', '541'],
            backgroundColor: 'limegreen'
          }  
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }

  SetAppointmentChart(){
    if (this.appointmentChart) {
      this.appointmentChart.destroy();
    }

    this.appointmentChart = new Chart("myAppointments", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.displayPreviousDays(), 
	       datasets: [
          {
            label: "Waiting",
            data: this.getDatas("Waiting"),
            backgroundColor: 'gray',
            borderColor: 'gray',
            tension: 0.3,
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 10
          },
          {
            label: "Accepted",
            data: this.getDatas("Accepted"),
            backgroundColor: 'limegreen',
            borderColor: 'limegreen',
            tension:0.3,
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 10
          },
          {
            label: "Cancelled",
            data: this.getDatas("Cancelled"),
            backgroundColor: 'red',
            borderColor: 'red',
            tension: 0.3,
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 10
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
      
    });
  }

  displayPreviousDays(): string[] {
    let currentDate = new Date();
    const currentWeek: string[] = [];
    const dayCurrent = [ "Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

    // Find the Sunday of the current week
    const sunday = new Date(currentDate);
    sunday.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
        const day = new Date(sunday);
        day.setDate(sunday.getDate() + i);
        const month = day.toLocaleString('default', { month: 'short' });
        const formattedDate = `${month} ${day.getDate()}`;
        currentWeek.push(dayCurrent[i] + ':' + formattedDate);
    }

    return currentWeek;
}

  getDatas(s:string): number[] {
    let realCurrentDate = new Date;
    let currentDate = new Date;
    const currentWeek: string[] = [];
    const totalAppointment: number[] = [];
    const sunday = new Date(currentDate);
    sunday.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
        const day = new Date(sunday);
        day.setDate(sunday.getDate() + i);
        const formattedDate = `${day.getFullYear()}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${day.getDate().toString().padStart(2, '0')}`;
        currentWeek.push(formattedDate);
    }

    
      currentWeek.forEach(att => {
        totalAppointment.push(this.appointmentList.filter(ap => ap.status == s && ap.appointmentDate == att).length)
      });

    return totalAppointment;
  }
}


