import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BufferCalculationOption1Component } from './buffer-calculation-option1/buffer-calculation-option1.component';
import { BufferCalculationOption2Component } from './buffer-calculation-option2/buffer-calculation-option2.component';
import { ChatbufferomComponent } from './chatbufferom/chatbufferom.component';
import { SolutionTableComponent } from './solution-table/solution-table.component';

const routes: Routes = [
{path:'NLP-Input',component:ChatbufferomComponent},
{path:'Drop-Down-Input', component:BufferCalculationOption2Component},
{path:'pH-Calculator',component:BufferCalculationOption1Component},
{path:'',redirectTo:'NLP-Input',pathMatch:'full'},
{path:'**',redirectTo:'NLP-Input' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule]

})
export class AppRoutingModule { }