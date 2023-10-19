import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {


  constructor(private router: Router) { }

  // Method to navigate the user to the main tool or a walkthrough/demo of it
  navigateToTool(): void {
    this.router.navigate(['/buffer-designer']);  // Update with the correct path
  }

}
