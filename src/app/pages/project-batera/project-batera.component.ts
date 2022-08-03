import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-project-batera',
  templateUrl: './project-batera.component.html',
  styleUrls: ['./project-batera.component.scss']
})
export class ProjectBateraComponent implements OnInit {
  data = [
    {
      "vessel": "Batera Batam-DD-2019",
      "customer": "Batera Line",
      "start": "15:09:19"
    },
    {
      "vessel": "Batera Project3-DD-2019",
      "customer": "Batera Line",
      "start": "15:08:19"
    },
    {
      "vessel": "Batera Kapuas-DD-2019",
      "customer": "Batera Line",
      "start": "15:07:19"
    },
    {
      "vessel": "Batera Medan-1-DD-2019",
      "customer": "Batera Line",
      "start": "15:06:19"
    },
    {
      "vessel": "Batera Express-DD-2019",
      "customer": "Batera Line",
      "start": "15:05:19"
    },
    {
      "vessel": "Relance-DD-2019",
      "customer": "Batera Line",
      "start": "15:04:19"
    },
    {
      "vessel": "Batera Gorontalo-DD-2019",
      "customer": "Batera Line",
      "start": "15:03:19"
    }
]

  constructor() { }

  ngOnInit(): void {
  }

}
