import { Component, ViewChild, ElementRef, OnInit, Output, Input, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import Gantt from './lib'

export interface Task {
    id: string;
    name: string;
    start: Date;
    end: Date;
    price: number;
    progress_log: ProgressLog[];
    dependencies?: string;
}

export interface ProgressLog {
    progress: string;
    date: string;
}

@Component({
    selector: 'f-gantt',
    template: '<svg id="gantt" style="min-height: 100%"></svg>',
    styleUrls: ['./frappe-gantt.component.scss'],
})

export class FrappeGanttComponent implements OnInit, OnChanges {
    @ViewChild('gantt') ganttEl: ElementRef;

    @Input() showSCurve: boolean = false
    @Input() viewMode: string = 'Day'
    @Input() tasks: any[]

    gantt: any;// gantt object
    ngOnInit() {
        this.gantt = new Gantt('#gantt', this.tasks, {});     
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {showSCurve, viewMode} = changes

        if (showSCurve && showSCurve.previousValue != showSCurve.currentValue) {
            this.toggleSCurve()
        }

        if (viewMode && viewMode.previousValue != viewMode.currentValue) {
            this.changeViewMode()
        }
    }

    changeViewMode() {
        if (this.gantt) {
            this.gantt.change_view_mode(this.viewMode)
        }
    }

    toggleSCurve() {        
        if (this.gantt) {
            this.gantt.toggle_scurve()
        }
    }
}