import { Component, Input, OnInit } from '@angular/core';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'ngx-pic',
  templateUrl: './pic.component.html',
})
export class PicComponent implements OnInit{
  constructor(
    private profileService : ProfileService,
    ){
  }
  @Input() picData : any
  ngOnInit(): void {
  }
}

