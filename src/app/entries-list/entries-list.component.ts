import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../providers/auth.service';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Entry} from "./Entry";
import {DateFormatter} from "@angular/common/src/pipes/intl";
import {LocalDataSource} from "ng2-smart-table";

const CATEGORIES = [
    {id: 1, title: 'Ráno'},
    {id: 2, title: 'Desiata'},
    {id: 3, title: 'Obed'},
    {id: 4, title: 'Olovrant'},
    {id: 5, title: 'Večera'},
    {id: 6, title: 'Druhá večera'},
    {id: 7, title: 'Noc'},
    {id: 8, title: 'Ostatné'}
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
            carbs: {
                title: 'Cukor'
            },
            category: {
                title: 'Kategória'
            },
            datetime: {
                title: 'Čas'
            },
            fastInsuline: {
                title: 'Rýchly inzulín'
            },
            slowInsuline: {
                title: 'Pomalý inzulín'
            },
            glucoseValue: {
                title: "Hodnota glykémie"
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

    onCreate(event) {
        console.log("oncreate");
        console.log(event.newData);
        this.items.push(event.newData);
        return event.confirm.resolve(event.newData);
    }

    onEdit(event) {
        console.log("onedit");
        console.log(event.data);
        let cat = {
            category: event.newData.category,
            dateTime: event.newData.datetime,
            fastInsuline: event.newData.fastInsuline,
            slowInsuline: event.newData.slowInsuline,
            glucoseValue: event.newData.glucoseValue,
            carbs: event.newData.carbs
        };

        this.items.update(event.data.$key, cat);
        this.items.update(event.data.$key, cat);
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


