import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent {



  onTabChange(event: MatTabChangeEvent) {
    const selectedIndex = event.index;
    // Perform actions based on the selected tab index
  }

}


