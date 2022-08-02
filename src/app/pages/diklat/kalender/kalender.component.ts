import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';

@Component({
  selector: 'ngx-kalender',
  templateUrl: './kalender.component.html',
  styleUrls: ['./kalender.component.scss']
})
export class KalenderComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth'
  };

  data = [
    {
      "name": "Ethel Price",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Claudine Neal",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Beryl Rice",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Wilder Gonzales",
      "time": "10 Juni 2022 - 22 Juni 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Georgina Schultz",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Carroll Buchanan",
      "time": "10 Juni 2022 - 22 Juni 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Valarie Atkinson",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
