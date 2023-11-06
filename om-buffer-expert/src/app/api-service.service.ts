import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
// private apiUrl = 'https://bioprocess-tools-buffer-api-zuynyusrbq-uc.a.run.app/api';
 private apiUrl = 'http://127.0.0.1:5000/api'; 
  constructor(private http: HttpClient) { }

  sendUserInput(userInput: string) {
     //console.log("God",userInput)
    return this.http.post<any>(`${this.apiUrl}/chat`, { userInput });
  }

  sendContactFormData(formData:any) {
    return this.http.post(`${this.apiUrl}/contact`,formData)
  }

  sendFeedbackFormData(formData:any) {
    return this.http.post(`${this.apiUrl}/feedback`,formData)
  }


}
