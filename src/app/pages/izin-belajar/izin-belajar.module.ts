import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogFormComponent, IzinBelajarComponent } from './izin-belajar.component';
import { NbButtonModule, NbCardModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { IndexComponent } from './index/index.component';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  { path: '',
    component: IzinBelajarComponent,
    children: [
      {
        path: 'index',
        component: IndexComponent
      },
      {
        path: 'detail',
        component: DetailComponent
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
    IzinBelajarComponent,
    DialogFormComponent,
    IndexComponent,
    DetailComponent
  ],
  imports: [
    NbCardModule,
    NbDialogModule,
    ThemeModule,
    CommonModule,
    NgxDatatableModule,
    NbButtonModule,
    NbInputModule,
    NbIconModule,
    NbSelectModule,
    NbFormFieldModule,
    RouterModule.forChild(routes)
  ]
})
export class IzinBelajarModule { }
