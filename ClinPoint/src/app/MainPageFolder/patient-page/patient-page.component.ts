import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Patient } from 'src/app/Models/model.model';
import { DataService } from 'src/app/Services/data.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Modal, Ripple, Input, initTE, Select, Datepicker} from "tw-elements";
import { HttpClient } from '@angular/common/http';
import { baseURL } from 'src/app/Models/BaseURL';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.scss']
})
export class PatientPageComponent {
  @ViewChild('openViewPatient') viewPatientModal!: ElementRef;
  @ViewChild('closeModals') closeModals!: ElementRef;

  selectedFile : File | undefined;
  originalPatientsList: Patient[] = [];
  patientsList: Patient[] = [];
  patientObj: Patient = {
    addressId: '',
    id: '',
    firstname: 'To be Added',
    lastname: '',
    email: 'N/A',
    contactno: 'N/A',
    birthdate: '',
    address: 'N/A',
    createdat: '',
    status: '',
    gender: 'Male',
    image: '',
  };

  id: string = '';
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  contactno: string = '';
  address: string = '';
  birthdate: string = '';
  gender: string = 'Male';
  resultBirthdate: string = '';
  patientImage: any = null;

  selectedPatient : Patient = {
    addressId: '',
    id: '',
    firstname: 'To be Added',
    lastname: '',
    email: 'N/A',
    contactno: 'N/A',
    birthdate: '',
    address: 'N/A',
    createdat: '',
    status: '',
    gender: 'Male',
    image: ''
  };

  appointmentList:any [] = [];

  isPatient = false;
  searchString = "";
  role = '';
  token = '';

  constructor(private http: HttpClient, private data: DataService, private auth:AuthService) { }

  ngOnInit() {
    initTE({ Modal, Ripple, Input, Select, Datepicker });

    if(this.auth.getAuth() === "Patient"){
      this.isPatient = true;
    }

    this.role = this.auth.getAuth()!;
    this.token = this.auth.getToken()!;

    //this.getAllAppointment();
    //this.getAllPatients();

    if(this.role == 'Admin'){
      this.getAllPatients();
    }
    else if(this.role == 'Clinic'){
      this.getAllAppointmentClinic();
    }
    else if(this.role == 'Physician'){
      this.getAllAppointmentPhysician();
    }
  }

  getAllPatients() {
    this.data.getAllPatients().subscribe(res => {
      this.patientsList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      })

      this.originalPatientsList = this.patientsList;
    }, err => {
      alert('Error while fetching student data');
    })
  }

  getAllAppointmentClinic() {
    this.data.getAllAppointments().subscribe(
      (res) => {
        this.appointmentList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.addressId = e.payload.doc.id;
          return data;
        });

        this.appointmentList = this.appointmentList.filter(att => att.clinicId == this.token);

        this.data.getAllPatients().subscribe(res => {
          this.patientsList = res.map((e: any) => {
            const data = e.payload.doc.data();
            data.addressId = e.payload.doc.id;
            return data;
          })

          let plist:any[] = [];

          
          let listpatientid:any[] = [...new Set(this.appointmentList.map(att => att.patientId))];
          
          listpatientid.forEach(att => {
            let p = this.patientsList.find(pl => pl.id == att);
            if(p){
              plist.push(p)
            }
          });

          this.patientsList = plist;

        }, err => {
          alert('Error while fetching student data');
        })

      },
      (err) => {
        alert('Error while fetching services data');
      }
    );
  }

  
  getAllAppointmentPhysician() {
    this.data.getAllAppointments().subscribe(
      (res) => {
        this.appointmentList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.addressId = e.payload.doc.id;
          return data;
        });

        this.appointmentList = this.appointmentList.filter(att => att.physicianId == this.token);

        this.data.getAllPatients().subscribe(res => {
          this.patientsList = res.map((e: any) => {
            const data = e.payload.doc.data();
            data.addressId = e.payload.doc.id;
            return data;
          })

          let plist:any[] = [];

          
          let listpatientid:any[] = [...new Set(this.appointmentList.map(att => att.patientId))];
          
          listpatientid.forEach(att => {
            let p = this.patientsList.find(pl => pl.id == att);
            if(p){
              plist.push(p)
            }
          });

          this.patientsList = plist;

        }, err => {
          alert('Error while fetching student data');
        })

      },
      (err) => {
        alert('Error while fetching services data');
      }
    );
  }

  searchPatients(){
    var list = this.originalPatientsList;
    var searchTexts = this.searchString.split(' ');
    searchTexts.forEach((text) => {
      list = list.filter((obj) =>
      obj.firstname.toUpperCase().includes(text.toUpperCase()) ||
      obj.lastname.toUpperCase().includes(text.toUpperCase()) ||
      obj.email.toUpperCase().includes(text.toUpperCase()) ||
      obj.contactno.toUpperCase().includes(text.toUpperCase()) ||
      (obj.status?.toString() || '').toUpperCase().includes(text.toUpperCase()) ||
      obj.address.toUpperCase().includes(text.toUpperCase()));
    })

    this.patientsList = list;
  }

  resetForm() {
    this.id = '';
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.contactno = '';
    this.address = '';
    this.gender = '';
    this.birthdate = '';
    this.patientImage = null;
  }

  addPatient() {
    if (this.firstname == '' || this.lastname == '' || this.contactno == '' || this.email == '' || this.birthdate == '' || this.address == '') {
      alert('Fill all input fields in the form');
      return;
    }
    const currentDate: Date = new Date();
    const dateString: string = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    if (window.confirm('Are you sure you want to add ' + this.firstname + ' ' + this.lastname + ' ?')) {

      this.patientObj.id = '';
      this.patientObj.email = this.email;
      this.patientObj.firstname = this.firstname;
      this.patientObj.lastname = this.lastname;
      this.patientObj.contactno = this.contactno;
      this.patientObj.createdat = dateString;
      this.patientObj.status = 'Active'
      this.patientObj.gender = this.gender;
      this.patientObj.address = this.address;
      this.patientObj.birthdate = this.resultBirthdate;
      this.patientObj.image = baseURL + 'uploads/' + this.patientImage.name;
      if (this.patientImage) {
        try{
        const formData = new FormData();
        formData.append('file', this.patientImage);

        this.http.post(baseURL + 'upload', formData, { responseType: 'text' }).subscribe(
          response => {
            console.log('File uploaded successfully', response);
          },
          error => {
            console.error('Error uploading the file', error);
          }
        );
        }catch{}
      }

      this.data.addPatient(this.patientObj);
    }
    this.closeModal();
    this.resetForm();
  }

  async updatePatient(patient: Patient) :Promise<void> {
    if (window.confirm('Are you sure you want to update ' + patient.firstname + ' ' + patient.lastname + ' ?')) {
      await this.data.updatePatient(patient);
    }

    this.closeModal();
  }

  async archivePatient(patient: Patient) :Promise<void> {
    if(patient.status == 'Active'){
      if (window.confirm('Are you sure you want to archive ' + patient.firstname + ' ' + patient.lastname + ' ?')) {
        patient.status = "Inactive"
        await this.data.updatePatient(patient);
      }
    }
    else{
      if (window.confirm('Patient is currently Inactive, are you sure you want to re-active ' + patient.firstname + ' ' + patient.lastname + ' ?')) {
        patient.status = "Active"
        await this.data.updatePatient(patient);
      }
    }

    this.closeModal();
  }

  openViewPatientModal(patient: Patient) {
    this.selectedPatient = patient;
    this.viewPatientModal.nativeElement.click();
  }

  closeModal(){
    this.closeModals.nativeElement.click();
  }


  getPatientLogo(event:any) {
    this.patientImage = event.target.files[0];
  }

  displaybday(){
    var dateString = this.birthdate.split('-');
    this.resultBirthdate = dateString[1]+ "/" + dateString[2] + "/" + dateString[0];
  }

  downloadPatientReport(){
    var report:any[] = [];

    this.patientsList.forEach(att => {
      var d = {
        'First Name': att.firstname,
        'Last Name': att.lastname,
        'Email': att.email,
        'Contact No': att.contactno,
        'Birthdate': this.changeDateFormat(att.birthdate, 'MM/dd/yyyy'),
        'Patient Image': att.image,
        'Status': att.status,
        'Created At': att.createdat
      }
      report.push(d);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(report);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'exported_data.xlsx');
  }
  changeDateFormat(inputDate: string, format: string): string{
    var idate = new Date(inputDate);
    return this.formatDateV2(idate, format);
  }
  formatDateV2(inputDate: Date, format: string): string {
    if (!inputDate) return '';

    const padZero = (value: number) => (value < 10 ? `0${value}` : `${value}`);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const parts: { [key: string]: number | string } = {
      yyyy: inputDate.getFullYear(),
      MM: padZero(inputDate.getMonth() + 1),
      Mm: monthNames[inputDate.getMonth()],
      dd: padZero(inputDate.getDate()),
      HH: padZero(inputDate.getHours()),
      hh: padZero(inputDate.getHours() > 12 ? inputDate.getHours() - 12 : inputDate.getHours()),
      mm: padZero(inputDate.getMinutes()),
      ss: padZero(inputDate.getSeconds()),
      tt: inputDate.getHours() < 12 ? 'AM' : 'PM'
    };

    return format.replace(/yyyy|MM|Mm|dd|HH|hh|mm|ss|tt/g, (match) => parts[match].toString());
  }
}
