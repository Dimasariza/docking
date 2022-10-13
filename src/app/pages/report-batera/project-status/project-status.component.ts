import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



const PROGRESS_DATA = [
  {name: 'Critical', weight: 14.0067, symbol: 'N'},
  {name: 'High', weight: 15.9994, symbol: 'O'},
  {name: 'Medium', weight: 18.9984, symbol: 'F'},
  {name: 'Low', weight: 20.1797, symbol: 'Ne'},
  {name: 'Total', weight: 20.1797, symbol: 'Ne'},
];

const COMPLETION_DATA = [
  {name: 'OE-Supplies', weight: 14.0067, symbol: 'N'},
  {name: 'OE-Service', weight: 15.9994, symbol: 'O'},
  {name: 'OE-Class', weight: 18.9984, symbol: 'F'},
  {name: 'OE-Other', weight: 20.1797, symbol: 'Ne'},
  {name: 'OE-Cancelled', weight: 20.1797, symbol: 'Ne'},
  {name: 'YE-Cost', weight: 20.1797, symbol: 'Ne'},
  {name: 'YE-Cancelled', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'ngx-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss']
})
export class ProjectStatusComponent implements OnInit {
  constructor(
    public dialog : MatDialog,
    private dialogRef: MatDialogRef<ProjectStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  statusColumn: string[] = ['name', 'c_1', 'c_2', 'c_3', 'c_4', 'c_5' ,'c_6'];
  completionColumn : string[] = ['name', 'c_1', 'c_2', 'c_3', 'c_4'];

  progressData = PROGRESS_DATA
  completionData = COMPLETION_DATA
  ngOnInit(): void {
  }
  close(){ this.dialogRef.close();}

}
