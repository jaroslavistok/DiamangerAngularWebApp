import { Component } from '@angular/core';
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


  title = 'app works!';
  // items: FirebaseListObservable<any[]>;
  // constructor(private angularFire: AngularFire){
  //   this.items = angularFire.database.list('/entries');
  // }

  constructor(public authService: AuthService, private router: Router){
    this.authService.angularFire.auth.subscribe(
        (auth) => {
          if (auth == null){
            this.isLoggedIn = false;
            this.router.navigate(['login']);
          } else {
            this.isLoggedIn = true;
            this.router.navigate(['']);
          }
        }
    )
  }


}
