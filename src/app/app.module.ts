import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';


// firebase modules
import { firebaseConfig } from '../environments/firebase.config';
import { routesConfig } from '../environments/routes.config';

import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';

import { AuthService } from './providers/auth.service';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';

import { RouterModule, Routes } from '@angular/router';
import { EntriesListComponent } from './entries-list/entries-list.component';
import { RemindersListComponent } from './reminders-list/reminders-list.component';
import { TableComponent } from './table/table.component';
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ChartsModule } from 'ng2-charts';
import { CheckBoxComponentComponent } from './check-box-component/check-box-component.component';
import { GraphComponent } from './graph/graph.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    EntriesListComponent,
    RemindersListComponent,
    TableComponent,
    CheckBoxComponentComponent,
    GraphComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(routesConfig),
    Ng2DatetimePickerModule, Ng2SmartTableModule, ChartsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule { }
