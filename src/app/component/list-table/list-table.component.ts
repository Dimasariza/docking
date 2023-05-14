import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'ngx-list-table-component',
    templateUrl: './list-table.component.html',
})
export class ListTableComponent{
    @Input() columns;
    @Input() rows;
    @Output() sendHandleClick: EventEmitter<any> = new EventEmitter();

    handleClickButton(button, data) {
        this.sendHandleClick.emit({button, data})
    }
}