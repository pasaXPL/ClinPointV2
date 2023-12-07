import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';
import { initTE, Select, Input, Ripple, Modal } from 'tw-elements';
import { Account, Physician, Patient, Clinic } from 'src/app/Models/model.model';
import { DataService } from 'src/app/Services/data.service';
import { FileSaverService } from 'ngx-filesaver';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { baseURL, clickSendUsername, clickSendPassword } from 'src/app/Models/BaseURL';

@Component({
  selector: 'app-signup-component',
  templateUrl: './signup-component.component.html',
  styleUrls: ['./signup-component.component.scss']
})
export class SignupComponentComponent {
  @ViewChild('viewTermsAndCondition') viewTermsAndCondition!: ElementRef;
  @ViewChild('viewOTP') viewOTP!: ElementRef;
  @ViewChild('closeModals') closeModal!: ElementRef;

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
    clinicDTINumber: '',
    file1:'',
    file2:'',
    file3:'',
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
  ClinicFile3: any =  null;
  clinicDTINumber = '';
  PhysicianSpecialization = '';
  PhysicianSecretary = '';

  isButtonDisabled = false;
  otpCode = '';
  otpReceived = '';

  successfullyCreated = false;

  accountList:any[] = [];



  constructor(private http: HttpClient, private auth:AuthService, private router:Router, private data:DataService, private fileSaverService:FileSaverService){}

  ngOnInit() {

    initTE({ Input, Ripple, Select, Modal });
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['dashboard']);
    }

    this.getAllAccounts();
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
        this.ConfirmPassword == '' ||
        this.PhysicianSpecialization == ''
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
        this.ClinicDescription == '' ||
        this.PhoneNumber == '' ||
        this.EmailAddress == '' ||
        this.Address == '' ||
        this.UserUsername == '' ||
        this.UserPassword == '' ||
        this.ConfirmPassword == ''||
        this.clinicDTINumber == ''
      )
      {
        alert('Fill all input fields in the form!');
        return;
      }
      else if(this.ClinicFile1.name == this.ClinicFile2.name || this.ClinicFile2.name == this.ClinicFile3.name || this.ClinicFile1.name == this.ClinicFile3.name){
        alert('Please don\'t use same supporting file.')
        return;
      }
    }

    if(this.UserPassword != this.ConfirmPassword){
      alert('Password does not match!');
      return;
    }


    if(this.isEmailValid() == false){
      alert('You use invalid email, Please input a valid email!')
      return;
    }

    let user = this.accountList.filter(att => att.username == this.UserUsername);
    console.log(user)
    if(user.length > 0){
      
      alert('Username is already in used, please choose another username');
      return;
    }

    this.viewTermsAndCondition.nativeElement.click();
  }

  openOtp(){
    this.closeModal.nativeElement.click();
    this.viewOTP.nativeElement.click();
    if(this.otpCode == ""){
    this.otpCode = this.generateRandomNumber().toString();
    console.log(this.otpCode)

    var apiUrl = 'https://rest.clicksend.com/v3/sms/send';

    //var credentials = btoa('pasa.johnpaul@gmail.com:06B70D06-F276-0E45-2ED4-207215C0CC05');

    var credentials = btoa(clickSendUsername + ':' + clickSendPassword);

    var headers = new HttpHeaders({
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/json'
    });


    const mn = this.PhoneNumber.slice(1);

    const data = {
      "messages": [
        {
          "source":"php",
          "body":"Your ClinPoint OTP : " + this.otpCode + "\nClinPoint OTP powered by ClickSend",
          "to":"+63" + mn,
          "from": "Jnco Solutions",
          "custom_string": "Your ClinPoint OTP : " + this.otpCode + "\nClinPoint OTP powered by ClickSend"
        }
      ]
    };
    console.log(mn)
    this.http.post(apiUrl, data, { headers: headers })
      .subscribe(
        (response) => {
          console.log('SMS sent successfully:', response);
          // Handle success, e.g., show a success message
        },
        (error) => {
          console.error('Error sending SMS:', error);
          // Handle error, e.g., show an error message
        }
      );
    }
  }

  generateRandomNumber(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  checkOtp(){
    if(this.otpCode == this.otpReceived){
      this.registerNow();

    this.closeModal.nativeElement.click();
    }
    else{
      alert('Wrong OTP. Please try again!')
    }

  }


  registerNow(){

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
        this.data.createPatientAccount(this.accountObj, this.patientObj);
        this.successfullyCreated = true;
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
        this.physicianObj.birthdate = this.Birthdate;
        this.physicianObj.image = baseURL + 'uploads/' + this.PhysicianProfilePhoto.name;
        this.physicianObj.license = baseURL + 'uploads/' + this.PhysicianLicensePhoto.name;
        this.physicianObj.specialty = this.PhysicianSpecialization;
        this.physicianObj.gender = this.PhysicianSecretary;

        this.physicianObj.createdat = dateString;
        this.data.createPhysicianAccount(this.accountObj, this.physicianObj)
        this.successfullyCreated = true;
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
          formData.append('file', this.ClinicFile2);

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

        if (this.ClinicFile3) {
          try{
          const formData = new FormData();
          formData.append('file', this.ClinicFile3);

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
        this.clinicObj.clinicDTINumber = this.clinicDTINumber;
        this.clinicObj.file3 = baseURL + 'uploads/' + this.ClinicFile3.name;
        this.clinicObj.file1 = baseURL + 'uploads/' + this.ClinicFile1.name;
        this.clinicObj.file2 = baseURL + 'uploads/' + this.ClinicFile2.name;
        this.clinicObj.logo = baseURL + 'uploads/' + this.ClinicLogo.name;

        this.clinicObj.createdat = dateString;
        this.data.createClinicAccount(this.accountObj, this.clinicObj)
        this.successfullyCreated = true;
      }

      this.closeModal.nativeElement.close();
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

  getSupportingFile3(event: any){
    this.ClinicFile3 = event.target.files[0];
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


  validateNumericInput(event: any): void {
    const charCode = event.which || event.keyCode;

    if (charCode >= 48 && charCode <= 57) {
      return;
    } else {
      event.preventDefault();
    }
  }

  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !!this.EmailAddress && emailRegex.test(this.EmailAddress);
  }


  
  getAllAccounts() {
    this.data.getAllAccounts().subscribe(res => {
      this.accountList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      })
    }, err => {
      alert('Error while fetching student data');
    })
  }

}
