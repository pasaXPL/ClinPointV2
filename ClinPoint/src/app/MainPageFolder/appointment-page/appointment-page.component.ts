import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Modal, Ripple, Input, initTE, Select, Datepicker } from 'tw-elements';
import { Services } from 'src/app/Models/model.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-appointment-page',
  templateUrl: './appointment-page.component.html',
  styleUrls: ['./appointment-page.component.scss'],
})
export class AppointmentPageComponent {
  @ViewChild('openViewAppointment') viewServiceModal!: ElementRef;
  @ViewChild('closeModals') closeModals!: ElementRef;
  @ViewChild('viewAppointmentStatus') viewAppointmentStatus!: ElementRef;

  servicesList: any[] = [];
  approvedPhysiciansList: any[] = [];
  clinicList: any[] = [];
  patientList: any[] = [];
  toBeDownloaded: any[] = [];

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
  appointmentTime: string = '';

  searchString = '';

  name = '';
  description = '';
  price = '';

  role = '';
  token = '';
  realcurrentdate: any;
  isButtonDisabled = true;
  selectedAppointmentStatus = '';

  // timeslots = [
  //   '8:00 AM to 8:30 AM',
  //   '8:30 AM to 9:00 AM',
  //   '9:00 AM to 9:30 AM',
  //   '9:30 AM to 10:00 AM',
  //   '10:00 AM to 10:30 AM',
  //   '10:30 AM to 11:00 AM',
  //   '11:00 AM to 11:30 AM',
  //   '11:30 AM to 12:00 PM',
  //   '12:00 PM to 12:30 PM',
  //   '12:30 PM to 1:00 PM',
  //   '1:00 PM to 1:30 PM',
  //   '1:30 PM to 2:00 PM',
  //   '2:00 PM to 2:30 PM',
  //   '2:30 PM to 3:00 PM',
  //   '3:00 PM to 3:30 PM',
  //   '3:30 PM to 4:00 PM',
  //   '4:00 PM to 4:30 PM',
  //   '4:30 PM to 5:00 PM',
  //   '5:00 PM to 5:30 PM',
  //   '5:30 PM to 6:00 PM',
  //   '6:00 PM to 6:30 PM',
  //   '6:30 PM to 7:00 PM',
  //   '7:00 PM to 7:30 PM',
  //   '7:30 PM to 8:00 PM',
  //   '8:00 PM to 8:30 PM',
  //   '8:30 PM to 9:00 PM',
  // ];

  timeslots = [
    '8:00 AM to 9:00 AM',
    '9:00 AM to 10:00 AM',
    '10:00 AM to 11:00 AM',
    '11:00 AM to 12:00 PM',
    '12:00 PM to 1:00 PM',
    '1:00 PM to 2:00 PM',
    '2:00 PM to 3:00 PM',
    '3:00 PM to 4:00 PM',
    '4:00 PM to 5:00 PM',
    '5:00 PM to 6:00 PM',
    '6:00 PM to 7:00 PM',
    '7:00 PM to 8:00 PM',
    '8:00 PM to 9:00 PM',
  ];

  timescheds: string[] = [];

  physicianTimeScheds: any[] = [];
  currentDate:any;

  constructor(private data: DataService, private auth: AuthService) { }

  ngOnInit() {
    initTE({ Modal });
    var today = new Date();
    var newtoday = new Date();
    this.realcurrentdate = newtoday;
    this.currentDate = today;
    this.currentDate.setDate(1);
    this.functionSetDaysInMonth();

    this.token = this.auth.getToken()!;
    this.role = this.auth.getAuth()!;

    if(this.role == 'Patient'){
      this.getAllClinics();
      this.getAllPatient();
      this.getAllPhysicianSchedule();
      this.getAllClinicsPhysicians();
      this.getAllServices();
    }
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

        if (this.role == 'Physician' || this.role == 'Secretary') {
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

  getAllPhysicianSchedule() {
    this.data.getAllPhysicianTimeSchedule().subscribe(
      (res) => {
        this.physicianTimeScheds = res.map((e: any) => {
          const data = e.payload.doc.data();
          return data;
        });
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
        } else if (this.role == 'Physician' || this.role == 'Secretary') {
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

        this.toBeDownloaded = this.appointmentList;
        if (this.role == 'Patient') {
          this.appointmentList = this.appointmentList.filter(att => att.patientId == this.token);
        }
        else if (this.role == 'Clinic') {
          this.appointmentList = this.appointmentList.filter(att => att.clinicId == this.token);
        }
        else if (this.role == 'Physician' || this.role == 'Secretary') {
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

  openAppointmentModal(appointment: any) {
    var d = new Date(appointment.appointmentDate);
    if (d < this.realcurrentdate && appointment.status == 'Waiting') {
      appointment.status = 'Failed Appointment';
    }
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
          obj.serviceName.toUpperCase().includes(text.toUpperCase()) ||
          obj.physicianName.toUpperCase().includes(text.toUpperCase()) ||
          obj.status.toUpperCase().includes(text.toUpperCase()) ||
          this.changeDateFormat(obj.appointmentDate, 'MM/dd/yyyy').toUpperCase().includes(text.toUpperCase()) ||
          obj.patientName.toUpperCase().includes(text.toUpperCase())
      );
    });

    this.appointmentList = list;
  }

  addService() {
    if (this.name == '' || this.description == '' || this.price == '') {
      alert('Fill all input fields in the form');
      return;
    }
    const cd: Date = new Date();
    const dateString: string = cd.toLocaleDateString('en-US', {
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
  //currentDate: Date = new Date();
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

  // changeMonth(monthChange: number): void {
  //   var m = this.currentDate.getMonth() + monthChange;
  //   this.currentDate.setMonth(m);
  //   this.functionSetDaysInMonth();
  // }

   prevMonth() {
    console.log('Before: ', this.currentDate.toISOString());

    console.log(this.currentDate.getMonth());
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);

    // Adjust the year if the month goes below 0
    // console.log(this.currentDate.getMonth());
    // if (this.currentDate.getMonth() < 0) {
    //     this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
    //     this.currentDate.setMonth(11); // Set the month to December (11)
    // }

    //this.currentDate.setDate(1); // Set the day to the first day of the month
    this.functionSetDaysInMonth();

    console.log('After: ', this.currentDate.toISOString());
}

 nextMonth() {
    console.log('Before: ', this.currentDate.toISOString());

    this.currentDate.setMonth(this.currentDate.getMonth() + 1);

    // // Adjust the year if the month goes above 11
    // if (this.currentDate.getMonth() > 11) {
    //     this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
    //     this.currentDate.setMonth(0); // Set the month to January (0)
    // }

    //this.currentDate.setDate(1); // Set the day to the first day of the month
    this.functionSetDaysInMonth();

    console.log('After: ', this.currentDate.toISOString());
}



  formatDate(sd: Date, format: string): string {
    if (!sd) return '';

    let inputDate = sd;

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
    try {
      const filterValue = event.target.value.toLowerCase();
      //if role == 'Clinic' none will happen
      if (this.role == 'Physician' || this.role == 'Secretary') {
        try {
          this.filteredClinics = this.clinicList.filter(
            (att) =>
              att.clinicName.toLowerCase().includes(filterValue) &&
              this.approvedPhysiciansList.some(
                (physician) => physician.clinicId === att.id
              )
          );
        } catch { }
      } else {
        this.filteredClinics = this.clinicList;
      }

      if (this.role != 'Physician' && this.role != 'Secretary') {
        this.selectedApprovedPhysicians = null;
        this.selectedPhysicianName = '';

        this.selectedService = null;
        this.selectedServiceDescription = '';
        this.selectedServicePrice = '';
        this.selectedServiceName = '';
      }
    } catch { }
  }

  selectClinic(item: any): void {
    try {
      this.selectedClinicName = item.clinicName;
      this.selectedClinic = item;
      this.filteredClinics = [];

      console.log(item)
    } catch { }
  }

  hasClinicRunOnFocus: boolean = false;
  onClinicFocus() {
    try {
      if (!this.hasClinicRunOnFocus) {
        this.selectedClinicName = '';
        this.selectedClinic = null;
        this.hasClinicRunOnFocus = true;
        if (this.role == 'Physician' || this.role == 'Secretary') {
          try {
            this.filteredClinics = this.clinicList.filter(
              (att) =>
                att.clinicName.toLowerCase().includes('') &&
                this.approvedPhysiciansList.some(
                  (physician) => physician.clinicId === att.id
                )
            );
          } catch { }
        } else {
          this.filteredClinics = this.clinicList;
          //console.l
        }
      }
    } catch { }
  }

  onClinicBlur() {
    try {
      setTimeout(() => {
        try {
          if (this.selectedClinic == null) {
            this.selectedClinicName = this.filteredClinics[0].clinicName;
            this.selectedClinic = this.filteredClinics[0];
          }
          this.hasClinicRunOnFocus = false;
          this.filteredClinics = [];
        } catch { }
      }, 400);
    } catch { }
  }

  //Services
  filteredServices: any[] = [];
  filterServices(event: any): void {
    try {
      const filterValue = event.target.value.toLowerCase();
      try {
        this.filteredServices = this.servicesList.filter(
          (att) =>
            att.name.toLowerCase().includes(filterValue) &&
            att.physicianId == this.selectedApprovedPhysicians.physicianId
        );
      } catch { }
    } catch { }
  }

  selectService(item: any): void {
    try {
      this.selectedServiceName = item.name;
      this.selectedServiceDescription = item.description;
      this.selectedServicePrice = item.price;
      this.selectedService = item;
      this.filteredServices = [];

      this.setPhysicianScheds();
    } catch { }
  }

  hasServiceRunOnFocus: boolean = false;
  onServiceFocus() {
    try {
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
        } catch { }
      }
    } catch { }
  }

  onServiceBlur() {
    try {
      setTimeout(() => {
        if (this.selectedService == null) {
          try {
            this.selectedServiceName = this.filteredServices[0].name;
            this.selectedService = this.filteredServices[0];
            this.selectedServiceDescription =
              this.filteredServices[0].description;
            this.selectedServicePrice = this.filteredServices[0].price;
          } catch { }
        }
        this.hasServiceRunOnFocus = false;
        this.filteredServices = [];
      }, 400);

      this.setPhysicianScheds();
    } catch { }
  }

  //Physicians
  filteredPhysicians: any[] = [];
  filterPhysicians(event: any): void {
    try {
      const filterValue = event.target.value.toLowerCase();
      this.filteredPhysicians = this.approvedPhysiciansList.filter(
        (att) =>
          att.physicianName.toLowerCase().includes(filterValue) &&
          this.selectedClinic.id == att.clinicId
      );
    } catch { }
  }

  selectPhysician(item: any): void {
    try {
      this.selectedPhysicianName = item.physicianName;
      this.selectedApprovedPhysicians = item;
      this.filteredPhysicians = [];
    } catch { }
  }

  hasPhysicianRunOnFocus: boolean = false;
  onPhysicianFocus() {
    try {
      if (!this.hasPhysicianRunOnFocus) {
        if (this.role != 'Physician' && this.role != 'Secretary') {
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
    } catch { }
  }

  onPhysicianBlur() {
    try {
      setTimeout(() => {
        if (this.selectedApprovedPhysicians === null) {
          this.selectedPhysicianName = this.filteredPhysicians[0].physicianName;
          this.selectedApprovedPhysicians = this.filteredPhysicians[0];

          console.log(this.selectedApprovedPhysicians);
        }
        this.hasPhysicianRunOnFocus = false;
        this.filteredPhysicians = [];
      }, 400);
    } catch { }
  }


  setPhysicianScheds() {
    this.timescheds = [];
    let sched = this.physicianTimeScheds.find(att => att.id == this.selectedApprovedPhysicians.physicianId || att.id == this.token);
    const startIndex = this.timeslots.indexOf(sched.morningStarting + ' to ' + this.geteTime(sched.morningStarting));
    const endIndex = this.timeslots.indexOf(this.getsTime(sched.morningEnding) + ' to ' + sched.morningEnding);

    console.log(sched)
    console.log(sched.morningStarting + ' to ' + this.geteTime(sched.morningStarting));
    console.log(this.getsTime(sched.morningEnding) + ' to ' + sched.morningEnding)
    console.log(startIndex + ' ' + endIndex);
    if (startIndex !== -1 && endIndex !== -1) {
      const subset = this.timeslots.slice(startIndex, endIndex + 1);
      console.log(subset)
      this.timescheds = this.timescheds.concat(subset);
    } else {
      console.log("Elements 'b' and 'd' not found in the array.");
    }

    const startIndex1 = this.timeslots.indexOf(sched.afternoonStarting + ' to ' + this.geteTime(sched.afternoonStarting));
    const endIndex1 = this.timeslots.indexOf(this.getsTime(sched.afternoonEnding) + ' to ' + sched.afternoonEnding);

    if (startIndex1 !== -1 && endIndex1 !== -1) {
      const subset = this.timeslots.slice(startIndex1, endIndex1 + 1);
      this.timescheds = this.timescheds.concat(subset);


    } else {
      console.log("Elements 'b' and 'd' not found in the array.");
    }
  }

  geteTime(time: string): string {
    const [timePart, ampmPart] = time.split(' ');

    if (timePart && ampmPart) {
      let [hours, minutes] = timePart.split(':').map(Number);

      if (ampmPart.toLowerCase() === 'pm' && hours < 12) {
        hours += 12;
      }

      const inputTime: Date = new Date(2000, 0, 1, hours, minutes);
      inputTime.setMinutes(inputTime.getMinutes() + 60);

      const resultTimeString: string = inputTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      return resultTimeString;
    }

    return 'Invalid Time Format';
  }

  getsTime(time: string): string {
    const [timePart, ampmPart] = time.split(' ');

    if (timePart && ampmPart) {
      let [hours, minutes] = timePart.split(':').map(Number);

      if (ampmPart.toLowerCase() === 'pm' && hours < 12) {
        hours += 12;
      }

      const inputTime: Date = new Date(2000, 0, 1, hours, minutes);
      inputTime.setMinutes(inputTime.getMinutes() - 60);

      const resultTimeString: string = inputTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      return resultTimeString;
    }

    return 'Invalid Time Format';
  }

  //Patients
  filteredPatients: any[] = [];
  filterPatients(event: any): void {
    try {
      const filterValue = event.target.value.toLowerCase();
      this.filteredPatients = this.patientList.filter(
        (att) =>
          att.firstname.toLowerCase().includes(filterValue) ||
          att.lastname.toLowerCase().includes(filterValue)
      );
    } catch { }
  }

  selectPatient(item: any): void {
    try {
      this.selectedPatientName = item.firstname + ' ' + item.lastname;
      this.selectedPatient = item;
      this.filteredPatients = [];
    } catch { }
  }

  hasPatientRunOnFocus: boolean = false;
  onPatientFocus() {
    try {
      if (!this.hasPatientRunOnFocus) {
        this.selectedPatientName = '';
        this.selectedPatient = null;
        this.hasPatientRunOnFocus = true;
        this.filteredPatients = this.patientList;
      }
    } catch { }
  }

  onPatientBlur() {
    try {
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
      }, 400);
    } catch { }
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
    else {
      var doubleAppointment = this.toBeDownloaded.find(att =>
        att.clinicId == this.selectedClinic.id &&
        att.physicianId == this.selectedApprovedPhysicians.physicianId &&
        att.patientId == this.selectedPatient.id &&
        att.appointmentDate == this.appointmentDate
      );

      var appointmentToPhysicianCount = this.toBeDownloaded.filter(att =>
        att.physicianId == this.selectedApprovedPhysicians.physicianId &&
        att.appointmentDate == this.appointmentDate &&
        att.status == 'Accepted'
      ).length;

      var hasAnAppointment = this.toBeDownloaded.filter(att =>
        att.patientId == this.selectedPatient.id &&
        att.appointmentDate == this.appointmentDate &&
        att.appointmentTime == this.appointmentTime
      );

      var d = new Date(this.appointmentDate)
      if (d < this.realcurrentdate) {
        console.log(d.toLocaleString())
        console.log(this.realcurrentdate.toLocaleString())
        alert('Oops, Please create an appointment for future dates not past dates')
        return
      }

      if (doubleAppointment) {
        alert('Oops, You already have an exact appointment')
        return
      }

      // if(appointmentToPhysicianCount > 5){
      //   alert('The Physician is already fully booked on that day')
      //   return
      // }
      console.log(hasAnAppointment)
      if (hasAnAppointment.length > 0) {
        alert('You already have an appointment that specific date and time')
        return
      }

      if (window.confirm('Are you sure about the details of your appointment?')) {
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
          appointmentTime: this.appointmentTime,
          status: 'Waiting'
        }

        this.data.addAppointment(appointmentDetails);
        this.closeModals.nativeElement.click();
      }
    }

  }

  dataReset() {
    this.selectedClinic = null;
    this.selectedPatient = null;
    this.selectedApprovedPhysicians = null;
    this.selectedService = null;
    this.appointmentDate = '';
    this.appointmentDescription = '';
    this.selectedPatientName = '';
    this.selectedPhysicianName = '';
    this.selectedService = '';
    this.selectedClinicName = '';
  }

  downloadAppointmentReport() {
    var report: any[] = [];

    var res: any[] = this.appointmentList;
    if (this.role == 'Admin') {
      res = this.toBeDownloaded;
    }
    res.forEach(att => {
      var d = {
        'Appointment Ref': att.id,
        'Appointment Date': att.appointmentDate,
        'Appointment Time': att.appointmentTime,
        'Appointment Detail': att.appointmentDetails,
        'Clinic Name': att.clinicName,
        'Patient Name': att.patientName,
        'Physician Name': att.physicianName,
        'Service Name': att.serviceName,
        'Service Description': att.serviceDescription,
        'Service Total Price': att.servicePrice,
        'Status': att.status
      }
      report.push(d);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(report);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'exported_data.xlsx');
  }
  changeDateFormat(inputDate: string, format: string): string {
    var idate = new Date(inputDate);
    return this.formatDateV2(idate, format);
  }
  formatDateV2(sd: Date, format: string): string {
    if (!sd) return '';

    let inputDate = sd;

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

  getAppointmentCount(day: string): string {
    const cdate = this.currentDate;
    var res = "";
    var y: number = +day;
    if (y > 0) {
      cdate.setDate(y)
      var apps = this.originalAppointmentList.filter(att => att.appointmentDate == this.formatDateV2(cdate, 'yyyy-MM-dd')).length;
      if (apps > 0) {
        res = apps.toString();
      }
    }
    return res;
  }

  appointmentDayClick(day: string) {
    const cdate = this.currentDate;
    var res = "";
    var y: number = +day;
    if (y > 0) {
      cdate.setDate(y);
    }

    var list = this.originalAppointmentList;
    list = list.filter(att => this.changeDateFormat(att.appointmentDate, 'MM/dd/yyyy').toUpperCase().includes(this.formatDateV2(cdate, 'MM/dd/yyyy').toUpperCase()));
    this.appointmentList = list;
  }

  getAppointmentStatus(date: string, status: string): string {
    var d = new Date(date);
    if (d < this.realcurrentdate && (status == 'Waiting')) {
      return 'Failed Appointment';
    }
    else {
      return status;
    }
  }


  txtbxApproveDecline() {

    if (this.role == 'Patient' || this.role == 'Clinic') {
      if (this.selectedAppointmentStatus == 'Cancel') {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    }
    else if ((this.role == 'Physician' || this.role == 'Secretary') && this.selectedAppointment.status == 'Waiting') {
      if (this.selectedAppointmentStatus == 'Decline' || this.selectedAppointmentStatus == 'Accept') {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    }
    else if ((this.role == 'Physician' || this.role == 'Secretary') && this.selectedAppointment.status == 'Accepted') {
      if (this.selectedAppointmentStatus == 'Done') {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    }
  }

  updateAppointment() {
    if (this.selectedAppointmentStatus == 'Accept' || this.selectedAppointmentStatus == 'Decline' || this.selectedAppointmentStatus == 'Cancel') {
      if (window.confirm('Are you sure you want to update this appointment?')) {
        if (this.selectedAppointmentStatus == 'Accept') {
          this.selectedAppointment.status = 'Accepted';
        }
        else if (this.selectedAppointmentStatus == 'Decline') {
          this.selectedAppointment.status = 'Declined';
        }
        else if (this.selectedAppointmentStatus == 'Cancel') {
          this.selectedAppointment.status = 'Cancelled'
        }
        else if(this.selectedAppointmentStatus == 'Done'){
          this.selectedAppointment.status = 'Done'
        }
        this.data.updateAppointment(this.selectedAppointment);
      }
    }
    else {
      alert('Type Approve or Decline or Cancel to make sure of your adjustments')
    }

    this.closeModal();
  }

  viewUpdateAppointment() {
    this.closeModals.nativeElement.click();
    this.viewAppointmentStatus.nativeElement.click();
  }


  checkTime(): boolean {
    const dateString = this.selectedAppointment.appointmentDate;
    const timeString = this.selectedAppointment.appointmentTime;


    const dateObject: Date = new Date(`${dateString} ${timeString.split(' ')[0]}`);
    const cd: Date = new Date();

    if (isNaN(dateObject.getTime())) {
      console.error('Invalid date format');
      return false;
    } else {
      const timeDifference: number = dateObject.getTime() - cd.getTime();

      const totalHoursDifference: number = timeDifference / (1000 * 60 * 60);
      if (totalHoursDifference > 2) {
        return true;
      }
      else {
        return false;
      }
    }
  }
}
