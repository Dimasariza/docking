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
    this.profileService.getUserData(1, 10, '', '', '')
    .subscribe(({data} : any) => {
      this.picData = data
    })
  }
  
  @Input() worksData : any = ""

}

