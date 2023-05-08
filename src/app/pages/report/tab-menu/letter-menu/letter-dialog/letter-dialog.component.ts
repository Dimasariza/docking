import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ReportService } from '../../../report.service';
import { NbDialogRef } from '@nebular/theme';
import { ToastrComponent } from '../../../../../component/toastr-component/toastr.component';
import { CommonFunction } from '../../../../../component/common-function/common-function';
import { CheckFile } from '../../../../../component/common-function/onUploadFile';

@Component({
  selector: 'ngx-letter-dialog',
  templateUrl: './letter-dialog.component.html',
})
export class LetterDialogComponent implements OnDestroy {
  constructor(
    private reportService : ReportService,
    private dialog : NbDialogRef<any>,
    private checkFile : CheckFile,
    private toastr : ToastrComponent,
    private commonFunction : CommonFunction
  ) { }

  private destroy$: Subject<void> = new Subject<void>();
  @ViewChild('addFromFile', {static : false}) inputFile : ElementRef;
  @Input() dialogData;

  openFileFolder() {
    this.inputFile.nativeElement.click();
  }

  public attachmentId : any = '';
  public loading : any 
  onFileChange(res){
    if(!res) return;
    const formData = this.checkFile.writeFile(res);
    if(!formData) return;
    this.reportService.addAttachment(formData)
    .subscribe((res) => {
      if ( res.type === HttpEventType.UploadProgress ) {
        this.loading = Math.round(res.loaded / res.total ) * 100;
      } else if ( res.type === HttpEventType.Response ){
        const upload : any = res;
        const { nama_attachment, id_attachment } = upload.body.data;
        this.attachmentId = id_attachment;
        this.toastr.onSuccess(`Your file ${nama_attachment} has been added.`)
        this.loading = 100;
      }
    })
  }

  closeDialog(arr = null) {
    if(!arr) return this.dialog.close();
    const { id_attachment = this.attachmentId, type = this.dialogData.data, tgl } = arr;
    arr = { ...arr, id_attachment, type, tgl : this.commonFunction.transformDate(tgl) }
    this.dialog.close(arr)
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
