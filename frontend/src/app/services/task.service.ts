import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id?: string;
  title: string;
  description: string;
  city: string;
  tempMin: number;
  tempMax: number;
  acceptRain: boolean;
  acceptWind: boolean;
  executable?: boolean;
  viabilityScore?: number;
  reasonsNotExecutable?: string[];
  weather?: {
    temp: number;
    weather: string;
    wind: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }
}
