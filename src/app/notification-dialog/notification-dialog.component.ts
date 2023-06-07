import { Component, Inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent {
  notifications: string[];
  constructor(private notificationService:NotificationService,
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
    this.notifications = this.notificationService.getNotifications();
  }
  
  ngOnDestroy() {
    this.notificationService.closeConnection();
  }
  onClose() {
    this.dialogRef.close();
    this.notifications=[]
    this.ngOnDestroy()
  }
}
