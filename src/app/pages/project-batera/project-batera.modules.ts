import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbOptionModule, NbSelectModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ThemeModule } from '../../@theme/theme.module';
import { ProjectBateraRoutingModule, routedComponents } from './project-batera-routing.module';

@NgModule({
  imports: [
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NgxDatatableModule,
    ProjectBateraRoutingModule,
    NbOptionModule,
    NbSelectModule,
    NbButtonModule
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class ProjectBateraModule{ 
}
