import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Modal, Ripple, Input, initTE, Select, Datepicker} from "tw-elements";
import { Services } from 'src/app/Models/model.model';

@Component({
  selector: 'app-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss']
})
export class ServicesPageComponent {
  @ViewChild('openViewService') viewServiceModal!: ElementRef;
  @ViewChild('closeModals') closeModals!: ElementRef;

  servicesList:Services[] = [];
  orginalServicesList: Services[] = [];
  selectedService:Services = {
    id: "",
    physicianId: "",
    name: "",
    description: "",
    price: ""
  };

  searchString = "";

  name = "";
  description = "";
  price = "";

  constructor(private data: DataService, private auth:AuthService) { }

  ngOnInit() {
    initTE({ Modal });
    this.getAllServices();
  }

  getAllServices() {
    this.data.getAllServices().subscribe(res => {
      this.servicesList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.addressId = e.payload.doc.id;
        return data;
      })

      this.servicesList = this.servicesList.filter(att => att.physicianId == this.auth.getToken())
      this.orginalServicesList = this.servicesList;
    }, err => {
      alert('Error while fetching services data');
    })

  }

  openViewServiceModal(service:any) {
    this.selectedService = service;
    this.viewServiceModal.nativeElement.click();
  }

  searchServices(){
    var list = this.orginalServicesList;
    var searchTexts = this.searchString.split(' ');
    searchTexts.forEach((text) => {
      list = list.filter((obj:any) =>
      obj.description.toUpperCase().includes(text.toUpperCase()) ||
      obj.name.toUpperCase().includes(text.toUpperCase()));
    })

    this.servicesList = list;
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
      id: "",
      name: this.name,
      description: this.description,
      price: this.price,
      physicianId: this.auth.getToken()
    }

    if (window.confirm('Are you sure you want to add ' + this.name + ' service?')) {
      this.data.addServices(data);
    }
    this.closeModal();

    this.name = "";
    this.description = "";
    this.price = "";
  }

  closeModal(){
    this.closeModals.nativeElement.click();
  }

  async updateService(){
    if (window.confirm('Are you sure you want to update ' + this.selectedService.name + ' ?')) {
      await this.data.updateServices(this.selectedService);
    }

    this.closeModal();
  }

  deleteService(){
    if (window.confirm('Are you sure you want to delete ' + this.selectedService.name + ' ?')) {
      this.data.deleteService(this.selectedService);
    }
    this.closeModal();
  }
}
