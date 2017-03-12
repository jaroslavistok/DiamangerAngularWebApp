import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login(userEmail: string, userPassword: string){
    this.authService.loginWithEmailAndPassword(userEmail, userPassword).then((data) => {
      console.log(data);
      this.router.navigate(['']);
    });
  }

}
