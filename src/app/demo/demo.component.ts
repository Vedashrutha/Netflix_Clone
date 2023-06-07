import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-demo',
  template: `
    <ul>
      <li *ngFor="let notification of notifications">{{ notification }}</li>
    </ul>
  `
})
export class DemoComponent  {
  notifications: string[];

  constructor(private notificationService: NotificationService) {
    this.notifications = this.notificationService.getNotifications();
    
  }
  ngOnDestroy() {
    this.notificationService.closeConnection();
  }

  showSidebar: boolean = false;

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
}