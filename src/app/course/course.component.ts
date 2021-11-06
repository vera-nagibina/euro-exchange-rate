import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  course: Observable<number> | undefined;
  date: Observable<Date> | undefined;
  
  constructor(private courseService: CourseService) { }

  ngOnInit(): void {

    this.course = this.courseService.getExchangRate();
  }

}
