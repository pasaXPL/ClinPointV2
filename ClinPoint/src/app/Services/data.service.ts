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

    this.fs.collection('/AccountsV2').doc(account.id).set(account);
    this.fs.collection('/PatientsV2').doc(patient.id).set(patient);
    return null;
  }

  async loginAccount(username: string, password: string): Promise<Account | null>{
    const querySnapshot = await this.fs.collection('/AccountsV2', ref =>
      ref.where('username', '==', username).where('password', '==', password).limit(1)
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

    this.fs.collection('/AccountsV2').doc(account.id).set(account);
    this.fs.collection('/PhysiciansV2').doc(physician.id).set(physician);
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

    this.fs.collection('/AccountsV2').doc(account.id).set(account);
    this.fs.collection('/ClinicsV2').doc(clinic.id).set(clinic);
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
  addClinicPhysicianApplication(phyId: string, clinId: string){
    var id = this.fs.createId();
    const physicianApplication = {
      id: id,
      clinicId : clinId,
      physicianId : phyId,
      status: "Pending"
    }
    this.fs.collection('/ClinicPhysicianApplications').doc(id).set(physicianApplication);
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

  getAllServices(physicianId: any){
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

  //Appointments
  getAllAppointment(){
    return this.fs.collection('/Appointments').snapshotChanges();
  }

  //Users
  getAllUsers(){
    return this.fs.collection('/AccountsV2').snapshotChanges();
  }

}
