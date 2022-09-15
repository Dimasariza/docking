import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProfileBateraService } from './profil-batera.service';

@Component({
  selector: 'ngx-profil-batera',
  templateUrl: './profil-batera.component.html',
  styleUrls: ['./profil-batera.component.scss']
})
export class ProfilBateraComponent implements OnInit {

  posts:any;
  data : any
  constructor(private service:ProfileBateraService, 
    private http: HttpClient
    ) {}
  
  ngOnInit() :void {
    this.service.getPosts()
      .subscribe(response => {
        this.data = response;
        this.data = this.data.data
    }); 
  }
}
