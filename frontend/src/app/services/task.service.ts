import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface Task {
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  city: string;
  tempMin: number;
  tempMax: number;
  acceptRain: boolean;
  acceptWind: boolean;
  executable?: boolean;
  viabilityScore?: number;
  weather?: any;
  reasonsNotExecutable?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  // ✅ Esta propiedad es la que estaba faltando
  taskCreated$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, task);
  }
}
