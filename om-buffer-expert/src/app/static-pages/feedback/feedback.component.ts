import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl } from '@angular/forms';
import { ApiService } from 'src/app/api-service.service';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  feedbackForm: FormGroup;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValues = {
    userExperience: 0, 
    calculationConfidence: 0, 
    featureSet: 0
  }; // Keeping track of each rating

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) {
    this.createFeedbackForm();
  }

  createFeedbackForm() {
    this.feedbackForm = this.formBuilder.group({
      userExperience: [0, Validators.required],
      userExperienceComments: ['', Validators.required],
      calculationConfidence: [0, Validators.required],
      calculationConfidenceComments: ['', Validators.required],
      featureSet: [0, Validators.required],
      featureSetComments: ['', Validators.required],
      email:['']
    });
  }

  // Method to handle the selection of stars
  countStar(star, field) {
    this.selectedValues[field] = star;
    this.feedbackForm.patchValue({[field]: star});

  }

  onSubmit() {
    // Process the collected data
    if (this.feedbackForm.valid) {
      const feedbackInformation = this.feedbackForm.value;


      this.apiService.sendFeedbackFormData(this.feedbackForm.value).subscribe(response => {}
      , error => {console.error(error);});
      

      // You can send this data to your backend server
      // for further processing like sending an email.

      // Reset the form if submission is successful
      this.feedbackForm.reset();
    }
  }
}
