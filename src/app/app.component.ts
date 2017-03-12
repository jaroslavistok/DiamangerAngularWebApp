import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app works!';
  items: FirebaseListObservable<any[]>;
  constructor(private angularFire: AngularFire){
    this.items = angularFire.database.list('/entries');
  }

}
