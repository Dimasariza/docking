import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CommonFunction, ReplaceData } from "../../../component/common-function/common-function";
import { YardDialogComponent } from "./yard-dialog/yard-dialog.component";
import { DeleteDialogComponent } from "../../../component/delete-dialog/delete-dialog.component";
import { YardDetailsDialog } from "./yard-details-dialog/yard-details-dialog.component";
import { ReportService } from "../../report/report.service";
import { HttpEventType } from "@angular/common/http";
import { ToastrComponent } from "../../../component/toastr-component/toastr.component";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TenderService } from "../tender.service";
import { CheckFile } from "../../../component/common-function/onUploadFile";

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
      private replace : ReplaceData,
      private checkFile : CheckFile
    ) {}
    
    @Input() projectData : any;
    @Input() tenderData : any;
    @Input() projectSummary : any;
    @Output("sendLoadDetails") sendDataLoadDetials : EventEmitter<any> = new EventEmitter();
    @Output("refresh") refreshPage: EventEmitter<any> = new EventEmitter();
    @ViewChild('uploadContract', { static: false }) uploadContract : ElementRef;

    addNewContract :any = {};
    activeYard : any = {};
    
    ngOnInit(): void {
      this.addNewContract = {};
    }

    mouseHover(title, index = 0, conds) {
      if(title == 'projectTitle') this.projectData[index].hover = conds;
      if(title == 'nama_galangan') this.tenderData[index].hover = conds;
      if(title == 'activeContract') this.projectSummary[index].hover = conds;
    }
    
    handleClickButton(title, data = null) {
      this.activeYard = data?.yard;
      if(title == 'Show Contract') 
      return this.showContract(data);

      if(title == 'Generate Table Data') 
      return this.sendDataLoadDetials.emit(data);

      if(title == 'Show Yard Details') 
      return this.showYardDetails(title, data);
      
      const {role} =  JSON.parse(localStorage.getItem('user'));
      let warnmsg = "You have no access to do this request."
      if(role == 'shipyard') return this.toastr.onWarning({warnmsg}) 

      if(title == 'Add Yard') 
      this.addYardDialog(title);
      
      if(title == 'Update Yard') 
      this.upudateYardDialog(title, data);
      
      if(title == 'Delete Yard') 
      this.deleteYardDialog(title, data);

      if(title == 'Select New Contract') 
      this.selectNewContract(title);
      
      if(title == 'Unselect Yard') 
      this.unselectYard(title, data);

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
      const {project : {id_proyek, work_area}, yard : {nama_galangan, id_tender}} = this.addNewContract;
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
      work_area = this.replace.deleteKey(work_area, 'end')
      work_area = this.replace.deleteKey(work_area, 'start')
      this.tenderService.updateContractWorkArea({work_area}, id_tender)
      .subscribe(
        () => this.toastr.onSuccess('Your work area has been updated.'),
        () => onerror(''),
        () => this.onUploadData('Select New Contract', {id_tender, id_proyek})
      )
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
      .subscribe(newData => newData != null ? this.onUploadData(title, data) : null );
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
          const data = {...this.activeYard, id_attachment}
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