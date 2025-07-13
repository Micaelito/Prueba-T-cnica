import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();

    this.taskService.taskCreated$.subscribe(() => {
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data.sort((a, b) => (b.viabilityScore ?? 0) - (a.viabilityScore ?? 0));
      },
      error: (err) => {
        console.error('Error al obtener tareas:', err);
      }
    });
  }

  deleteTask(id: string | undefined): void {
    if (!id) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => {
        console.error('Error al eliminar tarea:', err);
      }
    });
  }
}
