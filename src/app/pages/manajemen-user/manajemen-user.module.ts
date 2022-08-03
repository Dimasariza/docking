import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManajemenUserComponent } from './manajemen-user.component';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { IndexComponent } from './index/index.component';
import { AddDataComponent } from './add-data/add-data.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',
    component: ManajemenUserComponent,
    children: [
      {
        path: 'index',
        component: IndexComponent
      },
      {
        path: 'add-data',
        component: AddDataComponent
      },
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
      }
    ] 
  }
];

@NgModule({
  declarations: [
    ManajemenUserComponent,
    IndexComponent,
    AddDataComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NgxDatatableModule,
    NbButtonModule,
    NbIconModule,
    NbFormFieldModule,
    NbSelectModule,
    NbInputModule,
    NbTooltipModule,
    RouterModule.forChild(routes)
  ]
})
export class ManajemenUserModule { }
