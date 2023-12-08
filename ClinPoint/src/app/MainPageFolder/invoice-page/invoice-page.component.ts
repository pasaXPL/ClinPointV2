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
  selector: 'app-invoice-page',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.scss'],
})
export class InvoicePageComponent {

  @ViewChild('pdfPrinter') pdfPrinter!: ElementRef;
  @ViewChild('viewPayment') viewPayment!: ElementRef;
  @ViewChild('closeModals') closeModals!: ElementRef;
  @ViewChild('viewPaymentStatus') viewPaymentStatus!: ElementRef;
  @ViewChild('addPaymentReceipt') addPaymentReceipt!: ElementRef;

  paymentList: Payment[] = [];
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
    receiptPhoto: '',
    subscriptionType: '',
    dateUpdated: null,
    expirationDate: null
  };

  searchString = '';

  totalprice = '';
  fromdate = '';
  todate = '';
  datesent = '';
  role = '';
  clinicName = '';
  receiptImage: any;
  selectedPaymentStatus = '';
  isButtonDisabled = true;
  currentDate = '';

  isAlreadySubscribed = true;


  subscriptionList=  [
    "Platinum Subscription : 6 Months for P2,500",
    "Gold Subscription: 1 Year for P4,500"
  ];
  subscriptionType = '';


  constructor(
    private data: DataService,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    initTE({ Modal, Ripple, Input, Select });
    this.role = this.auth.getAuth()!;

    if (this.role == 'Admin') {
      this.getAllPaymentsAdmin();
    } else {
      var clinic = await this.data.getClinicById(this.auth.getToken()!);
      this.clinicName = clinic?.clinicName!;
      this.getAllPayments();
    }

    var cdate = new Date();
    this.currentDate = cdate.toDateString();
  }

  getAllPayments() {
    this.data.getAllPayments().subscribe(
      (res) => {
        this.paymentList = res.map((e: any) => {
          const data = e.payload.doc.data();
          return data;
        });

        this.paymentList = this.paymentList.filter(
          (att) => att.clinicId == this.auth.getToken()
        );
        this.paymentList.sort((a, b) =>
          b.datecreated.localeCompare(a.datecreated)
        );
        this.originalPaymentList = this.paymentList;

        this.checkSubscription();
      },
      (err) => {
        alert('Error while fetching services data');
      }
    );
  }

  getAllPaymentsAdmin() {
    this.data.getAllPayments().subscribe(
      (res) => {
        this.paymentList = res.map((e: any) => {
          const data = e.payload.doc.data();
          return data;
        });

        this.paymentList.sort((a, b) =>
          b.datecreated.localeCompare(a.datecreated)
        );
        this.originalPaymentList = this.paymentList;
      },
      (err) => {
        alert('Error while fetching services data');
      }
    );
  }

  openViewPaymentModal(payment: any) {
    this.selectedPayment = payment;
    this.viewPayment.nativeElement.click();
  }

  searchPayments() {
    var list = this.originalPaymentList;
    var searchTexts = this.searchString.split(' ');
    searchTexts.forEach((text) => {
      list = list.filter(
        (obj: any) =>
          obj.refno.toUpperCase().includes(text.toUpperCase()) ||
          obj.clinicName.toUpperCase().includes(text.toUpperCase()) ||
          obj.status.toUpperCase().includes(text.toUpperCase())
      );
    });

    this.paymentList = list;
  }

  

  selectPlatinum(selection: string){
    if(selection == 'plat'){
      
      this.subscriptionType = "Platinum Subscription : 1 Year for P4,500";
      this.totalprice = 'P 4,500'
      this.addPaymentReceipt.nativeElement.click();
    }
    else{
      this.totalprice = 'P 2,500'
      this.subscriptionType = "Gold Subscription : 6 Months for P2,500"
      this.addPaymentReceipt.nativeElement.click();
    }
  }


  checkSubscription(){
    let cdate = new Date;
    let latestPayment = this.originalPaymentList.filter(att => att.status == 'Approved' && att.dateUpdated.toDate() <= cdate && att.expirationDate.toDate() >= cdate);
    if(latestPayment.length > 0){
      this.isAlreadySubscribed = true;
    }
    else{
      this.isAlreadySubscribed = false;
    }
  }

  addPayment() {
    if (
      this.receiptImage == null 
    ) {
      alert('Please add a receipt to proceed');
      return;
    }

    // if(true){
    //   let latestPayment = this.originalPaymentList.filter(att => att.status == 'Approved')[0];
    //   console.log(latestPayment.dateUpdated.toDate().toDateString());

    //   alert(latestPayment.dateUpdated.toDate().toDateString());
    //   return;
    // }


    const currentDate: Date = new Date();
    this.datesent = currentDate.toDateString();

    if (this.receiptImage) {
      try {
        const formData = new FormData();
        formData.append('file', this.receiptImage);

        this.http
          .post(baseURL + 'upload', formData, { responseType: 'text' })
          .subscribe(
            (response) => {
              console.log('File uploaded successfully', response);
            },
            (error) => {
              console.error('Error uploading the file', error);
            }
          );
      } catch {}
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
      receiptPhoto: baseURL + 'uploads/' + this.receiptImage.name,
      subscriptionType: this.subscriptionType
    };

    if (
      window.confirm(
        'Are you sure you want to add payment from ' +
          data.fromdate +
          ' to ' +
          data.todate +
          '?'
      )
    ) {
      this.data.addPayment(data);
    }
    this.closeModal();

    this.fromdate = '';
    this.todate = '';
    this.datesent = '';
    this.totalprice = '';
  }

  closeModal() {
    this.closeModals.nativeElement.click();
  }

  async updatePayment() {
    let edate = new Date;
    let cdate = new Date;

    if(this.selectedPayment.subscriptionType == 'Platinum Subscription : 1 Year for P4,500'){
      edate.setFullYear(edate.getFullYear() + 1);
    }
    else{
      const targetMonth = (edate.getMonth() + 6) % 12;
      const targetYear = edate.getFullYear() + Math.floor((edate.getMonth() + 6) / 12);

      // Set the target month and year
      edate.setMonth(targetMonth);
      edate.setFullYear(targetYear);
    }

    var data = {
      id: this.selectedPayment.id,
      status:
        this.selectedPaymentStatus === 'Cancel'
          ? this.selectedPaymentStatus + 'led'
          : this.selectedPaymentStatus + 'd',
      dateUpdated: cdate,
      expirationDate: edate
    };

    await this.data.updatePayments(data);

    if(data.status == 'Approved')
    var approveClinicData:any = {
      id: this.selectedPayment.clinicId,
      status: 'Approved'
    }

    await this.data.updateClinic(approveClinicData);

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

  formatDate(date: string): string {
    var convertedDate = date.split('-');

    // Format the date to 'MM/dd/yyyy'
    return convertedDate[1] + '/' + convertedDate[2] + '/' + convertedDate[0];
  }

  txtbxApproveDecline() {
    if (this.auth.getAuth() == 'Admin') {
      if (
        this.selectedPaymentStatus == 'Approve' ||
        this.selectedPaymentStatus == 'Decline'
      ) {
        this.isButtonDisabled = false;
      } else {
        this.isButtonDisabled = true;
      }
    } else {
      if (this.selectedPaymentStatus == 'Cancel') {
        this.isButtonDisabled = false;
      } else {
        this.isButtonDisabled = true;
      }
    }
  }

  viewUpdatePayment() {
    this.closeModals.nativeElement.click();
    this.viewPaymentStatus.nativeElement.click();
  }

  public downloadAsPDF() {
    const doc = new jsPDF();
    doc.setFont('Arial', 'normal');

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(179, 182, 182);
    doc.rect(10, 10, 100, 10, 'F');
    doc.text('ClinPoint', 15, 18);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.text(
      'This is the official receipt of ClinPoint recognizing that ClinPoint received a certain amount for the subscription of the clinic.',
      15,
      30
    );

    doc.setDrawColor(0);
    doc.setLineWidth(0.2);

    doc.rect(15, 45, 90, 10);
    doc.text('Reference No: ' + this.selectedPayment.id, 20, 53);

    doc.rect(15, 60, 90, 10);
    doc.text('Received From: ' + this.selectedPayment.clinicName, 20, 68);

    doc.rect(15, 75, 90, 10);
    doc.text('Subscription From: ' + this.selectedPayment.fromdate, 20, 83);

    doc.rect(15, 90, 90, 10);
    doc.text('Subscription To: ' + this.selectedPayment.todate, 20, 98);

    doc.rect(15, 105, 90, 10);
    doc.text('Sent on: ' + this.selectedPayment.datesent, 20, 113);

    doc.rect(15, 120, 90, 10);
    doc.text('Amount: ' + this.selectedPayment.totalprice, 20, 128);

    doc.rect(15, 135, 90, 10);
    doc.text('Date today: ' + this.currentDate, 20, 143);

    doc.save(this.selectedPayment.id + '.pdf');
  }

  downloadInvoiceReport(){
    var report:any[] = [];

    this.paymentList.forEach(att => {
      var d = {
        'Reference Number': att.refno,
        'Clinic Name': att.clinicName,
        'From Date': this.changeDateFormat(att.fromdate, 'MM/dd/yyyy'),
        'End Date': this.changeDateFormat(att.todate, 'MM/dd/yyyy'),
        'Payment Sent Date': this.changeDateFormat(att.datesent, 'MM/dd/yyyy'),
        'Total Payment': att.totalprice,
        'Status': att.status,
        'Receipt Photo': att.receiptPhoto
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
