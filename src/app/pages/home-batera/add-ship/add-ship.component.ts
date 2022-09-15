import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { HomeService } from '../home-batera.service';

@Component({
  selector: 'ngx-add-ship',
  templateUrl: './add-ship.component.html',
})
export class AddShipComponent implements OnInit {

  file : any
  form : FormGroup
  constructor(private http: HttpClient, private homeservice: HomeService) { }

  getFile(event : any){
    this.file = event.target.files[0]

    console.log("file", this.file)
  }

  addShip(formValue : NgForm){
    console.log(formValue.value)
  }
  ngOnInit(): void {
  }

}
