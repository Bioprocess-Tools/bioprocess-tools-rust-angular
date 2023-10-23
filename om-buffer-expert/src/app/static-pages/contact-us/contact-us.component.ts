import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl } from '@angular/forms';
import { ApiService } from 'src/app/api-service.service';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  contactForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) {
    this.createContactForm();
  }

  createContactForm() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    // Process contact form here
    if (this.contactForm.valid) {
     this.apiService.sendContactFormData(this.contactForm.value)
     .subscribe(response => {console.log(response); }, error => {console.error(error);} )

      // You can send this data to your backend server
      // for further processing like sending an email.

      // Reset the form if submission is successful
      this.contactForm.reset();
    }
  }
}