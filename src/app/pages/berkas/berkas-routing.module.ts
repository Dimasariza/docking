import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BerkasSayaComponent } from './berkas-saya/berkas-saya.component';
import { BerkasComponent } from './berkas.component';

const routes: Routes = [
  { path: '',
    component: BerkasComponent,
    children: [
      {
        path: 'berkas-saya',
        component: BerkasSayaComponent
      }
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BerkasRoutingModule { }
