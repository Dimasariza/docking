import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectBateraService } from '../../project-batera/project-batera.service';
import { WorkAreaComponent } from '../../project-batera/work-area/work-area.component';

@Component({
  providers: [WorkAreaComponent],
  selector: 'ngx-update-load-details',
  templateUrl: '/update-load-details.component.html',
})
export class UpdateLoadDetailsComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<UpdateLoadDetailsComponent>,
    private addNewProject : WorkAreaComponent,
    private projectService : ProjectBateraService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  
  public unitType : any
  public work_area : any
  ngOnInit(): void {
    console.log(this.data)
    let jobId = this.data.job.id.toString().split("")
    let projectId = this.data.project
    jobId.length > 1 ? 
    this.unitType = this.addNewProject.unitType[1] :
    this.unitType = this.addNewProject.unitType[0]

    this.projectService.getSubProjectData(projectId)
    .subscribe(({data} : any) => {
      let {work_area} = data
      console.log(work_area)
      work_area === null ||
      work_area === "undefined" ? 
      null : this.work_area = work_area
      console.log(this.work_area)
    })
  }

  populateData = (work) => { 
    const {items, sfi, pekerjaan, start, end, departemen, volume, harga_satuan, kontrak, remarks, satuan, responsible, rank, id, kategori} = work           
    return {
      data: {
        "Job No": sfi,
        "Job": pekerjaan,
        "Dept": departemen,
        "Resp" : responsible,
        "Start": start,
        "Stop": end,
        "Vol" : volume,
        "Unit" : satuan,
        "Unit Price": harga_satuan,
        "Total Price Budget" : kontrak,
        "Category" : kategori,
        "Remarks" : remarks,
        "rank" : rank,
        "id" : id,
        "kind": items?.length ? 'dir' : 'doc'
      },
      children: items?.length ? items.map(child => this.populateData(child)) : []
    }
  }

  close(){this.dialogRef.close();}


}
