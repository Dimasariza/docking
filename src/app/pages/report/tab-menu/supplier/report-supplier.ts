import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonFunction } from '../../../../component/common-function/common-function';
import { SupplierDialog } from './supplier-dialog/supplier-dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ReportService } from '../../report.service';
import { ToastrComponent } from '../../../../component/toastr-component/toastr.component';
import { DeleteDialogComponent } from '../../../../component/delete-dialog/delete-dialog.component';

@Component({
  selector: 'ngx-report-suplier',
  templateUrl: './report-supplier.html',
})
export class SupplierComponent implements OnDestroy {
  constructor(
    private commonFunction : CommonFunction,
    private reportService : ReportService,
    private toastr : ToastrComponent
  ) {}

  @Input() suplierData;
  @Output('refresh') refreshPage : EventEmitter<any> = new EventEmitter();
  private destroy$: Subject<void> = new Subject<void>();

  public supplierNavButton = [
    { name : 'Refresh', icon : 'refresh'},
    { name : 'Add Supplier', icon : 'plus-outline'},
  ]

  columns = [
    { name: 'No', type : 'index', width : 70 },
    { name: 'Name', type : 'text', prop : 'nama_supplier', width : 300 },
    { name: 'Address', type : 'text', prop : 'alamat', width : 200 },
    { name: 'Email', type : 'text', prop : 'email', width : 300 },
    { name: 'Contact Number', type : 'text', prop : 'no_hp', width : 300 },
    { name : '', type : 'button', width : 150, unSort : true,
      button :  [ 
          {icon : 'edit-outline', menu : 'Update Supplier', status : 'info'}, 
          {icon : 'trash-2-outline', menu : 'Delete Supplier', status : 'danger'},
      ], 
    },
  ];

  handleClickButton(button, data) {
    if(button == 'Add Supplier') this.addSuplier(button);
    if(button == 'Update Supplier') this.updateSupplier(button, data)
    if(button == 'Delete Supplier') this.deleteSupplier(button, data)
    if(button == 'Refresh') this.refreshPage.emit();
  }

  addSuplier(title) {
    this.commonFunction.openDialog({
        dialogData : { title },
        component : SupplierDialog
    })
    .onClose
    .pipe(takeUntil(this.destroy$))
    .subscribe(newData => newData != null
        ? this.onUploadData(title, newData)
        : null
    );
  }

  updateSupplier(title, data) {
    this.commonFunction.openDialog({
        dialogData : { title, data },
        component : SupplierDialog
    })
    .onClose
    .pipe(takeUntil(this.destroy$))
    .subscribe(newData => newData != null
        ? this.onUploadData(title, newData)
        : null
    );
  }

  deleteSupplier(title, data) {
    this.commonFunction.openDialog({
        dialogData : { title, 
          name : data.nama_supplier, 
          id : data.id_supplier
        },
        component : DeleteDialogComponent
    })
    .onClose
    .pipe(takeUntil(this.destroy$))
    .subscribe(newData => newData != null
        ? this.onUploadData(title, newData)
        : null
    );
  }

  onUploadData(title, data) {
    let subscribe;
    let successmsg;

    if(title == 'Add Supplier') {
      subscribe = this.reportService.addSuplier(data);
      successmsg = 'Supplier has been added.';
    }

    if(title == 'Update Supplier') {
      subscribe = this.reportService.updateSuplier(data)
      successmsg = 'Supplier has been updated.';
    }

    if(title == 'Delete Supplier') {
      subscribe = this.reportService.deleteSupplier(data);
      successmsg = 'Supplier has been deleted.';
    }
    
    subscribe
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => this.toastr.onUpload('Adding suplier data.'),
      () => this.toastr.onError(),
      () => {
        this.toastr.onSuccess(successmsg)
        this.refreshPage.emit();
      }
    )
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}