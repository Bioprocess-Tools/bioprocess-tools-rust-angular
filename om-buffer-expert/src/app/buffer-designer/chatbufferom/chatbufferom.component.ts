import { Component, OnInit } from '@angular/core';
import { FormControl,ValidatorFn,AbstractControl, FormGroup } from '@angular/forms';
import { ApiService } from '../../api-service.service';
import { Solution } from '../../shared/models/solution.model';
import { SolutionService } from '../../solution.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {Router} from '@angular/router';


@Component({
  selector: 'app-chatbufferom',
  templateUrl: './chatbufferom.component.html',
  styleUrls: ['./chatbufferom.component.scss']
})
export class ChatbufferomComponent implements OnInit{
  form:FormGroup;
  ionControl:FormControl;
  response_solution:Solution;
  ion_names:string[]=[];
  ion_names_lower:string[]=[];
  example_solution: Solution;

  constructor(private apiService: ApiService,  private router: Router,   public solutionService: SolutionService)
   { 
    
  
  }

ionValidator():ValidatorFn {
  return (control:AbstractControl): {   [key:string]:any} | null => {
 
    //console.log("got here goddess",this.getCorrectionSuggestion("Please make me 40mM Pispate buffer pH 4") )
    const inputwords = this.getWords(control.value);

    this.ion_names_lower = this.ion_names.map(word => word.toLowerCase());
    const isValid = inputwords.some(word => this.ion_names_lower.includes(word));
    //console.log("God is valid", isValid);
    return isValid ? null : {'invalidIon': {value: control.value} };
  };
}




  ngOnInit() {
    this.solutionService.get_ion_names();
    this.solutionService.ion_names$.subscribe(
      ion_names => {
        this.ion_names = ion_names;
        //console.log("God got this", this.ion_names);
      }
    );

    this.solutionService.example_solution$.subscribe(
      example_solution => {
        this.example_solution = example_solution;
        this.response_solution = example_solution;
        //console.log("God example solution in buffer calc 2", this.example_solution);
      }
    );
  
    //this.ion_names_lower = this.ion_names.map(word => word.toLowerCase());
    //console.log("God: on init ", this.ion_names_lower);

    this.form = new FormGroup({
      userInput: new FormControl('',),

    });
   this.form.get('userInput').setValidators([this.ionValidator()]);
 this.form.get('userInput').updateValueAndValidity();
  }

  getWords(sentence: string): string[] {
    // The regular expression matches any word (sequence of letters) that is
    // surrounded by word boundaries. The 'g' flag means it will match all
    // occurrences, not just the first one.
    sentence = sentence.toLowerCase()
    const regex = /\b[A-Za-z]+\b/g;
    
    // The match method returns an array of all matches.
    const matches = sentence.match(regex);
    
    // If there were no matches, return an empty array. Otherwise, return the matches.
    return matches ? matches : [];
  }
  

  onSubmit(form: FormGroup) {
    const userInput = this.form.value.userInput
   
   // this.response = this.form.value.userInput
   const inputclean = this.getWords(this.form.value.userInput)
   this.ion_names_lower = this.ion_names.map(word => word.toLowerCase());
    //console.log('Great god', inputclean,this.ion_names_lower)
    const isValid = inputclean.some(word => this.ion_names_lower.includes(word));
    //console.log("God: isValid", isValid, inputclean)
    if(isValid==false) {
      //console.log("God: Please change the input")
    }
    else { 
      //console.log("God: Good to got.");




     this.apiService.sendUserInput(userInput)
      .subscribe(response => {
        this.response_solution = new Solution("God");
        Object.assign(this.response_solution,response);
        this.solutionService.add_Solution(this.response_solution);

        this.solutionService.changeSolution(this.response_solution);
        this.form.markAsUntouched();
        console.log(this.response_solution);
      }); 
    
  }
}


// Suppose we have a user object with a name property
user = {
  name: 'Phosphate'
};

// We can get the first letter of the name like this
avatarLetter = this.user.name.charAt(0).toUpperCase();



}