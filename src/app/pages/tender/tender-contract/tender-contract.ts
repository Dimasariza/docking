import { Component, ElementRef, EventEmitter, Injector, Input, Output, ViewChild } from "@angular/core";
import { YardDialogComponent } from "./yard-dialog/yard-dialog.component";
import { DeleteDialogComponent } from "../../../component/delete-dialog/delete-dialog.component";
import { YardDetailsDialog } from "./yard-details-dialog/yard-details-dialog.component";
import { ReportService } from "../../report/report.service";
import { HttpEventType } from "@angular/common/http";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TenderService } from "../tender.service";
import { CheckFile } from "../../../component/common-function/onUploadFile";
import { PageBaseComponent } from "../../../@base/page-base.component";

@Component({
    selector: 'ngx-tender-contract',
    templateUrl: './tender-contract.html',
})

export class TenderContract extends PageBaseComponent { 
    constructor(
      injector: Injector,
      private reportService : ReportService,
      private tenderService : TenderService,
      private checkFile : CheckFile
    ) {
      super(injector);
    }
    
    @Input() projectData : any;
    @Input() tenderData : any;
    @Input() projectSummary : any;
    @Output("sendLoadDetails") sendDataLoadDetials : EventEmitter<any> = new EventEmitter();
    @Output("refresh") refreshPage: EventEmitter<any> = new EventEmitter();
    @ViewChild('uploadContract', { static: false }) uploadContract : ElementRef;

    addNewContract :any = {};
    
    ngOnInit(): void {
      this.addNewContract = {};
      if(this.user.role == 'shipyard') this.sendDataLoadDetials.emit(this.projectSummary[0])
    }

    addYardDialog() {
      const title = 'Add Yard';
      this.commonFucntion.openDialog({
        dialogData : { title },
        component : YardDialogComponent 
      })
      .onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(newData => this.onUploadData(title, newData));
    }

    updateYardDialog(data) {
      const title = 'Update Yard';
      this.commonFucntion.openDialog({
        dialogData : {
          title, data,
        },
        component : YardDialogComponent 
      })
      .onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(newData => this.onUploadData(title, newData));
    }

    deleteYardDialog(data) {
      const title = 'Delete Yard'
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

    showYardDetails(data) {
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

    selectNewContract() {
      const {project : {id_proyek, work_area}, yard : {nama_galangan, id_tender}} = this.addNewContract;
      if(!this.commonFucntion.arrayNotEmpty(work_area))
      return this.toastr.onWarning({
        warnmsg : 'Your work job is empty. Please fill work job area.',
        duration : 3000
      })
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
      .subscribe(newData => newData != null 
        ? this.updateMatchingWorkArea({work_area, id_tender, id_proyek}) 
        : null
      );
    }

    updateMatchingWorkArea({work_area, id_tender, id_proyek}) {
      this.tenderService.updateContractWorkArea({work_area}, id_tender)
      .subscribe(
        () => this.toastr.onSuccess('Your work area has been updated.'),
        () => onerror('Update contract work area failed.'),
        () => this.onUploadData('Select New Contract', {id_tender, id_proyek})
      )
    }

    unselectYard(data) {
      const title = 'Unselect Yard'
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
      .subscribe(newData => newData != null 
        ? this.onUploadData(title, data) 
        : null );
    }

    showContract(data) {
      const {yard : {id_attachment}} = data || {};
      if(!id_attachment) {
        this.uploadContract.nativeElement.click()
        return this.toastr.onInfo({infomsg :'Your document not found! Please Add your document.'})
      }
      this.reportService.getAttachment(id_attachment)
      .subscribe(data => {
        const file = new Blob([data], { type: 'application/pdf' });            
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
    }

    onUploadData(title, data) {
      if(!data) return;
      let subscribe;
      let successMsg;
      let errorMsg = 'Please try again.';

      if(title == 'Add Yard') {
        data.id_attachment = "";
        subscribe = this.tenderService.addNewYard(data);
        successMsg = 'Your yard has been added.';
      }

      if(title == 'Update Yard') {
        const {id_attachment} = data;
        data.id_attachment = id_attachment ? id_attachment : "";
        subscribe = this.tenderService.updateYard(data, data.id_tender);
        successMsg = 'Your yard has been updated';
      }

      if(title == 'Delete Yard') {
        subscribe = this.tenderService.deleteYard(data);
        successMsg = 'Your Yard has been deleted';
      }

      if(title == 'Select New Contract') {
        const { id_tender, id_proyek } = data;
        this.addNewContract = {}
        subscribe = this.tenderService.selectTender(id_proyek, id_tender);
        successMsg = 'Your contract has been added.';
      }

      if(title == 'Unselect Yard') {
        const {id_tender, yard} = data;
        yard.id_attachment = "";
        subscribe = this.tenderService.unselectTender(id_tender);
        this.onUploadData('Update Yard', yard)
        successMsg = 'Your contract has been unselect';
      }
      
      subscribe
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => this.toastr.onUpload(),
        () => this.toastr.onError(errorMsg),
        () => {
          if(this.addNewContract.yard && this.addNewContract.project) return;
          this.toastr.onSuccess(successMsg);
          this.refreshPage.emit();
          this.ngOnInit();
        }
      );
    }

    onFileChange(res) {
      if(!res) return;
      const formData = this.checkFile.extension(res, 'read file');
      if(!formData) return;
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
          this.onUploadData('Update Yard', data)
        }
      })
    }

    private destroy$: Subject<void> = new Subject<void>();
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}