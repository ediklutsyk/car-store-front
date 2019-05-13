import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl: string = AppConfig.apiUrl;

  constructor(private http: HttpClient) {
  }

  public uploadFile(file: File): any {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.apiUrl + 'upload-file', formData,
      {responseType: 'text' as 'text'});
  }
}
