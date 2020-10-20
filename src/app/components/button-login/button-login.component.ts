import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-login',
  templateUrl: './button-login.component.html',
  styleUrls: ['./button-login.component.css']
})
export class ButtonLoginComponent implements OnInit {

  @Output() passData : EventEmitter<boolean> = new EventEmitter<boolean>();
  viewButton : boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  changeLog(){
    this.viewButton = !this.viewButton;
    this.passData.emit(this.viewButton);
  }

}
