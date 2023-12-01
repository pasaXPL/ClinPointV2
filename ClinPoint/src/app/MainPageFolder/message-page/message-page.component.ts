import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Modal, Ripple, Input, initTE, Select, Datepicker} from "tw-elements";
import { Payment } from 'src/app/Models/model.model';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { baseURL } from 'src/app/Models/BaseURL';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrls: ['./message-page.component.scss']
})
export class MessagePageComponent {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  @ViewChild('convolist') convolist!: ElementRef;
  @ViewChild('mainconvo') mainconvo!: ElementRef;


  role = '';
  token = '';
  conversationList: any[] = [];
  selectedConvo: any;
  messageText = '';
  isLoaded = false;

  constructor(private data: DataService, private auth:AuthService, private http:HttpClient) { }
  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnInit() {
    initTE({ Modal });
    this.role = this.auth.getAuth()!;
    this.token = this.auth.getToken()!;

    if(this.role == 'Admin'){
    this.getAllMessagesAdmin();
    }
    else{
      this.getAllMessagesClinic();
    }
  }

  openConvo(convo: any){
    this.selectedConvo = convo;
    if(this.convolist.nativeElement.classList.contains('hidden')){
      this.convolist.nativeElement.classList.remove('hidden');
      this.mainconvo.nativeElement.classList.add('hidden');
    }
    else{
      this.convolist.nativeElement.classList.add('hidden');
      this.mainconvo.nativeElement.classList.remove('hidden');
    }
  }

  closeConvo(){
    if(this.convolist.nativeElement.classList.contains('hidden')){
      this.convolist.nativeElement.classList.remove('hidden');
      this.mainconvo.nativeElement.classList.add('hidden');
    }
    else{
      this.convolist.nativeElement.classList.add('hidden');
      this.mainconvo.nativeElement.classList.remove('hidden');
    }
  }

  scrollToBottom() {
    const container = this.scrollContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  getAllMessagesAdmin() {
    this.data.getAllMessages().subscribe(res => {
      this.conversationList = res.map((e: any) => {
        const data = e.payload.doc.data();
        return data;
      })

      try{

        if(this.isLoaded == false){
          this.selectedConvo = this.conversationList[0];
          this.isLoaded = true;
        }
      }
      catch{}
      this.scrollToBottom();
    }, err => {
      alert('Error while fetching services data');
    })
  }

  getAllMessagesClinic() {
    this.data.getAllMessageClinic(this.token).subscribe(res => {
      this.selectedConvo = res.data;
      this.scrollToBottom();
    }, err => {
      alert('Error while fetching services data');
    })
  }

  sendMessage(){
    if(this.role == 'Admin'){
      this.adminSendMessage();
    }
    else{
      this.clinicSendMessage();
    }
    this.scrollToBottom();
  }

  adminSendMessage(){
    var messageList = this.selectedConvo;
    var cdate: Date = new Date();
    var messages =
      {
        role: 'Admin',
        message: this.messageText,
        datesent: cdate.toISOString()
      };

    messageList.messages.push(messages);

    this.data.sendMessage(messageList)
    this.messageText = "";
  }

  clinicSendMessage(){
    var messageList = this.selectedConvo;
    var cdate: Date = new Date();
    var messages =
      {
        role: 'Clinic',
        message: this.messageText,
        datesent: cdate.toISOString()
      };

    messageList.messages.push(messages);

    this.data.sendMessage(messageList)
    this.messageText = "";
  }


}
