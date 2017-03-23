import {Routes} from "@angular/router";
import {HomePageComponent} from "../app/home-page/home-page.component";
import {LoginPageComponent} from "../app/login-page/login-page.component";
import {RemindersListComponent} from "../app/reminders-list/reminders-list.component";
import {EntriesListComponent} from "../app/entries-list/entries-list.component";
import {TableComponent} from "../app/table/table.component";

export const routesConfig: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'login', component: LoginPageComponent },
    // { path: 'home', component: HomePageComponent },
    { path: 'reminders', component: RemindersListComponent },
    { path: 'entries', component: EntriesListComponent },
    { path: 'tabletest', component: TableComponent }
];