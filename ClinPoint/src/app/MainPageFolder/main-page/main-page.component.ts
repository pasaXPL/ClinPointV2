
import { Component, ViewChild, Renderer2, ElementRef  } from '@angular/core';
import { Sidenav, initTE, Modal } from "tw-elements";
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { baseURL, gptAPI } from 'src/app/Models/BaseURL';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  @ViewChild('sidebarButton') sidebarButton!:ElementRef;

  showButton = true;
  deferredPrompt: any;

  showAiChat = false;

  chatObject = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content:
          'Welcome to ClinPoint! Our mission is to revolutionize the way patients schedule appointments with medical clinics. We believe that healthcare should be accessible and convenient, and were committed to making that a reality through our innovative platform. At ClinPoint, we understand the frustration that comes with traditional appointment scheduling. Long wait times, confusing paperwork, and missed appointments are all too common. Thats why weve created a user-friendly, paperless system that streamlines the process for both patients and medical clinics Our platform consists of two components: a web-based application for clinics and a mobile application for patients. The clinic dashboard allows medical personnel to view appointment schedules and patient history, while the mobile app allows patients to schedule appointments, update their information, view upcoming appointments, and receive notifications.Youre an AI made by ClinPoint Devs to assist people in medical concers. On the foloowing messages only answer medical Concerns and about ClinPoint if it is not a medical concern or about clinpoint kindly say that you can only answer medical questions and about clinpoint. Lastly always make your messages short',
      },
      {
        role: 'assistant',
        content:
          'Hi I am ClinPoint Experimental AI. I will be answering your medical concerns for free and questions about ClinPoint',
      }
    ],
  };

  userMessage = '';

  messages = [
    {
      role: 'assistant',
      content:
        'Hi I am ClinPoint Experimental AI. I will be answering your medical concerns for free and questions about ClinPoint',
    },
  ];


  constructor(private authService: AuthService, private router: Router, private data: DataService, private http: HttpClient) {}

  role = "";
  name = "";
  token = "";


  isWeb = false;
  isActive = false;
  notificationList:any[] = []

  ngAfterViewInit(){
    this.toggleSideBar();
  }

  async ngOnInit() {
    initTE({ Sidenav, Modal });
    this.role = this.authService.getAuth()!;
    this.token = this.authService.getToken()!;

    var user: any;
    try{
    if(this.role == "Patient"){
      user = await this.data.getPatientById(this.token);
      console.log('test' + user)
      this.name = user.firstname + " " + user.lastname;

    }
    else if(this.role == "Admin"){
      this.name = "ClinPoint";
    }
    else if (this.role == "Physician"){
      user  = await this.data.getPhysicianById(this.token);
      this.name = user.firstname + ' ' + user.lastname;
      if(user.status == 'Approved'){
        this.isActive = true;
      }
    }
    else if(this.role == "Clinic"){
      user = await this.data.getClinicById(this.token);
      this.name = user.clinicName;
      if(user.status == 'Approved'){
        this.isActive = true;
      }
    }
    }catch{}

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      this.router.navigate(['/mobiledashboard']);
    }
    else{
      console.log('You are using web!');
    }

    this.getAllNotifications();
  }

  getAllNotifications() {
    this.data.getAllNotification().subscribe(res => {
      this.notificationList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      })

      if(this.role == 'Admin'){
        this.notificationList = this.notificationList.filter(att => att.role == 'Admin');
      }
      else{
        this.notificationList = this.notificationList.filter(att => att.receiver == this.token);
      }
    }, err => {
      alert('Error while fetching services data');
    })

  }

  logoutUser(){
    if (window.confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  toggleSideBar() {
    this.sidebarButton.nativeElement.click();
  }

  showChatBox() {
    if (this.showAiChat == true) this.showAiChat = false;
    else this.showAiChat = true;
  }

  aiChat() {
    if (this.userMessage == '' || this.userMessage == null) {
    }
    else {
      var mess = {
        role: 'user',
        content: this.userMessage,
      };

      var messAI = {
        role: 'assistant',
        content: ' o o o ',
      };

      this.messages.push(mess);
      this.messages.push(messAI);
      this.chatObject.messages.push(mess);
      this.userMessage = "";
      try {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization:
              'Bearer ' + gptAPI,
          }),
        };

        this.http
          .post('https://api.openai.com/v1/chat/completions', this.chatObject, {
            headers: httpOptions.headers,
            responseType: 'text',
          })
          .pipe(catchError(this.handleError))
          .subscribe(
            (response) => {
              this.messages.pop();
              var resObj = JSON.parse(response);
              this.messages.push(resObj.choices[0].message);
              this.chatObject.messages.push(resObj.choices[0].message);
            },
            (error) => {
              this.messages.pop();
              var errorMessage = {
                role: 'assistant',
                content:
                  "Ooops sorry, I can't help you right now. Please try again Later",
              };
              this.messages.push(errorMessage);
            }
          );
      } catch {}
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }

    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
