// shared/footer/footer.component.ts
import { Component , OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  // يمكنك إضافة أي منطق إضافي هنا إذا لزم الأمر
  subscribeToNewsletter(email: string): void {
    // هنا يمكنك إضافة منطق الاشتراك في النشرة الإخبارية
    console.log('Email subscribed:', email);
  }

  acceptTerms(event: any): void {
    // منطق قبول الشروط
    console.log('Terms accepted:', event.target.checked);
  }
}