import {Component, Input} from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';


import { Router } from '@angular/router';
import { AuthService } from './providers/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  private isLoggedIn: Boolean;

  private loggedUserName: String;
  private loggedUserEmail: String;

  private uid: String;


  title = 'app works!';


  constructor(public authService: AuthService, private router: Router){
    this.authService.angularFire.auth.subscribe(
        (auth) => {
          if (auth == null){
            this.isLoggedIn = false;
            this.router.navigate(['login']);
          } else {
            this.isLoggedIn = true;
            this.uid = auth.uid;

            this.router.navigate(['']);
          }
        }
    )
  }


}
