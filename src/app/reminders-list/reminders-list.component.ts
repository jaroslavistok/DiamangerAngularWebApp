import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../providers/auth.service';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";
import { Reminder } from './Reminder';

@Component({
  selector: 'app-reminders-list',
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.css']
})
export class RemindersListComponent implements OnInit {

  items: FirebaseListObservable<any[]>;
  private uid: String;

  public reminder = new Reminder('', '', '', '', false);
  public lastReminderId: FirebaseObjectObservable<any>;

  addReminder(){
    this.lastReminderId.update({'last_reminder_id': this.reminder.id});
    this.reminder.alarmTime = this.reminder.alarmTime.toString();
    this.items.push(this.reminder);
  }

  constructor(public authService: AuthService, private router: Router, private angularFire: AngularFire) {
    this.authService.angularFire.auth.subscribe(
        (auth) => {
          if (auth == null){
            this.router.navigate(['login']);
          } else {
            this.uid = auth.uid;
            this.items = angularFire.database.list('/users/' + this.uid + "/reminders");
            this.lastReminderId = angularFire.database.object('/users/'+ this.uid);
            this.lastReminderId.subscribe(snapshot => {

              if (snapshot.last_reminder_id == null){
                this.reminder.id = "0";
              } else {
                this.reminder.id = ""+(parseInt(snapshot.last_reminder_id) + 1)+"";
              }

            });
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
