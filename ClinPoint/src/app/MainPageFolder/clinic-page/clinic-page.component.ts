import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Clinic } from 'src/app/Models/model.model';
import { DataService } from 'src/app/Services/data.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Modal, Ripple, Input, initTE, Select, Datepicker} from "tw-elements";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-clinic-page',
  templateUrl: './clinic-page.component.html',
  styleUrls: ['./clinic-page.component.scss']
})

export class ClinicPageComponent {
  @ViewChild('openViewClinic') viewClinicModal!: ElementRef;
  @ViewChild('closeModals') closeModals!: ElementRef;
  @ViewChild('openViewClinicStatus') viewClinicStatusModal!: ElementRef;
  @ViewChild('viewMap') viewMap!: ElementRef;

  selectedFile : File | undefined;
  originalClinicsList: Clinic[] = [];
  toBeDownloaded:Clinic[] = [];
  clinicsList: Clinic[] = [];
  clinicObj: Clinic = {
    addressId: '',
    id: '',
    clinicName:'',
    clinicOwner: '',
    description: '',
    file1:'',
    file2: '',
    logo: '',
    contactno: '',
    dayoff: '',
    createdat: '',
    email: '',
    address: '',
    status: '',
    aisupportdescription: '',
    file3: '',
    clinicDTINumber: ''
  };

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

  selectedClinic : Clinic = {
    addressId: '',
    id: '',
    clinicName:'',
    clinicOwner: '',
    description: '',
    file1:'',
    file2: '',
    logo: '',
    contactno: '',
    dayoff: '',
    createdat: '',
    email: '',
    address: '',
    status: '',
    aisupportdescription: '',
    file3: '',
    clinicDTINumber: ''
  };

  selectedClinicStatus = "";
  isClinic = false;
  searchString = "";
  role:string = "Admin";
  isButtonDisabled:boolean = true;
  isAlreadyApplied = true;

  applicationList:any[] = [];
  selectedLocation:SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  physicianObj:any;
  physicianName = '';

  constructor(private data: DataService, private auth:AuthService, private sanitizer: DomSanitizer) { }

  async ngOnInit() {
    initTE({ Modal, Ripple, Input, Select, Datepicker });

    this.role = this.auth.getAuth()!;
    if(this.role === "Clinic"){
      this.isClinic = true;
    }

    if(this.role == 'Physician'){
      this.physicianObj = await this.data.getPhysicianById(this.auth.getToken()!)!;
      this.physicianName = this.physicianObj.firstname + ' ' + this.physicianObj.lastname;
    }

    this.getAllClinics();
    this.getAllClinicPhysicianApplications()
  }

  getAllClinics() {
    this.data.getAllClinics().subscribe(res => {
      this.clinicsList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      });

      console.log(this.clinicsList)
      this.toBeDownloaded = this.clinicsList;
      if(this.role != 'Admin'){
        this.clinicsList = this.clinicsList.filter(att => att.status == 'Approved');
      }

      this.originalClinicsList = this.clinicsList;
    }, err => {
      alert('Error while fetching student data');
    })
  }

  getAllClinicPhysicianApplications(){
    this.data.getAllClinicPhysicianApplication().subscribe(res => {
      this.applicationList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      });
      this.applicationList = this.applicationList.filter(att => att.physicianId == this.auth.getToken());
    }, err => {
      alert('Error while fetching student data');
    })
  }

  searchClinics(){
    var list = this.originalClinicsList;
    var searchTexts = this.searchString.split(' ');
    searchTexts.forEach((text) => {

      list = list.filter((obj) =>
      obj.clinicName.toUpperCase().includes(text.toUpperCase()) ||
      obj.clinicOwner.toUpperCase().includes(text.toUpperCase()) ||
      obj.email.toUpperCase().includes(text.toUpperCase()) ||
      obj.contactno.toUpperCase().includes(text.toUpperCase()) ||
      (obj.status?.toString() || '').toUpperCase().includes(text.toUpperCase()) ||
      obj.address.toUpperCase().includes(text.toUpperCase()));
    })

    this.clinicsList = list;
  }

  updateClinic(){
    if(this.selectedClinicStatus == 'Approve' || this.selectedClinicStatus == 'Decline'){
      if (window.confirm('Are you sure you want to update ' + this.selectedClinic.clinicName + ' ?')) {
        this.clinicObj.status = this.selectedClinicStatus + 'd';
        this.data.updateClinic(this.clinicObj);
      }
    }
    else{
      alert('Type Approve or Decline to make sure of your adjustments')
    }

    this.closeModal();
  }


  viewStatusUpdate(){
    this.viewClinicStatusModal.nativeElement.click();
  }

  openViewClinicModal(clinic: Clinic) {
    var clinicCpy:Clinic = clinic;
    this.selectedClinic = clinicCpy;
    this.clinicObj = clinicCpy;
    this.viewClinicModal.nativeElement.click();
  }

  txtbxApproveDecline(){
    if(this.selectedClinicStatus == 'Approve' || this.selectedClinicStatus == 'Decline'){
      this.isButtonDisabled = false;
    }
    else{
      this.isButtonDisabled = true;
    }
  }

  addApplication(){
    var applications = this.applicationList.filter(att => att.physicianId == this.auth.getToken() && this.selectedClinic.id == att.clinicId && (att.status == 'Pending' || att.status == 'Approved'));
    console.log(applications)
    if (window.confirm('Are you sure you want to apply to ' + this.selectedClinic.clinicName + ' ?')) {
      if(applications.length > 0){
        var approvedApplication = applications.find(att => att.status == 'Approved');
        if(approvedApplication){
          alert('You are already part of ' + this.selectedClinic.clinicName);
        }
        else{
          var pendingApplication = applications.find(att => att.status == 'Pending');
          if (window.confirm('Your application on ' + this.selectedClinic.clinicName + ' is already on pending, do you want to cancel your application ?'))
          {
            pendingApplication.status = 'Cancelled'
            this.data.updateClinicPhysicianApplication(pendingApplication);
          }
        }
      }
      else
      {
        console.log(this.physicianObj)
        this.data.addClinicPhysicianApplication(this.auth.getToken()!, this.selectedClinic.id, this.physicianName);
      }
    }
  }

  closeModal(){
    this.closeModals.nativeElement.click();
  }

  openMap(){
    this.closeModals.nativeElement.click();
    var loc = this.selectedClinic.address.replaceAll(' ', '%20');
    var mapsURL = `https://maps.google.com/maps?q=${loc}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    this.selectedLocation = this.sanitizer.bypassSecurityTrustResourceUrl(mapsURL);
    this.viewMap.nativeElement.click();
  }

  downloadClinicReport(){
    var report:any[] = [];

    this.toBeDownloaded.forEach(att => {
      var d = {
        'Clinic Logo': att.logo,
        'Clinic Name': att.clinicName,
        'Clinic Owner': att.clinicOwner,
        'Clinic Description': att.description,
        'Clinic Address': att.address,
        'Contact No': att.contactno,
        'Email': att.email,
        'DTI Number': att.clinicDTINumber,
        'Supporting Documents 1': att.file1,
        'Supporting Documents 2': att.file2,
        'Supporting Documents 3': att.file3,
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

