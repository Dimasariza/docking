import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit {

  formTitle = [
    {
      "title": "General Information"
    },
    {
      "title": "Password"
    }
  ]

  form = [
    {
      "label": "Username",
      "placeholder": "Masukkan username"
    },
    {
      "label": "Email",
      "placeholder": "Masukkan email"
    },
    {
      "label": "Role",
      "placeholder": "Pilih role"
    },
    {
      "label": "Status",
      "placeholder": "Pilih Status"
    },
    {
      "label": "Password",
      "placeholder": "Masukkan password"
    },
    {
      "label": "Konfirmasi Password",
      "placeholder": "Masukkan konfirmasi password"
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
