import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Routes } from '@angular/router';
import { ChatbufferomComponent } from './chatbufferom/chatbufferom.component';
import { BufferCalculationOption1Component } from './buffer-calculation-option1/buffer-calculation-option1.component';
import { BufferCalculationOption2Component } from './buffer-calculation-option2/buffer-calculation-option2.component';
import { BufferDesignerComponent } from './buffer-designer.component';
import { SolutionTableComponent } from './solution-table/solution-table.component';
import { SuperCalculatorComponent } from './super-calculator/super-calculator.component';
const bufferDesignerRoutes: Routes = [
  {
    path: 'buffer-designer', // removed the leading '/' as paths are usually relative
    component: BufferDesignerComponent, // This parent component should hold the <router-outlet> for child components
    children: [
      {
        path: '', // empty path for default route
        redirectTo: 'genai-buffer-designer', // redirect to the GenAI component path
        pathMatch: 'full',
      },
      {
        path: 'genai-buffer-designer', // consider using 'kebab-case' for URLs
        component: ChatbufferomComponent,
      },
      {
        path: 'classic-buffer-designer',
        component: BufferCalculationOption2Component,
      },
      {
        path: 'ph-calculator',
        component: BufferCalculationOption1Component,
      },
      {
        path: 'super-calculator',
        component: SuperCalculatorComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bufferDesignerRoutes)],  // use forChild for feature modules
  exports: [RouterModule]
})
export class BufferDesignerRoutingModule { }



