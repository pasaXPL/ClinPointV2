import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Modal, Ripple, Input, initTE, Select, Datepicker } from 'tw-elements';
import { Payment } from 'src/app/Models/model.model';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { baseURL } from 'src/app/Models/BaseURL';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-scheduler-page',
  templateUrl: './scheduler-page.component.html',
  styleUrls: ['./scheduler-page.component.scss']
})
export class SchedulerPageComponent {
  @ViewChild('viewSecretary') viewSecretary!: ElementRef;
  @ViewChild('closeModals') closeModal!: ElementRef;

  firstname = '';
  lastname = '';
  contactno = '';
  email = '';
  address = '';
  secretaryImage: any = null;
  birthdate = '';
  username = '';
  password = '';
  confirmpassword = '';

  secretaryList:any[] = [];
  originalSecretaryList: any[] = [];
  accountList: any[] = [];

  selectedSecretary:any;

  token = '';

  constructor(private data:DataService, private auth:AuthService, private http: HttpClient){}

  ngOnInit(){
    this.token = this.auth.getToken()!;
    this.getAllSecretary();
    this.getAllAccount();
  }

  getAllSecretary() {
    this.data.getAllSecretary().subscribe(res => {
      this.secretaryList = res.map((e: any) => {
        const data = e.payload.doc.data();
        return data;
      })

      this.secretaryList = this.secretaryList.filter(att => att.id == this.token);
      this.originalSecretaryList = this.secretaryList;
    }, err => {
      alert('Error while fetching student data');
    })
  }

  getAllAccount(){
    this.data.getAllAccounts().subscribe(res => {
      this.accountList = res.map((e: any) => {
        const data = e.payload.doc.data();
        return data;
      })
    });
  }

  selectSecretary(secretary:any){
    this.selectedSecretary = secretary;
    this.viewSecretary.nativeElement.click();
  }

  addSecretary(){
    if(this.firstname == '' ||
      this.lastname == '' ||
      this.contactno == '' ||
      this.email == '' ||
      this.address == ''||
      this.secretaryImage == null ||
      this.birthdate == '' ||
      this.username == ''  ||
      this.confirmpassword == ''  ||
      this.password == '' )
    {
      alert('Please fill out the form to create your secretary');
      return;
    }

    if(this.password != this.confirmpassword){
      alert('Password doesn\t match!');
      return;
    }

    if(this.accountList.filter(att => att.username == this.username).length > 0){
      alert('Username is already existing, Please try again!');
      return;
    }

    if(!this.isEmailValid()){
      alert('Please input a valid email');
      return;
    }

    if (window.confirm('Are you sure you want to add ' + this.firstname + ' ' + this.lastname + ' as your secretary?')){
      let secretary = {
        id: this.token,
        addressId: '',
        firstname: this.firstname,
        lastname: this.lastname,
        secretaryImage: baseURL + 'uploads/' + this.secretaryImage.name,
        email: this.email,
        contactno: this.contactno,
        birthdate: this.birthdate,
        address: this.address,
        status: 'Active'
      }

      let account = {
        id: this.token,
        username: this.username,
        password: this.password,
        addressId: '',
        role: 'Secretary',
        status: 'Active'
      }

      if (this.secretaryImage) {
        try{
        const formData = new FormData();
        formData.append('file', this.secretaryImage);

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

      this.data.addSecretary(secretary, account);
    }

  }

  getSecretaryLogo(event:any) {
    this.secretaryImage = event.target.files[0];
  }

  archiveSecretary(){
    if (window.confirm('Are you sure you want to change the status of your secretary?')){
      if(this.selectedSecretary.status == 'Active'){
        this.selectedSecretary.status = 'Inactive';
      }
      else {
        this.selectedSecretary.status = 'Active';
      }
      this.data.updateSecretary(this.selectedSecretary);
    }
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
    return !!this.email && emailRegex.test(this.email);
  }

}
