import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  showButton = true;
  deferredPrompt: any;

  showAiChat = false;
  constructor(private swUpdate: SwUpdate) { }

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      this.deferredPrompt = e;
    });
  }

  ngAfterViewInit(){
    window.addEventListener('beforeinstallprompt', (e: any) => {
      this.deferredPrompt = e;
    });
  }

  installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          // The user accepted the installation
          this.deferredPrompt = null;
        }
      });
    }
    else{
      alert('App is already installed')
    }
  }

  showChatBox(){
    if(this.showAiChat == true)
      this.showAiChat = false;
    else
      this.showAiChat = true;
  }
}
