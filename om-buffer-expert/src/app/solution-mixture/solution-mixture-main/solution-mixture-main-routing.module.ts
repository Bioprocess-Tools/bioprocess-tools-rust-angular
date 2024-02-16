import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolutionMixtureMainComponent } from './solution-mixture-main.component';

const routes: Routes = [
  { path: '', component: SolutionMixtureMainComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolutionMixtureMainRoutingModule { }
