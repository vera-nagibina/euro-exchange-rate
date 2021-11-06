import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, concatMap, first, map, switchMapTo } from "rxjs/operators";
import { parseString } from "xml2js";
import { Observable, of, timer } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private exchange: number = 0;  
  
  constructor(private http: HttpClient) { }

  getExchangRate(): Observable<number>{
    return timer(10, 10000).pipe(
      switchMapTo(this.getData())
    )
  }

  getData(): Observable<number>{
    return of(
      this.getDataJson('https://www.cbr-xml-daily.ru/daily_json.js'),
      this.getDataXML('https://www.cbr-xml-daily.ru/daily_utf8.xml')      
      )
      .pipe(
        concatMap((source) => source.pipe(
          catchError(() => of(0))
        )),        
        first(source => source != 0)        
      )      
  }
  

  getResponse(source: number): Observable<number>{
    return of(source)
  }

  getDataJson(url:string){
    return this.http.get(url).pipe(map(response => this.deserialize(response)));
  }
  deserialize(data: any) {
    this.exchange = data.Valute.EUR.Value;
    return this.exchange;
  }

  getDataXML(url:string): Observable<number>{
    return this.http.get(url, { responseType: 'text' })
    .pipe(map(response => this.parse(response)));
  }

  parse(response: any): number{
    parseString(response, (error, result) => {
      result.ValCurs.Valute.forEach(((element: { CharCode: string[]; Value: number[]; }) => {
        if (element.CharCode[0] === 'EUR') {
          this.exchange = element.Value[0];
        }        
      }));
    });
    return this.exchange;
  }

}


