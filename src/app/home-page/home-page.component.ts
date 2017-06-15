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

    public lineChartData: Array<any> = [];
    public lineChartMonthDaysLabels: Array<any> = [];

    public dailyData() {
        this.items.subscribe(snapshot => {
            let items = [];
            let i = 1;
            snapshot.forEach(item => {
                items.push(parseInt(item.glucoseValue));
                console.log(item.glucoseValue);
                console.log("deefjbe");
                this.lineChartMonthDaysLabels.push(i.toString())
                i++;
            });
            let data = {data: items, label: 'Glykémie'};
            this.lineChartData.push(data);
            this.dataLoaded = true;
        });
    }


    public lineChartOptions: any = {
        responsive: true
    };

    private dataLoaded: boolean;

    public lineChartColors: Array<any> = [
        {
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        {
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        {
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

    // generates random graph data
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


    private uid: String;
    private items: FirebaseListObservable<any[]>;
    private admin: Boolean = false;

    private errorMessage: String = "";

    constructor(public authService: AuthService, private router: Router, private angularFire: AngularFire) {
        this.authService.angularFire.auth.subscribe(
            (auth) => {
                if (auth == null) {
                    this.router.navigate(['login']);
                } else {
                    this.uid = auth.uid;
                    this.dataLoaded = false;
                    this.items = angularFire.database.list('/users/' + this.uid + "/items");
                    this.dailyData();
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

    ngOnInit() {

    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }

    changePin(newPin){
        if (!this.admin){
            this.errorMessage = "Nemáš admin práva, odhlás sa a prihlás sa pomocou PIN=u";
            return;
        }


        if (window.confirm('Prajete si skutocne zmenit admin PIN?')){
            console.log(newPin);
            let data = this.angularFire.database.object('users/' + this.uid);
            data.update({ admin_code : newPin });
        }
    }
}
