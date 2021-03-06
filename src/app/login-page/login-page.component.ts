import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {AuthService} from '../providers/auth.service';
import {AngularFire} from "angularfire2";

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

    loginActive: Boolean;
    registerActive: Boolean;
    displayLogin: String;
    displayRegister: String;
    errorMessage: String;

    constructor(private angularFire: AngularFire, public authService: AuthService, private router: Router) {
        this.loginActive = true;
        this.registerActive = false;
        this.displayLogin = "block";
        this.displayRegister = "none";

        this.errorMessage = "";
    }

    ngOnInit() {
    }

    login(userEmail: string, userPassword: string, adminCode: string) {
        this.authService.loginWithEmailAndPassword(userEmail, userPassword).then((data) => {
            let users = this.angularFire.database.object('/users/'+ data.uid);
            let usersToUpdate = this.angularFire.database.object('/users/'+ data.uid);

            users.subscribe(snapshot => {
                if (adminCode == "") {
                    usersToUpdate.update({ admin: false});
                } else if (adminCode == snapshot.admin_code) {
                    usersToUpdate.update({ admin: true });
                } else {
                    usersToUpdate.update({ admin: false});
                }
            });


        }).catch((error) => {
            this.setErrorMessage(error);
        });
    }

    register(userEmail: string, userPassword: string) {
        this.authService.registerUserWithEmailAndPassword(userEmail, userPassword).then(() => {
            this.router.navigate(['home']);
            this.changeToLogin();
        }).catch((error) => {
            this.setErrorMessage(error);
        });
    }

    setErrorMessage(error) {
        if (error.code == "auth/wrong-password") {
            this.errorMessage = "Nesprávne zadané prihlasovacie heslo";
        } else if (error.code == "auth/invalid-email") {
            this.errorMessage = "Nesprávne zadaný prihlasovací email";
        } else if (error.code == "auth/weak-password") {
            this.errorMessage = "Slabé heslo";
        } else if (error == 'wrong_pin') {
            this.errorMessage = "Nespraven zadany PIN";
        } else {
            this.errorMessage = "Nesprávne zadané prihlasovacie údaje";
        }
    }

    changeToLogin() {
        this.loginActive = true;
        this.registerActive = false;
        this.displayLogin = "block";
        this.displayRegister = "none";
    }

    changeToRegister() {
        this.registerActive = true;
        this.loginActive = false;
        this.displayLogin = "none";
        this.displayRegister = "block";
    }
}
