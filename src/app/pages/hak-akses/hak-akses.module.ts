import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HakAksesComponent } from './hak-akses.component';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RouterModule, Routes } from '@angular/router';
import { NewRoleComponent } from './new-role/new-role.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  { path: '',
    component: HakAksesComponent,
    children: [
      {
        path: 'index',
        component: IndexComponent
      },
      {
        path: 'new-role',
        component: NewRoleComponent
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
    HakAksesComponent,
    NewRoleComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NgxDatatableModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbFormFieldModule,
    NbCheckboxModule,
    RouterModule.forChild(routes)
  ]
})
export class HakAksesModule { }
