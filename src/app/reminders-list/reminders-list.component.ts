import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../providers/auth.service';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";
import { Reminder } from './Reminder';
import { Ng2SmartTableModule, LocalDataSource } from "ng2-smart-table";
import {CheckBoxComponentComponent} from "../check-box-component/check-box-component.component";

@Component({
  selector: 'app-reminders-list',
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.css'],
    entryComponents: [
        CheckBoxComponentComponent
    ]
})
export class RemindersListComponent implements OnInit {

    settings = {
        actions: {
            columnTitle: 'Akcie'
        },
        columns: {
            active: {
                title: 'Aktívny',

                type: 'custom',
                renderComponent: CheckBoxComponentComponent,

                filter: {
                    type: 'checkbox'
                },

                editor: {
                    type: 'checkbox'
                },

            },
            alarmTime: {
                title: 'Čas'
            },
            category: {
                title: 'Kategória'
            },
            id: {
                title: 'ID',
                editable: false
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
            confirmDelete: true,
            deleteButtonContent: "Vymazať"
        },
        edit: {
            confirmSave: true,
            editButtonContent: 'Zmeniť',
            saveButtonContent: "Uložiť",
            cancelButtonContent: "Zrušiť"
        },
        add : {
            confirmCreate: true,
            addButtonContent: 'Pridať',
            createButtonContent: 'Vytvoriť',
            cancelButtonContent: 'Zrušiť'
        }
    };

    tableData :LocalDataSource;


  items: FirebaseListObservable<any[]>;
  private uid: String;
  private lastReminderIdValue: string;

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

            this.items.subscribe(snapshot => {
                this.tableData = new LocalDataSource(snapshot);
            });

            this.lastReminderId = angularFire.database.object('/users/'+ this.uid);
            this.lastReminderId.subscribe(snapshot => {
              this.lastReminderIdValue = snapshot.last_reminder_id;
            });

          }
        }
    );
  }

  onCreate(event){
      let newId = parseInt(this.lastReminderIdValue)+1;
      event.newData.id = newId.toString();
      this.lastReminderId.update({'last_reminder_id': event.newData.id.toString() });
      this.items.push(event.newData);
      return event.confirm.resolve(event.newData);
  }

  validateReminderData(reminderData){
  /*public name: string,
          public category: string,
          public alarmTime: string,
          public id: string,
          public active: boolean,*/
      var valid :boolean = true;
      if (reminderData.name.length < 1){
          valid = false
      }
      if (reminderData.category.length < 1){
          valid = false;
      }






  }

  validateTime(time){
      var hoursAndMinutes = time.split(':');
      var hours = parseInt(hoursAndMinutes[0]);
      var minutes = parseInt(hoursAndMinutes[1]);

      console.log("hours: " + hours);
      console.log("minutes: "+ minutes);

      if (hours < 0 || hours > 24){
          return false;
      }
      if (minutes < 0 || minutes > 59){
          return false;
      }
  }

  onEdit(event){

      window.alert("Bad data");

      return event.confirm.reject();

      // let editedReminder = {
      //     category: event.newData.category,
      //     active: event.newData.active,
      //     alarmTime: event.newData.alarmTime,
      //     name: event.newData.name
      // };
      //
      // this.items.update(event.data.$key, editedReminder);
      //
      // console.log("on update");


      // return event.confirm.resolve(event.data);

  }

  onDelete(event){
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
