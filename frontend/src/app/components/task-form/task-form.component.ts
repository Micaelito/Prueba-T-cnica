import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    city: [''],
    tempMin: [15],
    tempMax: [30],
    acceptRain: [false],
    acceptWind: [false]
  });

  feedbackMessage = '';

  constructor(private fb: FormBuilder, private taskService: TaskService) { }

  onSubmit(): void {
    this.feedbackMessage = '';

    if (this.taskForm.valid) {
      const newTask = {
        title: this.taskForm.value.title ?? '',
        description: this.taskForm.value.description ?? '',
        city: this.taskForm.value.city ?? 'Madrid',
        tempMin: this.taskForm.value.tempMin ?? 10,
        tempMax: this.taskForm.value.tempMax ?? 30,
        acceptRain: this.taskForm.value.acceptRain ?? false,
        acceptWind: this.taskForm.value.acceptWind ?? false,
        completed: false
      };

      this.taskService.createTask(newTask).subscribe({
        next: (res) => {
          if (res.executable === false) {
            this.feedbackMessage = '❌ La tarea no es viable debido al clima actual.';
          } else {
            this.feedbackMessage = '✅ Tarea creada exitosamente.';
            this.taskForm.reset();
            this.taskService.taskCreated$.next();
          }
        },
        error: (err) => {
          console.error('Error al crear tarea:', err);
          this.feedbackMessage = '❌ Error al crear tarea. Intenta de nuevo.';
        }
      });
    }
  }
}
