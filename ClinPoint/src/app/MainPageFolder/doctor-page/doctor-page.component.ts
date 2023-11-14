import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Physician } from 'src/app/Models/model.model';
import { DataService } from 'src/app/Services/data.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Modal, Ripple, Input, initTE, Select, Datepicker} from "tw-elements";

@Component({
  selector: 'app-doctor-page',
  templateUrl: './doctor-page.component.html',
  styleUrls: ['./doctor-page.component.scss']
})

export class DoctorPageComponent {
  @ViewChild('openViewPhysician') viewPhysicianModal!: ElementRef;
  @ViewChild('closeModals') closeModals!: ElementRef;

  selectedFile : File | undefined;
  originalPhysiciansList: Physician[] = [];
  physiciansList: Physician[] = [];
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

  constructor(private data: DataService, private auth:AuthService) { }

  ngOnInit() {
    initTE({ Modal, Ripple, Input, Select, Datepicker });

    if(this.auth.getAuth() === "Physician"){
      this.isPhysician = true;
    }

    this.getAllPhysicians();
  }

  getAllPhysicians() {
    this.data.getAllPhysicians().subscribe(res => {
      this.physiciansList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      })

      this.originalPhysiciansList = this.physiciansList;
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
      obj.contactno.toUpperCase().includes(text.toUpperCase()) ||
      (obj.status?.toString() || '').toUpperCase().includes(text.toUpperCase()) ||
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
    this.viewPhysicianModal.nativeElement.click();
  }

  closeModal(){
    this.closeModals.nativeElement.click();
  }

  displaybday(){
    var dateString = this.Birthdate.split('-');
    this.resultBirthDate = dateString[1]+ "/" + dateString[2] + "/" + dateString[0];
  }
}

