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
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:09:19",
      "phases": [true, true, true]
    },
    {
      "vessel": "Batera Project3-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:08:19",
      "phases": [true, false, true]
    },
    {
      "vessel": "Batera Kapuas-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:07:19",
      "phases": [true, false, true]
    },
    {
      "vessel": "Batera Medan-1-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:06:19",
      "phases": [true, false, true]
    },
    {
      "vessel": "Batera Express-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:05:19",
      "phases": [true, false, true]
    },
    {
      "vessel": "Relance-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:04:19",
      "phases": [true, false, true]
    },
    {
      "vessel": "Batera Gorontalo-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:03:19",
      "phases": [true, false, true]
    }
]

  constructor() { }

  ngOnInit(): void {
  }

}
