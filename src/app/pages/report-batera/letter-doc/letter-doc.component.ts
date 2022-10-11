import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ngx-letter-doc',
  templateUrl: './letter-doc.component.html',
  styles: [
  ]
})
export class LetterDocComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<LetterDocComponent>,
  ) { }

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
  }
  ngOnInit(): void {
  }
  close(){this.dialogRef.close();}

}
