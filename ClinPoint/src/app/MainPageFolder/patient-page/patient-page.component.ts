import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Patient } from 'src/app/Models/model.model';
import { DataService } from 'src/app/Services/data.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Modal, Ripple, Input, initTE, Select, Datepicker} from "tw-elements";
import { HttpClient } from '@angular/common/http';
import { baseURL } from 'src/app/Models/BaseURL';

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

  isPatient = false;
  searchString = "";

  constructor(private http: HttpClient, private data: DataService, private auth:AuthService) { }

  ngOnInit() {
    initTE({ Modal, Ripple, Input, Select, Datepicker });

    if(this.auth.getAuth() === "Patient"){
      this.isPatient = true;
    }

    this.getAllPatients();
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

  deletePatient(patient: Patient) {
    if (window.confirm('Are you sure you want to delete ' + patient.firstname + ' ' + patient.lastname + ' ?')) {
      this.data.deletePatient(patient);
    }
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
}
