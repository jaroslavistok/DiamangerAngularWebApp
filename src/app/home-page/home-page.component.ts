import {Component, OnInit} from '@angular/core';


import {Router} from '@angular/router';
import {AuthService} from '../providers/auth.service';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

    public lineChartData: Array<any> = [
        // {data: [65, 59, 80, 81, 56, 55, 40, 30, 40, 60, 40], label: 'Series A'},
        // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
        // {data: [18, 48, 45, 9, 10, 27, 40], label: 'Series C'}
    ];

    public lineChartMonthsLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    public lineChartMonthDaysLabels: Array<any> = [];


    public populateMonthDaysLabels() {
        for (let i = 1; i <= 10; i++){
            this.lineChartMonthDaysLabels.push(i.toString())
        }
    }


    public dailyData() {
        this.items.subscribe(snapshot => {
            var items = [];

            snapshot.forEach(item => {
                items.push(parseInt(item.glucoseValue));
            });

            var data = {data: items, label: 'Test 1'};
            this.lineChartData.push(data);

            this.dataLoaded = true;
            console.log("loading data");
        });
    }


    public lineChartOptions: any = {
        responsive: true
    };

    private dataLoaded: boolean;

    public lineChartColors: Array<any> = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';

    public randomize(): void {
        let _lineChartData: Array<any> = new Array(this.lineChartData.length);
        for (let i = 0; i < this.lineChartData.length; i++) {
            _lineChartData[i] = {
                data: new Array(this.lineChartData[i].data.length),
                label: this.lineChartData[i].label
            };
            for (let j = 0; j < this.lineChartData[i].data.length; j++) {
                _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
            }
        }
        this.lineChartData = _lineChartData;
    }

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    private uid: String;
    private items: FirebaseListObservable<any[]>;

    constructor(public authService: AuthService, private router: Router, private angularFire: AngularFire) {
        this.authService.angularFire.auth.subscribe(
            (auth) => {
                if (auth == null) {
                    this.router.navigate(['login']);
                } else {
                    this.uid = auth.uid;
                }
            }
        );


        this.items = angularFire.database.list('/users/' + this.uid + "/items");

        this.dataLoaded = false;

        this.populateMonthDaysLabels();
        this.dailyData();
    }

    ngOnInit() {
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }

}
