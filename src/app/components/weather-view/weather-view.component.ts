import { Component, OnInit } from '@angular/core';
import { WeatherService } from '@core/services/weather.service';

@Component({
  selector: 'app-weather-view',
  templateUrl: './weather-view.component.html',
  styleUrls: ['./weather-view.component.css']
})
export class WeatherViewComponent implements OnInit {

  //Accuweather
  weatherData: any;
  weatherIconURL: string;
  isWeather: boolean = false;
  error : string = '';

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getWeatherData();
  }

  async getWeatherData() {
    await this.weatherService.getWeather().then(values => {
      this.weatherData = values;
      var icon = this.weatherData.weather[0].icon;
      this.weatherIconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      this.isWeather = true;
    }).catch(err => {
      this.isWeather = false;
      this.error = 'No hay datos en la zona'
    });
    
  }

}
