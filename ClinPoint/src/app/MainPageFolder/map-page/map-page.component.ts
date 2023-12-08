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
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})
export class MapPageComponent {

  accountList:any[] = [];
  originalAccountList: any[] = [];
  selectedAccount:any;

  constructor(private data:DataService, private auth:AuthService, private http: HttpClient){}

  
  ngOnInit(){
    this.getAllAccount();
  }

  getAllAccount(){
    this.data.getAllAccounts().subscribe(res => {
      this.accountList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      })

      this.accountList = this.accountList.filter(att => att.role != 'Admin');
      this.originalAccountList = this.accountList
    });
  }

  selectAccount(acc:any){
    this.selectedAccount = acc;
  }

  updateAccount(s:any){
    if (window.confirm('Are you sure you want to update the status of the user?')){
      if(s.status == 'Active'){
        s.status = 'Inactive'
      }
      else{
        s.status = 'Active'
      }
      this.data.updateAccount(s);
    }
  }
}
