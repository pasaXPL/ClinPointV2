import { Component } from '@angular/core';
import {
  Account,
  Patient,
  Clinic,
  Physician,
} from 'src/app/Models/model.model';
import { AuthService } from 'src/app/Services/auth.service';
import { DataService } from 'src/app/Services/data.service';
import { Modal, Ripple, Input, initTE, Select, Datepicker } from 'tw-elements';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.scss'],
})
export class SettingPageComponent {
  accountObj: Account | any = {
    addressId: '',
    id: '',
    username: '',
    password: '',
    role: '',
  };

  patientObj: Patient | any = {
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
    image: '',
  };

  physicianObj: Physician | any = {
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
    aisupportdescription: '',
  };

  clinicObj: Clinic | any = {
    addressId: '',
    id: '',
    clinicName: '',
    clinicOwner: '',
    description: '',
    file1: '',
    file2: '',
    logo: '',
    contactno: '',
    dayoff: '',
    createdat: '',
    email: '',
    address: '',
    status: 'Pending',
    aisupportdescription: '',
  };

  token: string = '';
  role: string = '';
  isClinic = false;
  isPatient = false;
  isAdmin = false;
  isPhysician = false;
  name = '';
  birthdate = '';
  resultBirthdate = '';

  toBeUpdate: any;

  ClinicFile1: any = null;
  PhysicianProfilePhoto: any = null;
  PatientProfilePhoto: any = null;
  PhysicianLicensePhoto: any = null;
  ClinicFile2: any = null;
  ClinicLogo: any = null;
  ClinicFile3: any = null;

  password = '';
  cpassword = '';

  //scheduler
  // amtime = [
  //   '8:00 AM',
  //   '8:30 AM',
  //   '9:00 AM',
  //   '9:30 AM',
  //   '10:00 AM',
  //   '10:30 AM',
  //   '11:00 AM',
  //   '11:30 AM',
  // ];

  // pmtime = [
  //   '12:00 PM',
  //   '12:30 PM',
  //   '1:00 PM',
  //   '1:30 PM',
  //   '2:00 PM',
  //   '2:30 PM',
  //   '3:00 PM',
  //   '3:30 PM',
  //   '4:00 PM',
  //   '4:30 PM',
  //   '5:00 PM',
  //   '5:30 PM',
  //   '6:00 PM',
  //   '6:30 PM',
  //   '7:00 PM',
  //   '7:30 PM',
  //   '8:00 PM',
  //   '8:30 PM',
  //   '9:00 PM',
  // ];


  amtime = [
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
  ];

  pmtime = [
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
  ];


  morningStarting = '';
  morningEnding = '';
  afternoonStarting = '';
  afternoonEnding = '';
  scheduleList: any[] = [];
  physicianSchedule: any;

  constructor(
    private auth: AuthService,
    private data: DataService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    initTE({ Modal, Ripple, Input, Select, Datepicker });
  }

  async ngOnInit() {
    initTE({ Modal, Ripple, Input, Select, Datepicker });

    this.role = this.auth.getAuth()!;
    this.token = this.auth.getToken()!;
    if (this.role == 'Clinic') {
      this.clinicObj = await this.data.getClinicById(this.token)!;
      console.log(this.clinicObj);
      this.name = this.clinicObj.clinicName;
      this.toBeUpdate = this.clinicObj;
    } else if (this.role == 'Patient') {
      this.patientObj = await this.data.getPatientById(this.token)!;
      this.name = this.patientObj.firstname + ' ' + this.patientObj.lastname;
      this.toBeUpdate = this.patientObj;
    } else if (this.role == 'Physician' || this.role == 'Secretary') {
      this.physicianObj = await this.data.getPhysicianById(this.token)!;
      this.name =
        this.physicianObj.firstname + ' ' + this.physicianObj.lastname;
      this.toBeUpdate = this.physicianObj;
      console.log(this.physicianObj);
    }

    // this.morningStarting = "8:00 AM";
    // this.morningEnding = "11:30 AM"
    // this.afternoonStarting = "12:00 PM"
    // this.afternoonEnding = "9:00 PM";
    this.getAllSchedules();
  }

  getAllSchedules() {
    this.data.getAllPhysicianTimeSchedule().subscribe(
      (res) => {
        this.scheduleList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.addressId = e.payload.doc.id;
          return data;
        });

        this.physicianSchedule = this.scheduleList.find(
          (att) => att.id == this.token
        );

        if (this.physicianSchedule) {
          this.morningStarting = this.physicianSchedule.morningStarting;
          this.morningEnding = this.physicianSchedule.morningEnding;
          this.afternoonStarting = this.physicianSchedule.afternoonStarting;
          this.afternoonEnding = this.physicianSchedule.afternoonEnding;
        } else {
          // this.morningStarting = '8:00 AM';
          // this.morningEnding = '11:30 AM';
          // this.afternoonStarting = '12:00 PM';
          // this.afternoonEnding = '9:00 PM';

          this.morningStarting = '8:00 AM';
          this.morningEnding = '11:00 AM';
          this.afternoonStarting = '1:00 PM';
          this.afternoonEnding = '9:00 PM';
        }
      },
      (err) => {
        alert('Error while fetching student data');
      }
    );
  }

  displaybday(toBeUpdate: any) {
    try {
      var dateString = toBeUpdate.birthdate.split('-');
      this.resultBirthdate =
        dateString[1] + '/' + dateString[2] + '/' + dateString[0];
    } catch {}

    console.log('test');
  }

  updatePhysician(physician: any) {
    if (
      window.confirm(
        'Are you sure you want to update ' +
          physician.firstname +
          ' ' +
          physician.lastname +
          ' ?'
      )
    ) {
      this.data.updatePhysician(physician);
    }
  }

  updatePatient(patient: any) {
    if (
      window.confirm(
        'Are you sure you want to update ' +
          patient.firstname +
          ' ' +
          patient.lastname +
          ' ?'
      )
    ) {
      this.data.updatePatient(patient);
    }
  }

  updateClinic(clinic: any) {
    if (
      window.confirm(
        'Are you sure you want to update ' + clinic.clinicName + ' ?'
      )
    ) {
      this.data.updateClinic(clinic);
    }
  }

  getPhysicianLogo(event: any) {
    this.PhysicianProfilePhoto = event.target.files[0];
  }

  getSupportingFile1(event: any) {
    this.ClinicFile1 = event.target.files[0];
  }

  getSupportingFile2(event: any) {
    this.ClinicFile2 = event.target.files[0];
  }

  getSupportingFile3(event: any) {
    this.ClinicFile3 = event.target.files[0];
  }

  getPatientLogo(event: any) {
    this.PatientProfilePhoto = event.target.files[0];
  }

  getPhysicianLicense(event: any) {
    this.PhysicianLicensePhoto = event.target.files[0];
  }

  getClinicLogo(event: any) {
    this.ClinicLogo = event.target.files[0];
  }

  logoutUser() {
    if (window.confirm('Are you sure you want to logout?')) {
      this.auth.logout();
    }
  }

  changePassword() {
    if (this.cpassword == '' || this.password == '') {
      alert('Change password Failed. Please fill up the form properly');
    } else if (this.cpassword != this.password) {
      alert('Change password Failed. Password does not match');
    } else {
      if (window.confirm('Are you sure you want to change your password?')) {
        var acc = {
          id: this.auth.getToken(),
          password: this.password,
        };
        this.data.updateAccountPassword(acc);
      }
    }

    this.password = '';
    this.cpassword = '';
  }

  gotoServices() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.router.navigate(['/mobiledashboard/services']);
    } else {
      this.router.navigate(['/dashboard/services']);
    }
  }

  checkSchedule() {
    let msindex = this.amtime.findIndex((att) => att == this.morningStarting);
    let meindex = this.amtime.findIndex((att) => att == this.morningEnding);
    let esindex = this.pmtime.findIndex((att) => att == this.afternoonStarting);
    let eeindex = this.pmtime.findIndex((att) => att == this.afternoonEnding);

    if (msindex >= meindex) {
      alert(
        'Please properly set your starting and ending time in the morning schedule'
      );
      return;
    }

    if (esindex >= eeindex) {
      alert(
        'Please properly set your starting and ending time in the afternoon schedule'
      );
      return;
    }
    if (window.confirm('Are you sure you want to update your schedule?')) {
      if (this.physicianSchedule) {
        this.physicianSchedule.morningStarting = this.morningStarting;
        this.physicianSchedule.morningEnding = this.morningEnding;
        this.physicianSchedule.afternoonStarting = this.afternoonStarting;
        this.physicianSchedule.afternoonEnding = this.afternoonEnding;

        this.data.updatePhysicianTimeSchedule(this.physicianSchedule);
      } else {
        let d = {
          id: this.token,
          morningStarting: this.morningStarting,
          morningEnding: this.morningEnding,
          afternoonStarting: this.afternoonStarting,
          afternoonEnding: this.afternoonEnding,
        };

        this.data.addPhysicianTimeSchedule(d);
      }
    }
  }
}
