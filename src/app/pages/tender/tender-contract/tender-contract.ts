import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CommonFunction } from "../../../component/common-function/common-function";
import { YardDialogComponent } from "./yard-dialog/yard-dialog.component";
import { DeleteDialogComponent } from "../../../component/delete-dialog/delete-dialog.component";
import { YardDetailsDialog } from "./yard-details-dialog/yard-details-dialog.component";
import { ReportService } from "../../report/report.service";
import { HttpEventType } from "@angular/common/http";
import { ToastrComponent } from "../../../component/toastr-component/toastr.component";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TenderService } from "../tender.service";

@Component({
    selector: 'ngx-tender-contract',
    templateUrl: './tender-contract.html',
})

export class TenderContract implements OnInit { 
    constructor(
      private commonFucntion : CommonFunction,
      private reportService : ReportService,
      private toastr : ToastrComponent,
      private tenderService : TenderService,
    ) {}
    
    @Input() projectData : any;
    @Input() tenderData : any;
    @Input() projectSummary : any;
    @Output("sendLoadDetails") sendDataLoadDetials : EventEmitter<any> = new EventEmitter();
    @Output("refresh") refreshPage: EventEmitter<any> = new EventEmitter();
    @ViewChild('uploadContract', { static: false }) uploadContract : ElementRef;

    addNewContract :any = {};
    
    ngOnInit(): void {
      this.addNewContract = {};
    }

    mouseHover(title, index = 0, conds) {
      if(title == 'projectTitle') this.projectData[index].hover = conds;
      if(title == 'nama_galangan') this.tenderData[index].hover = conds;
      if(title == 'activeContract') this.projectSummary[index].hover = conds;
    }
    
    handleClickButton(title, data = null) {
      if(title == 'Add Yard') 
      this.addYardDialog(title);
      
      if(title == 'Update Yard') 
      this.upudateYardDialog(title, data);
      
      if(title == 'Delete Yard') 
      this.deleteYardDialog(title, data);

      if(title == 'Show Yard Details') 
      this.showYardDetails(title, data);

      if(title == 'Select New Contract') 
      this.selectNewContract(title);
      
      if(title == 'Unselect Yard') 
      this.unselectYard(title, data);

      if(title == 'Show Contract') 
      this.showContract(data);

      if(title == 'Generate Table Data') 
      this.sendDataLoadDetials.emit(data)

      if(title == 'Select Project') 
      this.addNewContract.project = data;

      if(title == 'Select Yard') 
      this.addNewContract.yard = data;
      
      if(title == 'Cancelled Select Yard') 
      this.addNewContract = {};

      if(title == 'Add Contract Document') 
      this.uploadContract.nativeElement.click()
    }

    addYardDialog(title) {
      this.commonFucntion.openDialog({
        dialogData : { title },
        component : YardDialogComponent 
      })
      .onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(newData => this.onUploadData(title, newData));
    }

    upudateYardDialog(title, data) {
      this.commonFucntion.openDialog({
        dialogData : {
          title,
          data,
        },
        component : YardDialogComponent 
      })
      .onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(newData => this.onUploadData(title, newData));
    }

    deleteYardDialog(title, data) {
      this.commonFucntion.openDialog({
        dialogData : {
          title,
          name : data.nama_galangan,
          id : data.id_tender
        },
        component : DeleteDialogComponent 
      })
      .onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(newData => this.onUploadData(title, newData));
    }

    showYardDetails(title, data) {
      this.commonFucntion.openDialog({
        dialogData : {
          title : data.nama_galangan,
          data,
        },
        component : YardDetailsDialog 
      })
      .onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => null);
    }

    selectNewContract(title) {
      const {project : {id_proyek}, yard : {nama_galangan, id_tender}} = this.addNewContract;
      this.commonFucntion.openDialog({
        dialogData : {
          title : 'Add New Contract',
          name : nama_galangan,
          id : { id_tender, id_proyek } 
        },
        component : DeleteDialogComponent 
      })
      .onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(newData => this.onUploadData(title, newData));
    }

    unselectYard(title, data) {
      this.commonFucntion.openDialog({
        dialogData : {
          title : 'Unselect Yard',
          name : data.nama_galangan,
          id : data.id_tender
        },
        component : DeleteDialogComponent 
      })
      .onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(newData => this.onUploadData(title, newData));
    }

    onUploadData(title, data) {
      if(!data) return;
      let subscribe;
      let successMsg;
      let errorMsg = 'Please try again.';

      if(title == 'Add Yard') {
        data.id_attachment = ""
        subscribe = this.tenderService.addNewYard(data);
        successMsg = 'Your yard has been added.';
      }

      if(title == 'Update Yard') {
        data.id_attachment = ""
        subscribe = this.tenderService.updateYard(data, data.id_tender);
        successMsg = 'Your yard has been updated';
      }

      if(title == 'Delete Yard') {
        subscribe = this.tenderService.deleteYard(data);
        successMsg = 'Your Yard has been deleted';
      }

      if(title == 'Select New Contract') {
        subscribe = this.tenderService.selectTender(data.id_proyek, data.id_tender);
        successMsg = 'Your contract has been added.';
      }

      if(title == 'Unselect Yard') {
        subscribe = this.tenderService.unselectTender(data);
        successMsg = 'Your contract has been unselect';
      }
      
      subscribe
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => this.toastr.onUpload(),
        () => this.toastr.onError(errorMsg),
        () => {
          this.toastr.onSuccess(successMsg);
          this.refreshPage.emit();
          this.ngOnInit();
        }
      );
    }

    showContract(data) {
      console.log(this.projectSummary)
      const {yard : {id_attachment}} = data;
      if(!id_attachment) {
        this.uploadContract.nativeElement.click()
        return this.toastr.onInfo('Your document not found! Please Add your document.')
      }
      this.reportService.getAttachment(id_attachment)
      .subscribe(data => {
        const file = new Blob([data], { type: 'application/pdf' });            
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
    }

    onFileChange(res){
      const formData = new FormData();
      const file = res.target?.files[0];
      formData.append('dokumen', file);
      this.reportService.addAttachment(formData)
      .subscribe(res => {
        let progress;
        if (res.type === HttpEventType.UploadProgress) {
          progress = Math.round(res.loaded / res.total ) * 100;
          this.toastr.onUpload(`Upload Your File ${progress} %`)
        } else if ( res.type === HttpEventType.Response){
          this.toastr.onSuccess('Your file has been uploaded.')
          const result : any = res;
          const {id_attachment} = result.body.data;
          const data = {...this.addNewContract.yard, id_attachment}
          // this.onUploadData(data, 'Update Yard')
        }
      })
    }
    private destroy$: Subject<void> = new Subject<void>();
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

}