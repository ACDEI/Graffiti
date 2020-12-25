import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  name:string;
  level: number;
  progress: number[];

  constructor() {
    this.name = "MADIVA"
    this.level = 30
    this.progress = [15,1000]
  }

  ngOnInit(): void {
  }

}
