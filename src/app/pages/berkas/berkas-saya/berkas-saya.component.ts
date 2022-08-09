import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BerkasSayaService } from './berkas-saya.service';

@Component({
  selector: 'ngx-berkas-saya',
  templateUrl: './berkas-saya.component.html',
  styleUrls: ['./berkas-saya.component.scss']
})
export class BerkasSayaComponent implements OnInit {

// Variable to store shortLink from api response
shortLink: string = "";
loading: boolean = false; // Flag variable
file: File = null; // Variable to store file  

constructor(private berkasUploadService: BerkasSayaService, private elementRef: ElementRef) { }

ngOnInit(): void {
}
@ViewChild('tes') tes:ElementRef
@ViewChild('cobaFiles') cobaFiles:ElementRef
// On file Select
onChange(event) {
  this.file = event.target.files[0];
}

// OnClick of button Upload
onUpload() {
  
  this.loading = !this.loading;
  const coba = document.querySelector('.coba');
  console.log(this.cobaFiles)
  // create new file
  const myFiles = this.elementRef.nativeElement.querySelector('.my-files');
  myFiles.insertAdjacentHTML('beforeend', '<div class="col-3">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, rerum?</div>')

  // const newCard = this.elementRef.nativeElement.create('div');
  // newCard.setAttribute('accent', 'info');


  // console.log(tes.value)
  console.log(this.file);
  this.berkasUploadService.upload(this.file).subscribe(
      (event: any) => {
          if (typeof (event) === 'object') {

              // Short link via api response
              this.shortLink = event.link;
              console.log(this.shortLink)

              this.loading = false; // Flag variable 
          }
      }
  );
}
}
