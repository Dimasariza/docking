import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-project-batera',
  templateUrl: './project-batera.component.html',
  styleUrls: ['./project-batera.component.scss']
})
export class ProjectBateraComponent implements OnInit {
  data = [
    {
      "vessel": "Meratus Batam-DD-2019",
      "customer": "Meratus Line",
      "start": "15:09:19"
    },
    {
      "vessel": "Meratus Project3-DD-2019",
      "customer": "Meratus Line",
      "start": "15:08:19"
    },
    {
      "vessel": "Meratus Kapuas-DD-2019",
      "customer": "Meratus Line",
      "start": "15:07:19"
    },
    {
      "vessel": "Meratus Medan-1-DD-2019",
      "customer": "Meratus Line",
      "start": "15:06:19"
    },
    {
      "vessel": "Meratus Express-DD-2019",
      "customer": "Meratus Line",
      "start": "15:05:19"
    },
    {
      "vessel": "Relance-DD-2019",
      "customer": "Meratus Line",
      "start": "15:04:19"
    },
    {
      "vessel": "Meratus Gorontalo-DD-2019",
      "customer": "Meratus Line",
      "start": "15:03:19"
    }
]

  constructor() { }

  ngOnInit(): void {
  }

}
