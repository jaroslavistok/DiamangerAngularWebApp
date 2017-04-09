import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../providers/auth.service';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Entry} from "./Entry";
import {DateFormatter} from "@angular/common/src/pipes/intl";
import {LocalDataSource} from "ng2-smart-table";
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

const CATEGORIES = [
    {value: 'Ráno', title: 'Ráno'},
    {value: 'Desiata', title: 'Desiata'},
    {value: 'Obed', title: 'Obed'},
    {value: 'Olovrant', title: 'Olovrant'},
    {value: 'Večera', title: 'Večera'},
    {value: 'Druhá večera', title: 'Druhá večera'},
    {value: 'Noc', title: 'Noc'},
    {value: 'Ostatné', title: 'Ostatné'}
];


@Component({
    selector: 'app-entries-list',
    templateUrl: './entries-list.component.html',
    styleUrls: ['./entries-list.component.css']
})

export class EntriesListComponent implements OnInit {

    items: FirebaseListObservable<any[]>;
    private uid: String;

    public date: Date;
    public entry: Entry;
    public categories = CATEGORIES;

    settings = {
        columns: {
            glucoseValue: {
                title: "Hodnota glykémie"
            },
            category: {
                title: 'Kategória',
                editor: {
                    type: 'list',
                    config: {
                        list: CATEGORIES
                    }
                }
            },
            date: {
                title: 'Dátum',
            },
            time: {
                title: 'Čas'
            },
            fastInsuline: {
                title: 'Rýchly inzulín'
            },
            slowInsuline: {
                title: 'Pomalý inzulín'
            },
            note: {
                title: 'Poznámka'
            }
        },
        pager: {
            display: true,
            perPage: 50
        },

        mode: 'inline',


        delete: {
            confirmDelete: true
        },
        edit: {
            confirmSave: true
        },
        add: {
            confirmCreate: true
        }
    };

    tableData: LocalDataSource;


    addValue() {
        this.items.push(this.entry)
    }

    constructor(public authService: AuthService, private router: Router, private angularFire: AngularFire) {
        this.authService.angularFire.auth.subscribe(
            (auth) => {
                if (auth == null) {
                    this.router.navigate(['login']);
                } else {
                    this.date = new Date();
                    this.entry = new Entry('', '', DateFormatter.format(this.date, 'sk', 'yyyy.mm.dd HH:mm'), '', '', '', '');

                    this.uid = auth.uid;
                    this.items = angularFire.database.list('/users/' + this.uid + "/items");

                    this.items.subscribe(snapshot => {
                        this.tableData = new LocalDataSource(snapshot);
                    });
                }
            }
        );
    }


    getCurrentTime(){
        let date = new Date();
        return date.toLocaleTimeString('sk', {hour: '2-digit', minute:'2-digit'});
    }

    getTodayDate() {
        let date = new Date();
        return date.toLocaleDateString('sk');
    }


    onCreate(event) {
        console.log("oncreate");
        console.log(event.newData);

        if (event.newData.time != null) {
            event.newData.time = this.getCurrentTime();
        }
        if (event.newData.date != null) {
            event.newData.date = this.getTodayDate();
        }
        this.items.push(event.newData);
        return event.confirm.resolve(event.newData);
    }

    onEdit(event) {
        console.log("onedit");
        console.log(event.data);
        let editedEntry = {
            category: event.newData.category,
            date: event.newData.date,
            time: event.newData.time,
            fastInsuline: event.newData.fastInsuline,
            slowInsuline: event.newData.slowInsuline,
            glucoseValue: event.newData.glucoseValue,
        };

        this.items.update(event.data.$key, editedEntry);
        this.items.update(event.data.$key, editedEntry);
        return event.confirm.resolve(event.data);
    }

    onDelete(event) {
        console.log("ondelete");
        console.log(event.data);
        this.items.remove(event.data);
        return event.confirm.resolve(event.data);
    }

    ngOnInit() {
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }
}


