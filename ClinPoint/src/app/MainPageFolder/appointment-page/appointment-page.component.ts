import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Modal, Ripple, Input, initTE, Select, Datepicker } from 'tw-elements';
import { Services } from 'src/app/Models/model.model';

@Component({
  selector: 'app-appointment-page',
  templateUrl: './appointment-page.component.html',
  styleUrls: ['./appointment-page.component.scss'],
})
export class AppointmentPageComponent {
  @ViewChild('openViewAppointment') viewServiceModal!: ElementRef;
  @ViewChild('closeModals') closeModals!: ElementRef;

  servicesList: any[] = [];
  approvedPhysiciansList: any[] = [];
  clinicList: any[] = [];
  patientList: any[] = [];

  originalservicesList: any[] = [];
  originalapprovedPhysiciansList: any[] = [];
  originalclinicList: any[] = [];
  originalpatientList: any[] = [];

  appointmentList: any[] = [];
  originalAppointmentList: any[] = [];

  selectedApprovedPhysicians: any;
  selectedPhysicianName = '';
  selectedClinic: any;
  selectedClinicName = '';
  selectedPatient: any;
  selectedAppointment: any;
  selectedServiceName = '';
  selectedServiceDescription = '';
  selectedServicePrice = '';
  selectedPatientName = '';
  selectedService: any;
  appointmentDate: string = '';
  appointmentDescription: string = '';

  searchString = '';

  name = '';
  description = '';
  price = '';

  role = '';
  token = '';

  constructor(private data: DataService, private auth: AuthService) {}

  ngOnInit() {
    initTE({ Modal });
    var today = new Date();
    this.currentDate = today;
    this.functionSetDaysInMonth();

    this.token = this.auth.getToken()!;
    this.role = this.auth.getAuth()!;

    this.getAllClinics();
    this.getAllPatient();
    this.getAllClinicsPhysicians();
    this.getAllServices();
    this.getAllAppointment();
  }

  getAllServices() {
    this.data.getAllServices().subscribe(
      (res) => {
        this.servicesList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.addressId = e.payload.doc.id;
          return data;
        });

        if (this.role == 'Physician') {
          this.servicesList = this.servicesList.filter(
            (att) => att.physicianId == this.token
          );
          this.originalservicesList = this.servicesList;
        }

        this.originalservicesList = this.servicesList;
      },
      (err) => {
        alert('Error while fetching services data');
      }
    );
  }

  getAllClinics() {
    this.data.getAllClinics().subscribe(
      (res) => {
        this.clinicList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.addressId = e.payload.doc.id;
          return data;
        });

        if (this.role == 'Clinic') {
          this.selectedClinic = this.clinicList.find(
            (att) => att.id == this.token
          );
          this.selectedClinicName = this.selectedClinic.clinicName;
        }

        this.clinicList = this.clinicList.filter(
          (att) => att.status == 'Approved'
        );

        this.originalclinicList = this.clinicList;
      },
      (err) => {
        alert('Error while fetching services data');
      }
    );
  }

  getAllClinicsPhysicians() {
    this.data.getAllClinicPhysicianApplication().subscribe(
      (res) => {
        this.approvedPhysiciansList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.addressId = e.payload.doc.id;
          return data;
        });

        if (this.role == 'Clinic') {
          this.approvedPhysiciansList = this.approvedPhysiciansList.filter(
            (att) => att.clinicId == this.token && att.status == 'Approved'
          );
        } else if (this.role == 'Physician') {
          this.approvedPhysiciansList = this.approvedPhysiciansList.filter(
            (att) => att.physicianId == this.token && att.status == 'Approved'
          );
          this.selectedApprovedPhysicians = this.approvedPhysiciansList[0];
          this.selectedPhysicianName =
            this.approvedPhysiciansList[0].physicianName;
        } else {
          this.approvedPhysiciansList = this.approvedPhysiciansList.filter(
            (att) => att.status == 'Approved'
          );
        }

        this.originalapprovedPhysiciansList = this.approvedPhysiciansList;
      },
      (err) => {
        alert('Error while fetching services data');
      }
    );
  }

  getAllPatient() {
    this.data.getAllPatients().subscribe(
      (res) => {
        this.patientList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.addressId = e.payload.doc.id;
          return data;
        });

        if (this.role == 'Patient') {
          this.selectedPatient = this.patientList.find(
            (att) => att.id == this.token
          );
          this.selectedPatientName =
            this.selectedPatient.firstname +
            ' ' +
            this.selectedPatient.lastname;
        }

        this.originalpatientList = this.patientList;
      },
      (err) => {
        alert('Error while fetching services data');
      }
    );
  }

  getAllAppointment() {
    this.data.getAllAppointments().subscribe(
      (res) => {
        this.appointmentList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.addressId = e.payload.doc.id;
          return data;
        });

        if (this.role == 'Patient') {
          this.appointmentList = this.appointmentList.filter(att => att.patientId == this.token);
        }
        else if(this.role == 'Clinic'){
          this.appointmentList = this.appointmentList.filter(att => att.clinicId == this.token);
        }
        else if(this.role == 'Physician'){
          this.appointmentList = this.appointmentList.filter(att => att.physicianId == this.token);
        }

        this.originalAppointmentList = this.appointmentList;
      },
      (err) => {
        alert('Error while fetching services data');
      }
    );
  }

  openViewServiceModal(service: any) {
    this.selectedService = service;
    this.viewServiceModal.nativeElement.click();
  }

  openAppointmentModal(appointment:any){
    this.selectedAppointment = appointment;
    this.viewServiceModal.nativeElement.click();
  }

  searchAppointments() {
    var list = this.originalAppointmentList;
    var searchTexts = this.searchString.split(' ');
    searchTexts.forEach((text) => {
      list = list.filter(
        (obj: any) =>
          obj.clinicName.toUpperCase().includes(text.toUpperCase()) ||
          obj.id.toUpperCase().includes(text.toUpperCase()) ||
          obj.service.toUpperCase().includes(text.toUpperCase()) ||
          obj.physicianName.toUpperCase().includes(text.toUpperCase()) ||
          obj.status.toUpperCase().includes(text.toUpperCase() ||
          obj.patientName.toUpperCase().includes(text.toUpperCase()))
      );
    });

    this.appointmentList = list;
  }

  addService() {
    if (this.name == '' || this.description == '' || this.price == '') {
      alert('Fill all input fields in the form');
      return;
    }
    const currentDate: Date = new Date();
    const dateString: string = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    var data = {
      id: '',
      name: this.name,
      description: this.description,
      price: this.price,
      physicianId: this.auth.getToken(),
    };

    if (
      window.confirm('Are you sure you want to add ' + this.name + ' service?')
    ) {
      this.data.addServices(data);
    }
    this.closeModal();

    this.name = '';
    this.description = '';
    this.price = '';
  }

  closeModal() {
    this.closeModals.nativeElement.click();
  }

  async updateService() {
    if (
      window.confirm(
        'Are you sure you want to update ' + this.selectedService.name + ' ?'
      )
    ) {
      await this.data.updateServices(this.selectedService);
    }

    this.closeModal();
  }

  deleteService() {
    if (
      window.confirm(
        'Are you sure you want to delete ' + this.selectedService.name + ' ?'
      )
    ) {
      this.data.deleteService(this.selectedService);
    }
    this.closeModal();
  }

  //CALENDAR
  currentDate: Date = new Date();
  startDayOfWeek: number = 0;
  daysInMonth: string[] = [];

  functionSetDaysInMonth() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const dayOfWeek = firstDayOfMonth.getDay();

    const lastDay = new Date(year, month + 1, 0).getDate();
    const daysArray: string[] = [];

    for (let i = 0; i < dayOfWeek; i++) {
      daysArray.push('');
    }

    for (let i = 1; i <= lastDay; i++) {
      daysArray.push(i.toString());
    }

    this.daysInMonth = daysArray;
  }

  changeMonth(monthChange: number): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + monthChange);
    this.functionSetDaysInMonth();
    console.log(this.currentDate.toDateString());
  }

  formatDate(inputDate: Date, format: string): string {
    if (!inputDate) return '';

    const padZero = (value: number) => (value < 10 ? `0${value}` : `${value}`);
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const parts: { [key: string]: number | string } = {
      yyyy: inputDate.getFullYear(),
      MM: padZero(inputDate.getMonth() + 1),
      Mm: monthNames[inputDate.getMonth()],
      dd: padZero(inputDate.getDate()),
      HH: padZero(inputDate.getHours()),
      hh: padZero(
        inputDate.getHours() > 12
          ? inputDate.getHours() - 12
          : inputDate.getHours()
      ),
      mm: padZero(inputDate.getMinutes()),
      ss: padZero(inputDate.getSeconds()),
      tt: inputDate.getHours() < 12 ? 'AM' : 'PM',
    };

    return format.replace(/yyyy|MM|Mm|dd|HH|hh|mm|ss|tt/g, (match) =>
      parts[match].toString()
    );
  }

  //CLINICS
  filteredClinics: any[] = [];
  filterClinics(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    //if role == 'Clinic' none will happen
    if (this.role == 'Physician') {
      try {
        this.filteredClinics = this.clinicList.filter(
          (att) =>
            att.clinicName.toLowerCase().includes(filterValue) &&
            this.approvedPhysiciansList.some(
              (physician) => physician.clinicId === att.id
            )
        );
      } catch {}
    } else {
      this.filteredClinics = this.clinicList;
    }

    if (this.role != 'Physician') {
      this.selectedApprovedPhysicians = null;
      this.selectedPhysicianName = '';

      this.selectedService = null;
      this.selectedServiceDescription = '';
      this.selectedServicePrice = '';
      this.selectedServiceName = '';
    }
  }

  selectClinic(item: any): void {
    this.selectedClinicName = item.clinicName;
    this.selectedClinic = item;
    this.filteredClinics = [];
  }

  hasClinicRunOnFocus: boolean = false;
  onClinicFocus() {
    if (!this.hasClinicRunOnFocus) {
      this.selectedClinicName = '';
      this.selectedClinic = null;
      this.hasClinicRunOnFocus = true;
      if (this.role == 'Physician') {
        try {
          this.filteredClinics = this.clinicList.filter(
            (att) =>
              att.clinicName.toLowerCase().includes('') &&
              this.approvedPhysiciansList.some(
                (physician) => physician.clinicId === att.id
              )
          );
        } catch {}
      } else {
        this.filteredClinics = this.clinicList;
      }

      if (this.role != 'Physician') {
        this.selectedApprovedPhysicians = null;
        this.selectedPhysicianName = '';

        this.selectedService = null;
        this.selectedServiceDescription = '';
        this.selectedServicePrice = '';
        this.selectedServiceName = '';
      }
    }
  }

  onClinicBlur() {
    console.log('Input focus is removed');
    setTimeout(() => {
      try {
        if (this.selectedClinic == null) {
          this.selectedClinicName = this.filteredClinics[0].clinicName;
          this.selectedClinic = this.filteredClinics[0];
        }
        this.hasClinicRunOnFocus = false;
        this.filteredClinics = [];
      } catch {}
    }, 200);
  }

  //Services
  filteredServices: any[] = [];
  filterServices(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    try {
      this.filteredServices = this.servicesList.filter(
        (att) =>
          att.name.toLowerCase().includes(filterValue) &&
          att.physicianId == this.selectedApprovedPhysicians.physicianId
      );
    } catch {}
  }

  selectService(item: any): void {
    this.selectedServiceName = item.name;
    this.selectedServiceDescription = item.description;
    this.selectedServicePrice = item.price;
    this.selectedService = item;
    this.filteredServices = [];
  }

  hasServiceRunOnFocus: boolean = false;
  onServiceFocus() {
    if (!this.hasServiceRunOnFocus) {
      this.selectedServiceName = '';
      this.selectedServiceDescription = '';
      this.selectedServicePrice = '';
      this.selectedService = null;
      this.hasServiceRunOnFocus = true;
      try {
        this.filteredServices = this.servicesList.filter(
          (att) =>
            att.name.toLowerCase().includes('') &&
            att.physicianId == this.selectedApprovedPhysicians.physicianId
        );
        console.log(this.filteredServices);
      } catch {}
    }
  }

  onServiceBlur() {
    console.log('Input focus is removed');
    setTimeout(() => {
      if (this.selectedService == null) {
        try {
          this.selectedServiceName = this.filteredServices[0].name;
          this.selectedService = this.filteredServices[0];
          this.selectedServiceDescription =
            this.filteredServices[0].description;
          this.selectedServicePrice = this.filteredServices[0].price;
        } catch {}
      }
      this.hasServiceRunOnFocus = false;
      this.filteredServices = [];
    }, 100);
  }

  //Physicians
  filteredPhysicians: any[] = [];
  filterPhysicians(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredPhysicians = this.approvedPhysiciansList.filter(
      (att) =>
        att.physicianName.toLowerCase().includes(filterValue) &&
        this.selectedClinic.id == att.clinicId
    );
  }

  selectPhysician(item: any): void {
    this.selectedPhysicianName = item.physicianName;
    this.selectedApprovedPhysicians = item;
    this.filteredPhysicians = [];
  }

  hasPhysicianRunOnFocus: boolean = false;
  onPhysicianFocus() {
    if (!this.hasPhysicianRunOnFocus) {
      if (this.role != 'Physician') {
        this.selectedService = null;
        this.selectedServiceDescription = '';
        this.selectedServicePrice = '';
        this.selectedServiceName = '';
      }
      this.selectedPhysicianName = '';
      this.selectedApprovedPhysicians = null;
      this.hasPhysicianRunOnFocus = true;
      this.filteredPhysicians = this.approvedPhysiciansList.filter(
        (att) =>
          att.physicianName.toLowerCase().includes('') &&
          this.selectedClinic.id == att.clinicId
      );
    }
  }

  onPhysicianBlur() {
    console.log('Input focus is removed');
    setTimeout(() => {
      if (this.selectedApprovedPhysicians === null) {
        this.selectedPhysicianName = this.filteredPhysicians[0].physicianName;
        this.selectedApprovedPhysicians = this.filteredPhysicians[0];

        console.log(this.selectedApprovedPhysicians);
      }
      this.hasPhysicianRunOnFocus = false;
      this.filteredPhysicians = [];
    }, 100);
  }

  //Patients
  filteredPatients: any[] = [];
  filterPatients(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredPatients = this.patientList.filter(
      (att) =>
        att.firstname.toLowerCase().includes(filterValue) ||
        att.lastname.toLowerCase().includes(filterValue)
    );
  }

  selectPatient(item: any): void {
    this.selectedPatientName = item.firstname + ' ' + item.lastname;
    this.selectedPatient = item;
    this.filteredPatients = [];
  }

  hasPatientRunOnFocus: boolean = false;
  onPatientFocus() {
    if (!this.hasPatientRunOnFocus) {
      this.selectedPatientName = '';
      this.selectedPatient = null;
      this.hasPatientRunOnFocus = true;
      this.filteredPatients = this.patientList;
    }
  }

  onPatientBlur() {
    console.log('Input focus is removed');
    setTimeout(() => {
      if (this.selectedPatient == null) {
        this.selectedPatientName =
          this.filteredPatients[0].firstname +
          ' ' +
          this.filteredPatients[0].lastname;
        this.selectedPatient = this.filteredPatients[0];
      }
      this.hasPatientRunOnFocus = false;
      this.filteredPatients = [];
    }, 100);
  }

  checkAppointment() {
    if (
      this.selectedClinic == null ||
      this.selectedPatient == null ||
      this.selectedApprovedPhysicians == null ||
      this.selectedService == null ||
      this.appointmentDate == ''
    ) {
      alert('Please fill out the form properly. Thank you');
    }
    else{
      if (window.confirm('Are you sure about the details of your appointment?')){
        var appointmentDetails = {
          id: '',
          patientName: this.selectedPatientName,
          patientId: this.selectedPatient.id,
          clinicName: this.selectedClinicName,
          clinicId: this.selectedClinic.id,
          physicianId: this.selectedApprovedPhysicians.physicianId,
          physicianName: this.selectedPhysicianName,
          serviceId: this.selectedService.id,
          serviceName: this.selectedServiceName,
          serviceDescription: this.selectedServiceDescription,
          servicePrice: this.selectedServicePrice,
          appointmentDetails: this.appointmentDescription,
          appointmentDate: this.appointmentDate,
          status: 'Waiting'
        }

        this.data.addAppointment(appointmentDetails);
        this.closeModals.nativeElement.click();
      }
    }

    this.dataReset();
  }

  dataReset(){
      this.selectedClinic = null;
      this.selectedPatient = null ;
      this.selectedApprovedPhysicians = null;
      this.selectedService = null;
      this.appointmentDate = '';
      this.appointmentDescription = '';
      this.selectedPatientName = '';
      this.selectedPhysicianName = '';
      this.selectedService = '';
      this.selectedClinicName = '';
  }
}
