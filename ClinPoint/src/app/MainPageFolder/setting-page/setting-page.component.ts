import { Component } from '@angular/core';
import { Account, Patient, Clinic, Physician } from 'src/app/Models/model.model';
import { AuthService } from 'src/app/Services/auth.service';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.scss']
})
export class SettingPageComponent {
  accountObj: Account | any = {
    addressId: '',
    id: '',
    username: '',
    password: '',
    role: ''
  }

  patientObj : Patient | any = {
    addressId: '',
    id: '',
    firstname: 'To be updated',
    lastname: '',
    email: 'N/A',
    contactno: 'N/A',
    birthdate: '',
    address: 'N/A',
    createdat: '',
    status: 'Active',
    gender: 'Male',
    image: ''
  }

  physicianObj : Physician | any = {
    addressId: '',
    id: '',
    firstname: 'To be updated',
    lastname: '',
    email: 'N/A',
    contactno: 'N/A',
    birthdate: '',
    address: 'N/A',
    createdat: '',
    status: 'Pending',
    gender: 'Male',
    specialty: '',
    license: '',
    dayoff: '',
    image: '',
    aisupportdescription: ''
  }

  clinicObj : Clinic | any = {
    addressId: '',
    id: '',
    clinicName: '',
    clinicOwner: '',
    description: '',
    file1:'',
    file2:'',
    logo:'',
    contactno:'',
    dayoff: '',
    createdat: '',
    email: '',
    address: '',
    status: 'Pending',
    aisupportdescription: ''
  }

  token: string = '';
  role: string = '';
  isClinic = false;
  isPatient = false;
  isAdmin = false;
  isPhysician = false;

  constructor(private auth: AuthService, private data: DataService){}

  async ngOnInit(){
    this.role = this.auth.getAuth()!;
    this.token = this.auth.getToken()!;
    if(this.role == 'Clinic'){
      this.clinicObj = await this.data.getClinicById(this.token)!;
    }
    else if(this.role == 'Patient'){
      this.patientObj = await this.data.getPatientById(this.token)!;
    }
    else if(this.role == 'Physician'){
      this.physicianObj = await this.data.getPhysicianById(this.token)!;
    }
  }


  displaybday(){
    // var dateString = this.birthdate.split('-');
    // this.resultBirthdate = dateString[1]+ "/" + dateString[2] + "/" + dateString[0];
  }
}
