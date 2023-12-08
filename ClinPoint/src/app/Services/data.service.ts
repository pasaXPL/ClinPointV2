import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Account, Patient, Clinic, Physician } from '../Models/model.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private fs: AngularFirestore) { }

  //Patients
  addPatient(patient: Patient){
    if(patient.id === ''){
      patient.id = this.fs.createId();
    }
    return this.fs.collection('/PatientsV2').doc(patient.id).set(patient);
  }

  getAllPatients(){
    return this.fs.collection('/PatientsV2').snapshotChanges();
  }

  
  getAllAccounts(){
    return this.fs.collection('/AccountsV2').snapshotChanges();
  }

  async updatePatient(patient: Patient | any): Promise<void> {
    try {
      this.fs.collection('/PatientsV2').doc(patient.id).update(patient);
      console.log('Patient updated successfully');
    } catch (error) {
      console.error('Error updating clinic:', error);
    }
  }

  async getPatientById(id: string): Promise<Patient | null>{
    try {
      const patientDoc = await this.fs.collection('/PatientsV2').doc(id).get().toPromise();
      if (patientDoc!.exists) {
        const patientData = patientDoc!.data() as Patient;
        return { ...patientData, id: patientDoc!.id };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting patient by ID:', error);
      return null;
    }
  }

  //Accounts
  createPatientAccount(account: Account, patient: Patient){
    account.id = this.fs.createId();
    patient.id = account.id;
    account.status = 'Active';

    this.fs.collection('/AccountsV2').doc(account.id).set(account);
    this.fs.collection('/PatientsV2').doc(patient.id).set(patient);
    return null;
  }

  async loginAccount(username: string, password: string): Promise<Account | null>{
    const querySnapshot = await this.fs.collection('/AccountsV2', ref =>
      ref.where('username', '==', username).where('password', '==', password).where('status', '==', 'Active').limit(1)
    ).get().toPromise();

    //return null;
    if (querySnapshot!.size > 0) {
      const accountData = querySnapshot!.docs[0].data() as Account;
      return { ...accountData };
    } else {
      return null;
    }
  }

  //Physician
  getAllPhysicians(){
    return this.fs.collection('/PhysiciansV2').snapshotChanges();
  }

  addPhysician(physician: Physician){
    if(physician.id === ''){
      physician.id = this.fs.createId();
    }
    return this.fs.collection('/PhysiciansV2').doc(physician.id).set(physician);
  }

  createPhysicianAccount(account: Account, physician: Physician){
    account.id = this.fs.createId();
    physician.id = account.id;
    account.status = 'Active';
    this.fs.collection('/AccountsV2').doc(account.id).set(account);
    this.fs.collection('/PhysiciansV2').doc(physician.id).set(physician);
    let d = {
      id: physician.id,
      morningStarting: '8:00 AM',
      morningEnding: '11:30 AM',
      afternoonStarting: '12:00 PM',
      afternoonEnding: '9:00 PM'
    };
    this.fs.collection('/PhysicianSchedule').doc(physician.id).set(d);
    return null;
  }

  async getPhysicianById(id: string): Promise<Physician | null>{
    try {
      const physicianDoc = await this.fs.collection('/PhysiciansV2').doc(id).get().toPromise();
      if (physicianDoc!.exists) {
        const physicianData = physicianDoc!.data() as Physician;
        return { ...physicianData, id: physicianDoc!.id };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting patient by ID:', error);
      return null;
    }
  }

  async updatePhysician(physician: Physician | any) {
    try {
      this.fs.collection('/PhysiciansV2').doc(physician.id).update(physician);
      console.log('Physician updated successfully');
    } catch (error) {
      console.error('Error updating clinic:', error);
    }
  }

  //Clinics
  getAllClinics(){
    return this.fs.collection('/ClinicsV2').snapshotChanges();
  }

  addClinic(clinic: Clinic){
    if(clinic.id === ''){
      clinic.id = this.fs.createId();
    }
    return this.fs.collection('/ClinicsV2').add(clinic);
  }

  createClinicAccount(account: Account, clinic: Clinic){
    account.id = this.fs.createId();
    clinic.id = account.id;
    const currentDate: Date = new Date();
    const nextDate: Date = new Date();
    var messageData = {
      id: clinic.id,
      clinicName: clinic.clinicName,
      messages: [
        {
          role: 'Admin',
          message: 'Welcome to Clinpoint',
          datesent: currentDate.toISOString()
        }
      ]
    }

    account.status = 'Active';

    this.fs.collection('/AccountsV2').doc(account.id).set(account);
    this.fs.collection('/ClinicsV2').doc(clinic.id).set(clinic);
    this.fs.collection('/Messages').doc(messageData.id).set(messageData);

    this.addNotification('New Clinic has been created', clinic.clinicName + ' has registered check the clinic\s credentials', '', 'Admin');
    return null;
  }

  async getClinicById(id: string): Promise<Clinic | null>{
    try {
      const clinicDoc = await this.fs.collection('/ClinicsV2').doc(id).get().toPromise();
      if (clinicDoc!.exists) {
        const clinicData = clinicDoc!.data() as Clinic;
        return { ...clinicData, id: clinicDoc!.id };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting patient by ID:', error);
      return null;
    }
  }

  updateClinic(clinic: Clinic | any) {
    try {
      this.fs.collection('/ClinicsV2').doc(clinic.id).update(clinic);
      console.log('Clinic updated successfully');
    } catch (error) {
      console.error('Error updating clinic:', error);
    }
  }

  //Apply for a clinic
  addClinicPhysicianApplication(phyId: string, clinId: string, physicianName:string){
    var id = this.fs.createId();
    const physicianApplication = {
      id: id,
      clinicId : clinId,
      physicianId : phyId,
      status: "Pending",
      physicianName: physicianName
    }
    this.fs.collection('/ClinicPhysicianApplications').doc(id).set(physicianApplication);

    this.addNotification(physicianName + ' has sent a request', physicianName + ' would like to be a part of your clinic, view the physician\'s credentials', clinId, 'Clinic');
    return null
  }

  getAllClinicPhysicianApplication(){
    return this.fs.collection('/ClinicPhysicianApplications').snapshotChanges();
  }

  updateClinicPhysicianApplication(application: any) {
    try {
      this.fs.collection('/ClinicPhysicianApplications').doc(application.id).update(application);
      console.log('Clinic updated successfully');
    } catch (error) {
      console.error('Error updating clinic:', error);
    }
  }

  updateAccountPassword(application: any) {
    try {
      this.fs.collection('/AccountsV2').doc(application.id).update(application);
      console.log('Account updated successfully');
    } catch (error) {
      console.error('Error updating clinic:', error);
    }
  }

  //services
  addServices(services: any){
    services.id = this.fs.createId();
    return this.fs.collection('/Services').doc(services.id).set(services);
  }

  getAllServices(){
    return this.fs.collection('/Services').snapshotChanges();
  }

  async updateServices(services: any): Promise<void> {
    try {
      this.fs.collection('/Services').doc(services.id).update(services);
      console.log('Service updated successfully');
    } catch (error) {
      console.error('Error updating clinic:', error);
    }
  }

  deleteService(services: any){
    this.fs.doc('/Services/' + services.id).delete();
  }

  //Users
  getAllUsers(){
    return this.fs.collection('/AccountsV2').snapshotChanges();
  }

  //Payment
  addPayment(payment: any){
    payment.id = this.fs.createId();
    payment.refno = payment.id;

    this.addNotification('Received payment receipt from '+ payment.clinicName, payment.clinicName + ' has sent you a payment and screenshot of the receipt.', '', 'Admin');
    return this.fs.collection('/Payments').doc(payment.id).set(payment);
  }

  getAllPayments(){
    return this.fs.collection('/Payments').snapshotChanges();
  }

  async updatePayments(payment: any): Promise<void> {
    try {
      this.fs.collection('/Payments').doc(payment.id).update(payment);
      console.log('Payment updated successfully');
    } catch (error) {
      console.error('Error updating clinic:', error);
    }
  }

  getAllMessages(){
    return this.fs.collection('/Messages').snapshotChanges();
  }

  getAllMessageClinic(tokenId: string){
    return this.fs.collection('/Messages').doc(tokenId).snapshotChanges()
      .pipe(
        map(action => {
          const data = action.payload.data(); // No type checking for 'data'
          const id = action.payload.id;
          return { id, data };
        })
      );
  }

  async sendMessage(message: any): Promise<void> {
    try {
      this.fs.collection('/Messages').doc(message.id).update(message);
      console.log('message updated successfully');
    } catch (error) {
      console.error('Error updating clinic:', error);
    }
  }

  getAllNotification(){
    return this.fs.collection('/Notifications').snapshotChanges();
  }

  addNotification(title:string, body:string, receiver:string, role:string){
    const res = {
      title: title,
      body: body,
      receiver: receiver,
      role: role
    }

    return this.fs.collection('/Notifications').add(res);
  }


  getAllAppointments(){
    return this.fs.collection('/Appointments').snapshotChanges();
  }

  addAppointment(appointment: any){
    appointment.id = this.fs.createId();

    this.addNotification('You have received an appointment', appointment.patientName + ' has made an appointment with ' + appointment.physicianName, appointment.clinicId, 'Patient');
    this.addNotification('You have received an appointment', appointment.patientName + ' has made an appointment with ' + appointment.physicianName, appointment.physicianId, 'Patient');
    this.addNotification('You have created an appointment', 'You have made an appointment with ' + appointment.physicianName, appointment.patientId, 'Patient');
    return this.fs.collection('/Appointments').doc(appointment.id).set(appointment);
  }

  async updateAppointment(appointment: any): Promise<void> {
    try {
      if(appointment.status == 'Accepted'){
        this.addNotification('An appointment has been accepted', appointment.patientName + ' appointment with ' + appointment.physicianName + ' has been accepted', appointment.clinicId, 'Patient');
        this.addNotification('An appointment has been accepted', appointment.patientName + ' an appointment with ' + appointment.physicianName + ' has been accepted', appointment.physicianId, 'Patient');
        this.addNotification('An appointment has been accepted', 'Your appointment has been accepted by ' + appointment.physicianName, appointment.patientId, 'Patient');
      }
      else if(appointment.status == 'Declined'){
        this.addNotification('An appointment has been declined', appointment.patientName + ' appointment with ' + appointment.physicianName + ' has been declined', appointment.clinicId, 'Patient');
        this.addNotification('An appointment has been declined', appointment.patientName + ' an appointment with ' + appointment.physicianName + ' has been declined', appointment.physicianId, 'Patient');
        this.addNotification('An appointment has been declined', 'Your appointment has been declined by ' + appointment.physicianName, appointment.patientId, 'Patient');
      }
      else if(appointment.status == 'Cancelled'){
        this.addNotification('An appointment has been cancelled', appointment.patientName + ' appointment with ' + appointment.physicianName + ' has been cancelled', appointment.clinicId, 'Patient');
        this.addNotification('An appointment has been cancelled', appointment.patientName + ' an appointment with ' + appointment.physicianName + ' has been cancelled', appointment.physicianId, 'Patient');
        this.addNotification('An appointment has been cancelled', 'Your appointment has been cancelled by ' + appointment.physicianName, appointment.patientId, 'Patient');
      }
      this.fs.collection('/Appointments').doc(appointment.id).update(appointment);
      console.log('Appointment updated successfully');
    } catch (error) {
      console.error('Error updating Appointment:', error);
    }
  }

  getAllPhysicianTimeSchedule(){
    return this.fs.collection('/PhysicianSchedule').snapshotChanges();
  }

  addPhysicianTimeSchedule(schedule: any){
    return this.fs.collection('/PhysicianSchedule').doc(schedule.id).set(schedule);
  }

  updatePhysicianTimeSchedule(schedule: any){
    return this.fs.collection('/PhysicianSchedule').doc(schedule.id).update(schedule);
  }


  //secretary module
  addSecretary(secretary: any, account: any){
    secretary.addressId = this.fs.createId();
    account.addressId = secretary.addressId;
    this.fs.collection('/AccountsV2').doc(account.addressId).set(account);
    this.fs.collection('/PhysicianSecretary').doc(secretary.addressId).set(secretary);
  }

  updateSecretary(secretary: any){
    let acc = {
      status: secretary.status
    }
    this.fs.collection('/AccountsV2').doc(secretary.addressId).update(acc);
    return this.fs.collection('/PhysicianSecretary').doc(secretary.addressId).update(secretary);
  }

  getAllSecretary(){
    return this.fs.collection('/PhysicianSecretary').snapshotChanges();
  }


  updateAccount(acc:any){
    this.fs.collection('/AccountsV2').doc(acc.addressId).update(acc);
  }


}
