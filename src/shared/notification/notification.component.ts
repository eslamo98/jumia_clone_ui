import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

// src/app/shared/components/notification/notification.component.ts
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" [ngClass]="['notification', type]">
      {{ message }}
      <button class="close-btn" (click)="close()">&times;</button>
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px;
      border-radius: 4px;
      z-index: 1000;
      max-width: 300px;
    }
    .success {
      background-color: #d4edda;
      color: #155724;
    }
    .error {
      background-color: #f8d7da;
      color: #721c24;
    }
    .close-btn {
      background: none;
      border: none;
      float: right;
      cursor: pointer;
    }
  `]
})
export class NotificationComponent {
  @Input() message: string | null = null;
  @Input() type: 'success' | 'error' = 'success';
  @Output() closed = new EventEmitter<void>();
  
  close() {
    this.message = null;
    this.closed.emit();
  }
}