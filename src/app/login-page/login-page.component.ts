import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../providers/auth.service';

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

  constructor(public authService: AuthService, private router: Router) {
    this.loginActive = true;
    this.registerActive = false;
    this.displayLogin = "block";
    this.displayRegister = "none";
  }

  ngOnInit() {
  }

  login(userEmail: string, userPassword: string){
    this.authService.loginWithEmailAndPassword(userEmail, userPassword).then((data) => {
      console.log(data);
      this.router.navigate(['']);
    }).catch((error)=> {
      console.log("Nespravne zadane informacie" + JSON.stringify(error));
    });
  }

  register(userEmail: string, userPassword: string){
    this.authService.registerUserWithEmailAndPassword(userEmail, userPassword).then(()=>{
      this.router.navigate(['home']);
      this.changeToLogin();
    }).catch((error)=> {
      console.log(error);
      console.log("Error: " + JSON.stringify(error));
    });

  }


  changeToLogin(){
    console.log("ffjirf");
    this.loginActive = true;
    this.registerActive = false;

    this.displayLogin = "block";
    this.displayRegister = "none";
  }

  changeToRegister(){
    console.log("efiefwof");

    this.registerActive = true;
    this.loginActive = false;

    this.displayLogin = "none";
    this.displayRegister = "block";
  }

}
