import {Routes} from "@angular/router";
import {HomePageComponent} from "../app/home-page/home-page.component";
import {LoginPageComponent} from "../app/login-page/login-page.component";

export const routesConfig: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'login', component: LoginPageComponent }
];