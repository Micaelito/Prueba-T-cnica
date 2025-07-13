import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface Task {
  id?: string;
  title: string;
  description?: string;
  city: string;
  tempMin: number;
  tempMax: number;
  acceptRain: boolean;
  acceptWind: boolean;
  completed?: boolean;
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

  private taskCreatedSubject = new Subject<void>();
  taskCreated$ = this.taskCreatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  notifyTaskCreated(): void {
    this.taskCreatedSubject.next();
  }
}
