import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Modal, Ripple, Input, initTE, Select, Datepicker} from "tw-elements";
import { Payment } from 'src/app/Models/model.model';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { baseURL } from 'src/app/Models/BaseURL';
// import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice-page',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.scss']
})
export class InvoicePageComponent {
  @ViewChild('viewPayment') viewPayment!: ElementRef;
  @ViewChild('closeModals') closeModals!: ElementRef;
  @ViewChild('viewPaymentStatus') viewPaymentStatus!: ElementRef;

  paymentList:Payment[] = [];
  originalPaymentList: Payment[] = [];
  selectedPayment: Payment = {
    id: '',
    refno: '',
    clinicName: '',
    fromdate: '',
    todate: '',
    datesent: '',
    status: '',
    totalprice: '',
    clinicId: '',
    datecreated: '',
    receiptPhoto: ''
  };

  searchString = "";

  totalprice = '';
  fromdate = '';
  todate = '';
  datesent = '';
  role = '';
  clinicName = '';
  receiptImage : any;
  selectedPaymentStatus = '';
  isButtonDisabled = true;


  constructor(private data: DataService, private auth:AuthService, private http:HttpClient) { }

  async ngOnInit() {
    initTE({ Modal });
    this.role = this.auth.getAuth()!;

    if(this.role == 'Admin'){
      this.getAllPaymentsAdmin();
    }
    else{
      var clinic = await this.data.getClinicById(this.auth.getToken()!);
      this.clinicName = clinic?.clinicName!;
      this.getAllPayments();
    }
  }

  getAllPayments() {
    this.data.getAllPayments().subscribe(res => {
      this.paymentList = res.map((e: any) => {
        const data = e.payload.doc.data();
        return data;
      })

      this.paymentList = this.paymentList.filter(att => att.clinicId == this.auth.getToken());
      this.paymentList.sort((a, b) => b.datecreated.localeCompare(a.datecreated));
      this.originalPaymentList = this.paymentList;
    }, err => {
      alert('Error while fetching services data');
    })
  }

  getAllPaymentsAdmin() {
    this.data.getAllPayments().subscribe(res => {
      this.paymentList = res.map((e: any) => {
        const data = e.payload.doc.data();
        return data;
      })

      this.paymentList.sort((a, b) => b.datecreated.localeCompare(a.datecreated));
      this.originalPaymentList = this.paymentList;
    }, err => {
      alert('Error while fetching services data');
    })
  }

  openViewPaymentModal(payment:any) {
    this.selectedPayment = payment;
    this.viewPayment.nativeElement.click();
  }

  searchPayments(){
    var list = this.originalPaymentList;
    var searchTexts = this.searchString.split(' ');
    searchTexts.forEach((text) => {
      list = list.filter((obj:any) =>
      obj.refno.toUpperCase().includes(text.toUpperCase()) ||
      obj.clinicName.toUpperCase().includes(text.toUpperCase()) ||
      obj.status.toUpperCase().includes(text.toUpperCase()));
    })

    this.paymentList = list;
  }

  addPayment() {
    if (this.fromdate == '' || this.todate == '' || this.datesent == '' || this.totalprice == '' || this.receiptImage == null) {
      alert('Fill all input fields in the form');
      return;
    }
    const currentDate: Date = new Date();

    if (this.receiptImage) {
      try{
      const formData = new FormData();
      formData.append('file', this.receiptImage);

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

    var data = {
      id: '',
      refno: '',
      clinicName: this.clinicName,
      fromdate: this.fromdate,
      todate: this.todate,
      datesent: this.datesent,
      status: 'On Process',
      totalprice: this.totalprice,
      clinicId: this.auth.getToken(),
      datecreated: currentDate.toString(),
      receiptPhoto: baseURL + 'uploads/' + this.receiptImage.name
    };

    if (window.confirm('Are you sure you want to add payment from ' + data.fromdate + ' to ' + data.todate +'?')) {
      this.data.addPayment(data);
    }
    this.closeModal();

    this.fromdate = "";
    this.todate = "";
    this.datesent = "";
    this.totalprice = "";
  }

  closeModal(){
    this.closeModals.nativeElement.click();
  }

  async updatePayment(){
    var data = {
      id: this.selectedPayment.id,
      status: this.selectedPaymentStatus === 'Cancel' ? this.selectedPaymentStatus + "led" : this.selectedPaymentStatus + "d"
    }
    await this.data.updatePayments(data);

    this.selectedPaymentStatus = '';
    this.closeModal();
  }

  getReceiptPhoto(event: any) {
    this.receiptImage = event.target.files[0];
  }

  validateNumericInput(event: any): void {
    const charCode = event.which || event.keyCode;

    if (charCode >= 48 && charCode <= 57) {
      return;
    } else {
      event.preventDefault();
    }
  }

  formatDate(date:string): string {
    var convertedDate = date.split('-');

    // Format the date to 'MM/dd/yyyy'
    return convertedDate[1] + '/' + convertedDate[2] + '/' + convertedDate[0];
  }

  txtbxApproveDecline(){
    if(this.auth.getAuth() == 'Admin'){
      if(this.selectedPaymentStatus == 'Approve' || this.selectedPaymentStatus == 'Decline'){
        this.isButtonDisabled = false;
      }
      else{
        this.isButtonDisabled = true;
      }
    }
    else{
      if(this.selectedPaymentStatus == 'Cancel'){
        this.isButtonDisabled = false;
      }
      else{
        this.isButtonDisabled = true;
      }
    }
  }

  viewUpdatePayment(){
    this.closeModals.nativeElement.click();
    this.viewPaymentStatus.nativeElement.click();
  }
}
