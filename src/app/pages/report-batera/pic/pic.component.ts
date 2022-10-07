import { Component, Input, OnInit } from '@angular/core';
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
    })
  }
  
  @Input() worksData : any = ""

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

