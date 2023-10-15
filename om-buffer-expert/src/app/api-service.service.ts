import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 // private apiUrl = 'https://buffer-designer-service-zuynyusrbq-uc.a.run.app/api';
 private apiUrl = 'http://127.0.0.1:5000/api'; 
  constructor(private http: HttpClient) { }

  sendUserInput(userInput: string) {
     console.log("God",userInput)
    return this.http.post<any>(`${this.apiUrl}/chat`, { userInput });
  }

  getSafetyImageUrl(id: number): Observable<string> {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${id}/JSON?heading=Chemical+Safety`;
    return this.http.get(url).pipe(
      map(response => this.parseImageUrl(response))
    );
  }
  private parseImageUrl(data: any): string {
    const sections = data['Record']['Section'];
    for (const section of sections) {
      if (section['TOCHeading'] === 'Chemical Safety') {
        const informations = section['Information'];
        for (const information of informations) {
          if (information['Name'] === 'Chemical Safety') {
            const stringWithMarkup = information['Value']['StringWithMarkup'];
            for (const string of stringWithMarkup) {
              const markups = string['Markup'];
              for (const markup of markups) {
                if (markup['Type'] === 'Icon') {
                  return markup['URL'];
                }
              }
            }
          }
        }
      }
    }
    return null;
  }

}
