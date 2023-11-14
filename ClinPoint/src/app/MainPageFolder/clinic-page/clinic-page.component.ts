import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Clinic } from 'src/app/Models/model.model';
import { DataService } from 'src/app/Services/data.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Modal, Ripple, Input, initTE, Select, Datepicker} from "tw-elements";

@Component({
  selector: 'app-clinic-page',
  templateUrl: './clinic-page.component.html',
  styleUrls: ['./clinic-page.component.scss']
})

export class ClinicPageComponent {
  @ViewChild('openViewClinic') viewClinicModal!: ElementRef;
  @ViewChild('closeModals') closeModals!: ElementRef;

  selectedFile : File | undefined;
  originalClinicsList: Clinic[] = [];
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
    aisupportdescription: ''
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
    aisupportdescription: ''
  };

  isClinic = false;
  searchString = "";

  constructor(private data: DataService, private auth:AuthService) { }

  ngOnInit() {
    initTE({ Modal, Ripple, Input, Select, Datepicker });

    if(this.auth.getAuth() === "Clinic"){
      this.isClinic = true;
    }

    this.getAllClinics();
  }

  getAllClinics() {
    this.data.getAllClinics().subscribe(res => {
      this.clinicsList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      })

      this.originalClinicsList = this.clinicsList;
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

  async updateClinic(clinic: Clinic) :Promise<void> {
    if (window.confirm('Are you sure you want to update ' + clinic.clinicName + ' ?')) {
      await this.data.updateClinic(clinic);
    }

    this.closeModal();
  }

  openViewClinicModal(clinic: Clinic) {
    this.selectedClinic = clinic;
    this.viewClinicModal.nativeElement.click();
  }

  closeModal(){
    this.closeModals.nativeElement.click();
  }
}

