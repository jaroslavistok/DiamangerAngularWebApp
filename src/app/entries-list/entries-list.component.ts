import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../providers/auth.service';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";


@Component({
  selector: 'app-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrls: ['./entries-list.component.css']
})
export class EntriesListComponent implements OnInit {

  items: FirebaseListObservable<any[]>;
  private uid: String;

  constructor(public authService: AuthService, private router: Router, private angularFire: AngularFire) {
    this.authService.angularFire.auth.subscribe(
        (auth) => {
          if (auth == null){
            this.router.navigate(['login']);
          } else {
            this.uid = auth.uid;
            this.items = angularFire.database.list('/users/' + this.uid + "/items");
          }
        }
    );
  }

  ngOnInit() {
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['login']);
  }
}


