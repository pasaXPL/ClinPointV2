import { Component } from '@angular/core';

@Component({
  selector: 'app-scheduler-page',
  templateUrl: './scheduler-page.component.html',
  styleUrls: ['./scheduler-page.component.scss']
})
export class SchedulerPageComponent {
  currentDate: Date = new Date();
  startDayOfWeek: number = 0;
  daysInMonth: string[] = [];

  ngOnInit(){
    var today = new Date();
    this.currentDate = today;
    this.functionSetDaysInMonth();
  }

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

  changeMonth(monthChange: number): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + monthChange);
    this.functionSetDaysInMonth();
    console.log(this.currentDate.toDateString());
  }

  formatDate(inputDate: Date, format: string): string {
    if (!inputDate) return '';

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

}
