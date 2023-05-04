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
  @Input() picData : any
  ngOnInit(): void {
  }
}

