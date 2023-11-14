import { Component } from '@angular/core';
import { DataService } from './Services/data.service';
import { Patient, Account, Clinic, Physician } from './Models/model.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ClinPoint';

}
