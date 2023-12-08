import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Physician } from 'src/app/Models/model.model';
import { DataService } from 'src/app/Services/data.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Modal, Ripple, Input, initTE, Select, Datepicker} from "tw-elements";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-doctor-page',
  templateUrl: './doctor-page.component.html',
  styleUrls: ['./doctor-page.component.scss']
})

export class DoctorPageComponent {
  @ViewChild('openViewPhysician') viewPhysicianModal!: ElementRef;
  @ViewChild('closeModals') closeModals!: ElementRef;
  @ViewChild('viewPhysicianStatusModal') viewPhysicianStatusModal!: ElementRef;

  selectedFile : File | undefined;
  originalPhysiciansList: Physician[] = [];
  physiciansList: Physician[] = [];
  toBeDownloaded: Physician[]= [];
  physicianObj: Physician = {
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
  };

  PhysicianProfilePhoto: any = null;
  PhysicianLicensePhoto: any = null;
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

  selectedPhysician : Physician = {
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
  };

  isPhysician = false;
  searchString = "";
  role = "";
  selectedPhysicianStatus = "";
  isButtonDisabled = true;
  applicationList:any[] = [];

  constructor(private data: DataService, private auth:AuthService) { }

  ngOnInit() {
    initTE({ Modal, Ripple, Input, Select, Datepicker });
    this.role = this.auth.getAuth()!;

    if(this.role === "Physician"){
      this.isPhysician = true;
    }

    if(this.role === 'Clinic'){
      this.getAllPhysiciansOfClinic();
    }
    else{
      this.getAllPhysicians();
    }
  }

  getAllPhysicians() {
    this.data.getAllPhysicians().subscribe(res => {
      this.physiciansList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      })
      this.toBeDownloaded = this.physiciansList;
      if(this.role != 'Admin'){
        this.physiciansList = this.physiciansList.filter(att => att.status == 'Approved')
      }
      this.originalPhysiciansList = this.physiciansList;
    }, err => {
      alert('Error while fetching student data');
    })

  }

  async getAllPhysiciansOfClinic(){
    this.data.getAllClinicPhysicianApplication().subscribe(res => {
      var applications = res.map((e: any) => {
        const data = e.payload.doc.data();
        return data;
      })

      var toDisplayApplications = applications.filter(att => att.clinicId == this.auth.getToken() && (att.status == 'Pending' || att.status == 'Approved'));
      this.physiciansList.splice(0, this.physiciansList.length);
      toDisplayApplications.forEach(async att => {
        var p = await this.data.getPhysicianById(att.physicianId);
        if (p) {
          p.status = att.status;
          this.physiciansList.push(p);
        }
      });
      this.originalPhysiciansList = this.physiciansList;
      this.applicationList = toDisplayApplications;
    }, err => {
      alert('Error while fetching student data');
    })
  }

  searchPhysicians(){
    var list = this.originalPhysiciansList;
    var searchTexts = this.searchString.split(' ');
    searchTexts.forEach((text) => {

      list = list.filter((obj) =>
      obj.firstname.toUpperCase().includes(text.toUpperCase()) ||
      obj.lastname.toUpperCase().includes(text.toUpperCase()) ||
      obj.email.toUpperCase().includes(text.toUpperCase()) ||
      obj.specialty.toUpperCase().includes(text.toUpperCase()) ||
      obj.contactno.toUpperCase().includes(text.toUpperCase()) ||
      ((obj.status?.toString() || '').toUpperCase().includes(text.toUpperCase()) && (this.role == 'Clinic' || this.role == 'Admin')) ||
      obj.address.toUpperCase().includes(text.toUpperCase()));
    })

    this.physiciansList = list;
  }

  async updatePhysician(physician: Physician) :Promise<void> {
    if (window.confirm('Are you sure you want to update ' + physician.firstname + " " + physician.lastname + ' ?')) {
      await this.data.updatePhysician(physician);
    }

    this.closeModal();
  }

  openViewPhysicianModal(physician: Physician) {
    this.selectedPhysician = physician;
    this.physicianObj = physician;
    this.viewPhysicianModal.nativeElement.click();
  }

  closeModal(){
    this.closeModals.nativeElement.click();
  }

  displaybday(){
    var dateString = this.Birthdate.split('-');
    this.resultBirthDate = dateString[1]+ "/" + dateString[2] + "/" + dateString[0];
  }

  viewStatusUpdate(){
    this.viewPhysicianStatusModal.nativeElement.click();
  }

  txtbxApproveDecline(){
    if(this.selectedPhysicianStatus == 'Approve' || this.selectedPhysicianStatus == 'Decline'){
      this.isButtonDisabled = false;
    }
    else{
      this.isButtonDisabled = true;
    }
  }

  updateClinic(){
    if(this.selectedPhysicianStatus == 'Approve' || this.selectedPhysicianStatus == 'Decline'){
      if (window.confirm('Are you sure you want to update ' + this.selectedPhysician.firstname + ' ' + this.selectedPhysician.lastname + ' ?')) {
        this.physicianObj.status = this.selectedPhysicianStatus + 'd';
        var selectedApplication = this.applicationList.find(att => att.physicianId == this.physicianObj.id);
        selectedApplication.status = this.selectedPhysicianStatus + 'd';
        this.data.updatePhysician(this.physicianObj);
        this.data.updateClinicPhysicianApplication(selectedApplication);
      }
    }
    else{
      alert('Type Approve or Decline to make sure of your adjustments')
    }

    this.closeModal();
  }

  downloadPhysicianReport(){
    var report:any[] = [];

    this.physiciansList.forEach(att => {
      var d = {
        'Physician Logo': att.image,
        'Physician First Name': att.firstname,
        'Physician Last Name': att.lastname,
        'Clinic Address': att.address,
        'Contact No': att.contactno,
        'Email': att.email,
        'Physician Address': att.address,
        'Birthdate': this.changeDateFormat(att.birthdate, 'MM/dd/yyyy'),
        'License Image': att.license,
        'Created At': att.createdat,
        'Status' : att.status
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

