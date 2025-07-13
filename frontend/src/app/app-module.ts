import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TaskListComponent } from './components/task-list/task-list.component';

@NgModule({
  
  imports: [
    BrowserModule,
    AppComponent,         
    TaskListComponent
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
