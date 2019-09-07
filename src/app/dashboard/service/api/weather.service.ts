/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrentDailyWeather } from '../../../_model/current-daily-weather';
import { CONFIG } from '../../../../constants/config';
import { Observable } from 'rxjs';
import { ForecastDailyWeather } from '../../../_model/forecast-daily-weather';
import { ForecastHourlyWeather } from '../../../_model/forecast-hourly-weather';
import { CurrentHourlyWeather } from '../../../_model/current-hourly-weather';
import { map } from 'rxjs-compat/operator/map';
import { UnitService } from '../unit.service';
import { WEATHER } from '../../melli-charts/charts/icons/icons_weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private unitSystem: string;
  constructor(private httpClient: HttpClient, private unitService: UnitService) { }


  /**
   *
   *
   * @param {string} unit
   * @memberof WeatherService
   */
  setUnitSystem(unit: string): void {
    this.unitSystem = unit;
  }
  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<CurrentDailyWeather[]>}
   * @memberof WeatherService
   */
  public getCurrentDailyWeather(idApiary: string, range: Date[]): Observable<CurrentDailyWeather[]> {
    return this.httpClient.post<CurrentDailyWeather[]>(CONFIG.URL + 'dailyWeather/apiary/' + idApiary, range);
  }

  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<ForecastDailyWeather[]>}
   * @memberof WeatherService
   */
  public getForecastDailyWeather(idApiary: string, range: Date[]): Observable<ForecastDailyWeather[]> {
    return this.httpClient.post<ForecastDailyWeather[]>(CONFIG.URL + 'forecastDailyWeather/apiary/' + idApiary, range);
  }

  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<ForecastHourlyWeather[]>}
   * @memberof WeatherService
   */
  public getTempForecastHourlyWeather(idApiary: string, range: Date[]): Observable<any[]> {
    return this.httpClient.post<any[]>(CONFIG.URL + 'forecastHourlyWeather/temp/apiary/' + idApiary, range).map(_elt => _elt.map(_value => {
      return { date: _value.date, value: this.unitService.convertTempFromUsePref(_value.value, this.unitSystem), sensorRef: _value.sensorRef };
    }));
  }

  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<CurrentHourlyWeather[]>}
   * @memberof WeatherService
   */
  public getTempCurrentHourlyWeather(idApiary: string, range: Date[]): Observable<any[]> {
    return this.httpClient.post<any[]>(CONFIG.URL + 'hourlyWeather/temp/apiary/' + idApiary, range).map(_elt => _elt.map(_value => {
      return { date: _value.date, value: this.unitService.convertTempFromUsePref(_value.value, this.unitSystem), sensorRef: _value.sensorRef };
    }));
  }


  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<CurrentHourlyWeather[]>}
   * @memberof WeatherService
   */
  public getRainCurrentDailyWeather(idApiary: string, range: Date[]): Observable<any[]> {
    return this.httpClient.post<any[]>(CONFIG.URL + 'dailyWeather/rain/apiary/' + idApiary, range);
  }


  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<ForecastHourlyWeather[]>}
   * @memberof WeatherService
   */
  public getRainForecastDailyWeather(idApiary: string, range: Date[]): Observable<any[]> {
    return this.httpClient.post<any[]>(CONFIG.URL + 'forecastDailyWeather/rain/apiary/' + idApiary, range);/* .map(_elt => _elt.map(_value => {
      return { date: _value.date, value: this.unitService.convertMilimetreToPouce(_value.value.rainDay, this.unitSystem), sensorRef: _value.sensorRef };
    })); */
  }


  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof WeatherService
   */
  public getTempExtForecastDailyWeather(idApiary: string, range: Date[]): Observable<any> {
    return this.httpClient.post<any>(CONFIG.URL + 'forecastDailyWeather/tExt/apiary/' + idApiary, range);
  }


  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<any[][]>}
   * @memberof WeatherService
   */
  public getAllTempWeather(idApiary: string, range: Date[]): Observable<any[][]> {
    return Observable.forkJoin([
      this.getTempExtCurrentDailyWeather(idApiary, range),
      this.getTempExtForecastDailyWeather(idApiary, range)
    ]);
  }


  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof WeatherService
   */
  public getWindCurrentDailyWeather(idApiary: string, range: Date[]): Observable<any> {
    return this.httpClient.post<any>(CONFIG.URL + 'dailyWeather/wind/apiary/' + idApiary, range);
  }


  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof WeatherService
   */
  public getWindForecastDailyWeather(idApiary: string, range: Date[]): Observable<any> {
    return this.httpClient.post<any>(CONFIG.URL + 'dailyWeather/wind/apiary/' + idApiary, range);
  }


  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof WeatherService
   */
  public getTempExtCurrentDailyWeather(idApiary: string, range: Date[]): Observable<any> {
    return this.httpClient.post<any>(CONFIG.URL + 'dailyWeather/tExt/apiary/' + idApiary, range);
  }


  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<any[][]>}
   * @memberof WeatherService
   */
  public getWindAllWeather(idApiary: string, range: Date[]): Observable<any[][]> {
    return Observable.forkJoin([
      this.getWindCurrentDailyWeather(idApiary, range),
      this.getWindForecastDailyWeather(idApiary, range)
    ]);
  }


  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<any[][]>}
   * @memberof WeatherService
   */
  public getRainAllWeather(idApiary: string, range: Date[]): Observable<any[][]> {
    return Observable.forkJoin([
      this.getRainCurrentDailyWeather(idApiary, range),
      this.getRainForecastDailyWeather(idApiary, range)
    ]);
  }



  getPicto(nomPicto: string, cellPoint: Array<number>): Array<any> {
    return WEATHER[nomPicto].map(_path => {
      return {
        type: 'path',
        scale: _path.scale,
        shape: {
          pathData: _path.path,
        },
        position: [cellPoint[0] + _path.position[0], cellPoint[1] + _path.position[1]],
        style: _path.style
      };
    });
  }


  /**
   *
   *
   * @param {string} enLabel
   * @param {string} lang
   * @returns {string}
   * @memberof WeatherService
   */
  getTranslateDescriptionMainDay(enLabel: string, lang: string): string {
    if (lang !== 'FR') {
      return enLabel;
    } else {
      switch (enLabel) {
        case 'Clear':
          return 'Ensoleillé';
        case 'Few clouds':
          return 'Eclaircies';
        case 'Scattered clouds':
          return 'Couvert';
        case 'Shower rain':
          return 'Averses';
        case 'Broken clouds':
          return 'Très nuageux';
        case 'Shower':
          return 'Averses';
        case 'Rain':
          return 'Pluie';
        case 'Thunderstorm':
          return 'Orages';
        case 'Snow':
          return 'Neige';
        case 'Mist/Gust':
          return 'Brouillard';
        case 'Clouds':
          return 'Nuageux';
        default:
          return '';
      }
    }
  }

  /*Clear sky : Ensoleillé
Few clouds : Eclaircies
Scattered clouds : Couvert
Broken clouds : Très nuageux
Shower rain : Averses
Rain : Pluie
Thunderstorm : Orages
Snow : Neige
Mist/Gust : Brouillard*/
}