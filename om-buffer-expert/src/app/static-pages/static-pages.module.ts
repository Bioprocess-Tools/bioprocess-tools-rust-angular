import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UserGuideComponent } from './user-guide/user-guide.component';
import { ContactUsComponent } from './contact-us/contact-us.component';



@NgModule({
  declarations: [
    HomeComponent,
    AboutUsComponent,
    FeedbackComponent,
    UserGuideComponent,
    ContactUsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class StaticPagesModule { }
