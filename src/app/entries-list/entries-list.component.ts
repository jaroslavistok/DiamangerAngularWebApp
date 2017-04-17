import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../providers/auth.service';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Entry} from "./Entry";
import {DateFormatter} from "@angular/common/src/pipes/intl";
import {LocalDataSource} from "ng2-smart-table";
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
import {isNumeric} from "rxjs/util/isNumeric";

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
        actions: {
            columnTitle: 'Akcie'
        },
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
    public errorMessage: string = "";


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
        if (this.validateEntryData(event.newData)) {
            if (event.newData.time != null) {
                event.newData.time = this.getCurrentTime();
            }
            if (event.newData.date != null) {
                event.newData.date = this.getTodayDate();
            }
            this.items.push(event.newData);

            this.errorMessage = "";
            return event.confirm.resolve(event.newData);
        }

        return event.confirm.reject();
    }

    onEdit(event) {
        console.log(event.newData);
        if (this.validateEntryData(event.newData)) {

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

        return event.confirm.reject();
    }

    onDelete(event) {
        if (window.confirm("Prajete si skutocne zaznam? ")) {
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

    private validateEntryData(entry) {
        var isValid = true;
        if (entry.category.length < 1){
            this.errorMessage = "Kategoria nesmie byt prazdna!";
            isValid = false;
        }

        if (!isNumeric(entry.fastInsuline) && entry.fastInsuline.length > 0){
            this.errorMessage = "Hodnota rychleho inzulinu musi byt cislo!";
            isValid = false;
        }
        if (!isNumeric(entry.slowInsuline) && entry.slowInsuline.length > 0){
            this.errorMessage = "Hodnota pomaleho inzulinu musi byt cislo!";
            isValid = false;
        }
        if (!isNumeric(entry.glucoseValue) && entry.glucoseValue.length > 0){
            this.errorMessage = "Hodnota glykemie musi byt cislo";
            isValid = false;
        }
        if (this.validateTime(entry.time)){
            this.errorMessage = "Zadany nespravny cas HH:MM";
            isValid = false;
        }
        if (this.validateDate(entry.date)){
            this.errorMessage = "Zadany nespravny datum DD.MM.YYYY";
            isValid = false;
        }

        return isValid;
    }

    private validateTime(time) {
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

    private validateDate(date) {
        let dateParts = date.split('.');
        let day = parseInt(dateParts[0]);
        let month = parseInt(dateParts[1]);
        let year = parseInt(dateParts[2]);

        if (!isNumeric(dateParts[0].trim()) || !isNumeric(dateParts[1].trim()) || !isNumeric(dateParts[2].trim())){
            return false;
        }

        if (day < 0 || day > 31){
            return false;
        }
        if (month < 1 || month > 12){
            return false;
        }
        if (year < 2000){
            return false;
        }

        return true;
    }
}


