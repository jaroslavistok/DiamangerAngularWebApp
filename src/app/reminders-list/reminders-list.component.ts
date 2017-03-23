import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../providers/auth.service';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";
import { Reminder } from './Reminder';
// import { Ng2SmartTableModule } from "ng2-smart-table";



@Component({
  selector: 'app-reminders-list',
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.css']
})
export class RemindersListComponent implements OnInit {

    settings = {
        columns: {
            id: {
                title: 'ID'
            },
            name: {
                title: 'Full Name'
            },
            username: {
                title: 'User Name'
            },
            email: {
                title: 'Email'
            }
        }
    };

    tableData = [
        {
            id: 1,
            name: "Leanne Graham",
            username: "Bret",
            email: "Sincere@april.biz"
        },
        {
            id: 2,
                name: "Ervin Howell",
            username: "Antonette",
            email: "Shanna@melissa.tv"
        },

        {
            id: 11,
                name: "Nicholas DuBuque",
            username: "Nicholas.Stanton",
            email: "Rey.Padberg@rosamond.biz"
        }
    ];


  items: FirebaseListObservable<any[]>;
  private uid: String;

  public reminder = new Reminder('', '', '', '', false, false);
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
