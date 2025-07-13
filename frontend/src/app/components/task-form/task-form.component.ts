import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    city: ['', Validators.required],
    tempMin: [15, Validators.required],
    tempMax: [30, Validators.required],
    acceptRain: [false],
    acceptWind: [false]
  });

  feedbackMessage = '';

  constructor(private fb: FormBuilder, private taskService: TaskService) { }

  onSubmit(): void {
    this.feedbackMessage = '';

    if (this.taskForm.valid) {
      const newTask = {
        title: this.taskForm.value.title!,
        description: this.taskForm.value.description || '',
        city: this.taskForm.value.city!,
        tempMin: this.taskForm.value.tempMin!,
        tempMax: this.taskForm.value.tempMax!,
        acceptRain: this.taskForm.value.acceptRain || false,
        acceptWind: this.taskForm.value.acceptWind || false,
        completed: false
      };

      this.taskService.createTask(newTask).subscribe({
        next: (res: any) => {
          if (res.executable === false) {
            this.feedbackMessage = '❌ La tarea no es viable debido al clima actual.';
          } else {
            this.feedbackMessage = '✅ Tarea creada exitosamente.';
            this.taskForm.reset();
          }

          this.taskService.notifyTaskCreated();
        },
        error: () => {
          this.feedbackMessage = '❌ Error al crear tarea. Intenta de nuevo.';
        }
      });
    }
  }
}
