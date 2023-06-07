import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private eventSource: EventSource;
  private notifications: string[] = [];

  constructor() {
    this.eventSource = new EventSource('http://localhost:4400/notifications');
    this.eventSource.addEventListener('message', this.handleNotification.bind(this));
  }

  private handleNotification(event: MessageEvent) {
    const notification = event.data;
    this.notifications.push(notification);
  }

  getNotifications(): string[] {
    return this.notifications;
  }
  
  closeConnection() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
