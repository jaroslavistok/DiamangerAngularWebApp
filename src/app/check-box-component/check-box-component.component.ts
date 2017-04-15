import {Component, Input, OnInit} from '@angular/core';
import {ViewCell} from "ng2-smart-table";

@Component({
  selector: 'app-check-box-component',
  templateUrl: './check-box-component.component.html',
  styleUrls: ['./check-box-component.component.css']
})
export class CheckBoxComponentComponent implements ViewCell, OnInit {

  constructor() { }
    renderValue: boolean;

    @Input() value: string | number;

    ngOnInit() {

        if (this.value.toString() == "true"){
            this.renderValue = true;
        } else if (this.value.toString() == "false"){
            this.renderValue = false;
        } else {
            this.renderValue = false;
        }

        // this.renderValue = this.value.toString().toUpperCase();
    }

}
