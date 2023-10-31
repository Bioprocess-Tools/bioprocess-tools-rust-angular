import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  teamMembers = [
    {
      name: 'Natraj Ram., Ph.D.',
      title: 'Technical Advisor',
      bio: 'Passionate engineer with over 30 years of experience in biotech, with deep interest in democratizing knowledge',
      image: '/assets/images/Natrajtiny.jpg' // place actual path to image
    },
    {
      name: 'Adharsh Ravi',
      title: 'Developer',
      bio: 'Enthusiastic, diligent, cerebral techie - who loves problem solving',
      image: '/assets/images/Adharshtiny.jpg' // place actual path to image
    },
    {
      name: 'Srividhya Ram',
      title: 'Design Consultant and Project Coordinator',
      bio: 'Naturally talented design thinker, with the ability manage people and projects with inspiration and discipline!',
      image: '/assets/images/Vidhya.jpg' // place actual path to image
    }
    // Add more team members as needed
  ];

  constructor() { }

  ngOnInit(): void {
  }

}