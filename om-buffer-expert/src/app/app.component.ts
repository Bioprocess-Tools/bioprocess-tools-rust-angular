import { Component, OnInit } from '@angular/core';
import { SolutionService } from './solution.service';
import { Solution } from './shared/models/solution.model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'om-buffer-expert';
  solution:Solution | undefined;
  constructor(
    
    private solutionService: SolutionService,
    
    private router: Router
    
    
    ) {
  

    }

  ngOnInit() {
    //this.solution = this.solutionService.solution;
  }
  
}

