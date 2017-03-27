import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../providers/auth.service';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";
import { Reminder } from './Reminder';
import { Ng2SmartTableModule, LocalDataSource } from "ng2-smart-table";
import {Observable} from "rxjs";
import {any} from "codelyzer/util/function";



@Component({
  selector: 'app-reminders-list',
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.css']
})
export class RemindersListComponent implements OnInit {
    source: LocalDataSource;

    settings = {
        columns: {
            active: {
                title: 'Aktívny'
            },
            alarmTime: {
                title: 'Čas'
            },
            category: {
                title: 'Kategória'
            },
            id: {
                title: 'ID'
            },
            name: {
                title: 'Meno'
            },
        },
        pager : {
            display : true,
            perPage:50
        },

        mode: 'inline',


        delete : {
            confirmDelete: true
        },
        edit: {
            confirmSave: true
        },
        add : {
            confirmCreate: true
        }
    };

    tableData :LocalDataSource;


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

            this.items.subscribe(snapshot => {
                this.tableData = new LocalDataSource(snapshot);
            });

            this.lastReminderId = angularFire.database.object('/users/'+ this.uid);
            this.lastReminderId.subscribe(snapshot => {

              if (snapshot.last_reminder_id == null){
                this.reminder.id = "0";
              } else {
                this.reminder.id = "" + (parseInt(snapshot.last_reminder_id) + 1) + "";
              }

            });
          }
        }
    );
  }


  onCreate(event){
      console.log("oncreate");
      console.log(event.newData);
      this.items.push(event.newData);
      return event.confirm.resolve(event.newData);
  }

  onEdit(event){
      console.log("onedit");
      console.log(event.data);
      this.items.update(event.data.$key, event.newData);
      return event.confirm.resolve(event.data);
  }

  onDelete(event){
      console.log("ondelete");
      console.log(event.data);
      this.items.remove(event.data);
      return event.confirm.resolve(event.data);
  }

  ngOnInit() {
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
