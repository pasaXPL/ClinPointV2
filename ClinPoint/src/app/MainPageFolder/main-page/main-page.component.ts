
import { Component, ViewChild, Renderer2, ElementRef  } from '@angular/core';
import { Sidenav, initTE, } from "tw-elements";
import { AuthService } from 'src/app/Services/auth.service';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  @ViewChild('sidebarButton') sidebarButton!:ElementRef;

  constructor(private authService: AuthService) {}

  ngAfterViewInit(){
    this.toggleSideBar();
  }

  ngOnInit() {
    initTE({ Sidenav });
  }

  logoutUser(){
    if (window.confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  toggleSideBar() {
    this.sidebarButton.nativeElement.click();
  }
}
