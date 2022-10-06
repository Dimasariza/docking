import { Component, OnInit } from '@angular/core';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';


@Component({
  selector: 'ngx-pic',
  templateUrl: './pic.component.html',
})
export class PicComponent implements OnInit{
  constructor(
    private profileService : ProfileBateraService,
    ){
  }
  picData : any
  ngOnInit(): void {
    this.profileService.getUserData()
    .subscribe(({data} : any) => {
      this.picData = data
      console.log(data)
    })
  }
  
  // picData = [
  //   {
  //     "vessel": "Batera Batam-DD-2019",
  //     "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
  //     "customer": "Batera Line",
  //     "start": "15:09:19",
  //     "R": true,
  //     "P": true,
  //     "E": true
  //   },
  //   {
  //     "vessel": "Batera Project3-DD-2019",
  //     "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
  //     "customer": "Batera Line",
  //     "start": "15:08:19",
  //     "R": true,
  //     "P": true,
  //     "E": true
  //   },
  //   {
  //     "vessel": "Batera Kapuas-DD-2019",
  //     "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
  //     "customer": "Batera Line",
  //     "start": "15:07:19",
  //     "R": true,
  //     "P": true,
  //     "E": true
  //   },
  //   {
  //     "vessel": "Batera Medan-1-DD-2019",
  //     "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
  //     "customer": "Batera Line",
  //     "start": "15:06:19",
  //     "R": true,
  //     "P": true,
  //     "E": true
  //   },
  //   {
  //     "vessel": "Batera Express-DD-2019",
  //     "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
  //     "customer": "Batera Line",
  //     "start": "15:05:19",
  //     "R": true,
  //     "P": true,
  //     "E": true
  //   },
  //   {
  //     "vessel": "Relance-DD-2019",
  //     "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
  //     "customer": "Batera Line",
  //     "start": "15:04:19",
  //     "R": true,
  //     "P": true,
  //     "E": true
  //   },
  //   {
  //     "vessel": "Batera Gorontalo-DD-2019",
  //     "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
  //     "customer": "Batera Line",
  //     "start": "15:03:19",
  //     "R": true,
  //     "P": true,
  //     "E": true,
  //   }
  // ]
    

  useIcons = [
    {
    icon: 'refresh',
    desc: 'Refresh'
    },
    {
      icon: 'plus',
      desc: 'Add Phase'
    },
    {
      icon: 'list',
      desc: 'Add Activity'
    },
    {
      icon: 'flag-outline',
      desc: 'Add Milestone'
    },
    {
      icon: 'clock-outline',
      desc: 'Add Meeting'
    },
    {
      icon: 'checkmark-square',
      desc: 'Add Task'
    },
  ]
}

