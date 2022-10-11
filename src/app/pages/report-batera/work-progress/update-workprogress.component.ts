import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProjectBateraService } from '../../project-batera/project-batera.service';

@Component({
  selector: 'ngx-update-workprogress',
  templateUrl: './update-workprogress.component.html',
  styles: [
  ]
})
export class UpdateWorkprogressComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<UpdateWorkprogressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectSerivce : ProjectBateraService,
    public activatedRoute : ActivatedRoute,
  ) { }

  totalPriceBudget = 0

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.projectSerivce.getDataProjects()
    .subscribe(res => console.log(res))
    console.log(this.data)
  }

  updateWorkAreaData = (data, parentIndex, newData) => {
    return data.map((w, i) => {
      if (parentIndex.length > 1 && i == parentIndex[0]) {
        parentIndex = parentIndex.slice(1)
        return {...w, items: this.updateWorkAreaData(w.items, parentIndex, newData)}
      } else if(i == parentIndex[0]) {
        let item
        console.log(i)
        w?.items ? item = w.items : item = null
        return {...w, ...newData, items : item}
      }
      console.log(w)
      return w
    })
  }

  updateWorkProgress(newData){
    let currentData = newData.data.id
    let parentIndex = currentData.id.toString().split('')
    // let postBody = this.updateWorkAreaData(this.allData, parentIndex, newData.value)
    // this.submit(postBody)
  }

  submit(work_area) {
    this.projectSerivce.addProjectJob({work_area}, this.data.id_proyek)
    .subscribe(() => {
      // this.onSuccess.emit()
      this.close()
    })
  }

  close(){ this.dialogRef.close();}


}
