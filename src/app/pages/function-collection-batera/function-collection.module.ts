import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FunctionRoutingModule } from './function-collection-routing.module';
import { FunctionCollection } from './function-collection.component';


@NgModule({
  declarations: [
    FunctionCollection
  ],
  imports: [
    CommonModule,
    FunctionRoutingModule
  ],
  providers : [CurrencyPipe]
})
export class FunctionCollecetionModule { }
