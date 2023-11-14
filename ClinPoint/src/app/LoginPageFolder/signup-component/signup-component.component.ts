import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';
import { initTE, Select, Input, Ripple } from 'tw-elements';
import { Account, Physician, Patient, Clinic } from 'src/app/Models/model.model';
import { DataService } from 'src/app/Services/data.service';
import { FileSaverService } from 'ngx-filesaver';
import { HttpClient } from '@angular/common/http';
import { baseURL } from 'src/app/Models/BaseURL';

@Component({
  selector: 'app-signup-component',
  templateUrl: './signup-component.component.html',
  styleUrls: ['./signup-component.component.scss']
})
export class SignupComponentComponent {
  accountObj: Account = {
    addressId: '',
    id: '',
    username: '',
    password: '',
    role: ''
  }

  patientObj : Patient = {
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

  physicianObj : Physician = {
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

  clinicObj : Clinic = {
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


  role: string = 'Clinic';
  username: string = '';
  password: string = '';

  ClinicName: string = '';
  ClinicManagerName: string = '';
  ClinicDescription: string = '';
  ClinicFile1: any = null;
  PhysicianProfilePhoto: any = null;
  PatientProfilePhoto: any = null;
  PhysicianLicensePhoto: any = null;
  ClinicFile2: any = null;
  ClinicLogo: any = null;
  FirstName: string = '';
  LastName: string = '';
  PhoneNumber: string = '';
  EmailAddress: string = '';
  Address: string = '';
  UserUsername: string = '';
  UserPassword: string = '';
  ConfirmPassword: string = '';
  Birthdate: string = '';
  resultBirthDate: string = '';



  constructor(private http: HttpClient, private auth:AuthService, private router:Router, private data:DataService, private fileSaverService:FileSaverService){}

  ngOnInit() {

    initTE({ Input, Ripple, Select });
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
  }

  getClinicButtonClass(): string {
    if (this.role === 'Clinic') {
      return 'flex justify-center w-full px-6 py-3 text-white bg-[#179182] rounded-md md:w-auto md:mx-2 focus:outline-none';
    } else {
      return 'flex justify-center w-full px-6 py-3 mt-4 text-[#179182] border border-[#179182] rounded-md md:mt-0 md:w-auto md:mx-2 dark:border-[#179182] dark:text-[#179182] focus:outline-none';
    }
  }

  getPatientButtonClass(): string {
    if (this.role === 'Patient') {
      return 'flex justify-center w-full px-6 py-3 mt-4 text-white bg-[#179182] rounded-md md:w-auto md:mt-0 md:mx-2 focus:outline-none';
    } else {
      return 'flex justify-center w-full px-6 py-3 mt-4 text-[#179182] border border-[#179182] rounded-md md:mt-0 md:w-auto md:mx-2 dark:border-[#179182] dark:text-[#179182] focus:outline-none';
    }
  }

  getPhysicianButtonClass(): string {
    if (this.role === 'Physician') {
      return 'flex justify-center w-full px-6 py-3 mt-4 text-white bg-[#179182] rounded-md md:w-auto md:mt-0 md:mx-2 focus:outline-none';
    } else {
      return 'flex justify-center w-full px-6 py-3 mt-4 text-[#179182] border border-[#179182] rounded-md md:mt-0 md:w-auto md:mx-2 dark:border-[#179182] dark:text-[#179182] focus:outline-none';
    }
  }

  updateRole(role: string){
    this.role = role;
  }

  onSubmit(): void {
    if(this.role === "Physician"){
      if(
        this.FirstName == '' ||
        this.LastName == '' ||
        this.PhoneNumber == '' ||
        this.EmailAddress == '' ||
        this.Address == '' ||
        this.UserUsername == '' ||
        this.UserPassword == '' ||
        this.ConfirmPassword == ''
      )
      {
        alert('Fill all input fields in the form');
        return;
      }
    }

    else if(this.role === "Patient"){
      if(
        this.FirstName == '' ||
        this.LastName == '' ||
        this.PhoneNumber == '' ||
        this.EmailAddress == '' ||
        this.Address == '' ||
        this.UserUsername == '' ||
        this.UserPassword == '' ||
        this.ConfirmPassword == ''
      )
      {
        alert('Fill all input fields in the form');
        return;
      }
    }

    else if(this.role === "Clinic"){
      if(
        this.ClinicName == '' ||
        this.ClinicManagerName == '' ||
        this. ClinicDescription == '' ||
        this.PhoneNumber == '' ||
        this.EmailAddress == '' ||
        this.Address == '' ||
        this.UserUsername == '' ||
        this.UserPassword == '' ||
        this.ConfirmPassword == ''
      )
      {
        alert('Fill all input fields in the form!');
        return;
      }
    }

    if(this.UserPassword != this.ConfirmPassword){
      alert('Password does not match!');
      return;
    }

    const currentDate: Date = new Date();
    const dateString: string = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const currentDateTime = new Date().getTime();
    const ticks = (currentDateTime * 10000) + 621355968000000000;

    if (window.confirm('Do you still want to create your account?')) {
      this.accountObj.username = this.UserUsername!;
      this.accountObj.password = this.UserPassword!;
      this.accountObj.role = this.role;

      if(this.role === 'Patient'){
        if (this.PatientProfilePhoto) {
          try{
          const formData = new FormData();
          formData.append('file', this.PatientProfilePhoto);

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
        this.patientObj.createdat = dateString;
        this.patientObj.firstname = this.FirstName;
        this.patientObj.lastname = this.LastName;
        this.patientObj.contactno = this.PhoneNumber;
        this.patientObj.email = this.EmailAddress;
        this.patientObj.address = this.Address;
        this.patientObj.image = baseURL + 'uploads/' + this.PatientProfilePhoto.name;
        this.patientObj.birthdate = this.Birthdate;
        this.data.createPatientAccount(this.accountObj, this.patientObj)
        this.router.navigate(['/account/login']);
      }
      else if(this.role === 'Physician'){
        if (this.PhysicianProfilePhoto) {
          try{
          const formData = new FormData();
          formData.append('file', this.PhysicianProfilePhoto);

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

        if (this.PhysicianLicensePhoto) {
          try{
          const formData = new FormData();
          formData.append('file', this.PhysicianLicensePhoto);

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

        this.physicianObj.createdat = dateString;
        this.physicianObj.firstname = this.FirstName;
        this.physicianObj.lastname = this.LastName;
        this.physicianObj.contactno = this.PhoneNumber;
        this.physicianObj.email = this.EmailAddress;
        this.physicianObj.address = this.Address;
        this.physicianObj.image = baseURL + 'uploads/' + this.PhysicianProfilePhoto.name;
        this.physicianObj.license = baseURL + 'uploads/' + this.PhysicianLicensePhoto.name;

        this.physicianObj.createdat = dateString;
        this.data.createPhysicianAccount(this.accountObj, this.physicianObj)
        this.router.navigate(['/account/login']);
      }
      else if(this.role === 'Clinic'){
        if (this.ClinicFile1) {
          try{
          const formData = new FormData();
          formData.append('file', this.ClinicFile1);

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

         if (this.ClinicFile2) {
          try{
          const formData = new FormData();
          formData.append('file', this.ClinicFile1);

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

        if (this.ClinicLogo) {
          try{
          const formData = new FormData();
          formData.append('file', this.ClinicLogo);

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

        this.clinicObj.createdat = dateString;
        this.clinicObj.clinicName = this.ClinicName;
        this.clinicObj.clinicOwner = this.ClinicManagerName;
        this.clinicObj.contactno = this.PhoneNumber;
        this.clinicObj.email = this.EmailAddress;
        this.clinicObj.address = this.Address;
        this.clinicObj.description = this.ClinicDescription;
        this.clinicObj.file1 = baseURL + 'uploads/' + this.ClinicFile1.name;
        this.clinicObj.file2 = baseURL + 'uploads/' + this.ClinicFile2.name;
        this.clinicObj.logo = baseURL + 'uploads/' + this.ClinicLogo.name;

        this.clinicObj.createdat = dateString;
        this.data.createClinicAccount(this.accountObj, this.clinicObj)
        this.router.navigate(['/account/login']);
      }
    }
  }

  getPhysicianLogo(event: any){
    this.PhysicianProfilePhoto = event.target.files[0];
  }

  getSupportingFile1(event: any){
    this.ClinicFile1 = event.target.files[0];
  }

  getSupportingFile2(event: any){
    this.ClinicFile2 = event.target.files[0];
  }

  getPatientLogo(event:any) {
    this.PatientProfilePhoto = event.target.files[0];
  }

  getPhysicianLicense(event: any) {
    this.PhysicianLicensePhoto = event.target.files[0];
  }

  getClinicLogo(event: any) {
    this.ClinicLogo = event.target.files[0];
  }

  displaybday(){
    var dateString = this.Birthdate.split('-');
    this.resultBirthDate = dateString[1]+ "/" + dateString[2] + "/" + dateString[0];
  }
}
