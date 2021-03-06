import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../providers/auth.service';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Reminder} from './Reminder';
import {Ng2SmartTableModule, LocalDataSource} from "ng2-smart-table";
import {CheckBoxComponentComponent} from "../check-box-component/check-box-component.component";
import {isNumeric} from "rxjs/util/isNumeric";

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
        pager: {
            display: true,
            perPage: 50
        },

        mode: 'inline',


        delete: {
            confirmDelete: true,
            deleteButtonContent: "Vymazať"
        },
        edit: {
            confirmSave: true,
            editButtonContent: 'Zmeniť',
            saveButtonContent: "Uložiť",
            cancelButtonContent: "Zrušiť"
        },
        add: {
            confirmCreate: true,
            addButtonContent: 'Pridať',
            createButtonContent: 'Vytvoriť',
            cancelButtonContent: 'Zrušiť'
        }
    };

    tableData: LocalDataSource;
    errorMessage: String = "";

    items: FirebaseListObservable<any[]>;
    private uid: String;
    private lastReminderIdValue: string;
    private admin : Boolean;


    public reminder = new Reminder('', '', '', '', false);
    public lastReminderId: FirebaseObjectObservable<any>;

    addReminder() {
        this.lastReminderId.update({'last_reminder_id': this.reminder.id});
        this.reminder.alarmTime = this.reminder.alarmTime.toString();
        this.items.push(this.reminder);
    }

    constructor(public authService: AuthService, private router: Router, private angularFire: AngularFire) {
        this.authService.angularFire.auth.subscribe(
            (auth) => {
                if (auth == null) {
                    this.router.navigate(['login']);
                } else {
                    this.uid = auth.uid;
                    this.items = angularFire.database.list('/users/' + this.uid + "/reminders");

                    this.items.subscribe(snapshot => {
                        this.tableData = new LocalDataSource(snapshot);
                    });

                    this.lastReminderId = angularFire.database.object('/users/' + this.uid);
                    this.lastReminderId.subscribe(snapshot => {
                        this.lastReminderIdValue = snapshot.last_reminder_id;
                    });


                    let users = this.angularFire.database.object('/users/'+ this.uid);
                    users.subscribe(snapshot => {
                        if (snapshot.admin) {
                            this.admin = true;
                        }
                    });

                }
            }
        );
    }

    onCreate(event) {
        if (!this.admin){
            this.errorMessage = "Nemáš admin práva, odhlás sa a prihlás sa pomocou PIN=u";
            return event.confirm.reject();
        }

        if (this.validateReminderData(event.newData)) {

            let newId = parseInt(this.lastReminderIdValue) + 1;
            event.newData.id = newId.toString();
            this.lastReminderId.update({'last_reminder_id': event.newData.id.toString()});
            this.items.push(event.newData);

            this.errorMessage = "";
            return event.confirm.resolve(event.newData);
        }

        return event.confirm.reject();
    }

    validateReminderData(reminderData) {
        var valid: boolean = true;
        if (reminderData.name.length < 1) {
            this.errorMessage = "Meno nesmie byť prázdne!";
            valid = false
        }
        if (reminderData.category.length < 1) {
            this.errorMessage = "Kategória nesmie byt prázdna";
            valid = false;
        }
        if (!this.validateTime(reminderData.alarmTime)) {
            this.errorMessage = "Nekorektne zadaný čas";
            valid = false;
        }
        return valid;
    }

    validateTime(time) {
        let hoursAndMinutes = time.split(':');
        let hours = parseInt(hoursAndMinutes[0]);
        let minutes = parseInt(hoursAndMinutes[1]);
        if (!isNumeric(hoursAndMinutes[0]) || !isNumeric(hoursAndMinutes[1])){
            return false;
        }
        if (hours < 0 || hours > 24) {
            return false;
        }
        if (minutes < 0 || minutes > 59) {
            return false;
        }
        return true;
    }

    onEdit(event) {
        if (!this.admin){
            this.errorMessage = "Nemáš admin práva, odhlás sa a prihlás sa pomocou PIN=u";
            return event.confirm.reject();
        }


        if (this.validateReminderData(event.newData)) {
            let editedReminder = {
                category: event.newData.category,
                active: event.newData.active,
                alarmTime: event.newData.alarmTime,
                name: event.newData.name
            };

            this.items.update(event.data.$key, editedReminder);
            this.errorMessage = "";
            return event.confirm.resolve(event.data);
        }

        return event.confirm.reject();
    }

    onDelete(event) {
        if (!this.admin){
            this.errorMessage = "Nemáš admin práva, odhlás sa a prihlás sa pomocou PIN=u";
            return event.confirm.reject();
        }

        if (window.confirm('Prajete si skutočne odstrániť záznam?')) {
            this.items.remove(event.data);
            return event.confirm.resolve(event.data);
        }
        return event.confirm.reject();
    }

    ngOnInit() {
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }
}
