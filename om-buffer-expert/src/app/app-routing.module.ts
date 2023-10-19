import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './static-pages/home/home.component';
import { AboutUsComponent } from './static-pages/about-us/about-us.component';
import { FeedbackComponent } from './static-pages/feedback/feedback.component';
import { UserGuideComponent } from './static-pages/user-guide/user-guide.component';
import { ContactUsComponent } from './static-pages/contact-us/contact-us.component';
import { BufferDesignerComponent } from './buffer-designer/buffer-designer.component';

// const routes: Routes = [
// {path:'NLP-Input',component:ChatbufferomComponent},
// {path:'Drop-Down-Input', component:BufferCalculationOption2Component},
// {path:'pH-Calculator',component:BufferCalculationOption1Component},
// {path:'',redirectTo:'NLP-Input',pathMatch:'full'},
// {path:'**',redirectTo:'NLP-Input' }

// ];

const routes: Routes = [
  // ...existing routes...
  { path: '', component: HomeComponent },  // if '' should point to the HomeComponent
  { path: 'home', component: HomeComponent },
  { path: 'buffer-designer', component: BufferDesignerComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'user-guide', component: UserGuideComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { 
    path: 'buffer-designer', 
    loadChildren: () => import('./buffer-designer/buffer-designer.module').then(m => m.BufferDesignerModule) 
  },
  // ... more routes ...
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule]

})
export class AppRoutingModule { }