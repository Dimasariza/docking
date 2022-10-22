import { Component, ViewChild, ElementRef, OnInit, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import Gantt from './lib'

@Component({
    selector: 'f-gantt',
    template: '<svg id="gantt" style="min-height: 100%"></svg>',
    styleUrls: ['./frappe-gantt.component.scss'],
})

export class FrappeGanttComponent implements OnInit, OnChanges {
    @ViewChild('gantt') ganttEl: ElementRef;

    @Input() showSCurve: boolean = false
    @Input() viewMode: string = 'Day'

    gantt;
    tasks = [
        {
            id: 'Task 1',
            name: 'Redesign website',
            start: '2016-1-11',
            end: '2016-1-21',
            price: 500,
            progress_log: [
                {progress: 10, date: '2016-1-12'},
                {progress: 50, date: '2016-1-15'},
                {progress: 100, date: '2016-1-30'},
            ],
            // dependencies: 'Task 2, Task 3',
        },
        {
            id: 'Task 2',
            name: 'Redesign website 2',
            start: '2016-1-21',
            end: '2016-1-25',
            price: 300,
            progress_log: [
                {progress: 100, date: '2016-1-24'}
            ],
            dependencies: 'Task 1',
        },
        {
            id: 'Task 3',
            name: 'Redesign website 3',
            start: '2016-1-25',
            end: '2016-1-31',
            price: 200,
            progress_log: [
                {progress: 100, date: '2016-1-31'},
            ],
            dependencies: 'Task 2',
        },
        {
            id: 'Task 4',
            name: 'Redesign website',
            start: '2016-1-11',
            end: '2016-1-21',
            price: 100,
            progress_log: [
                {progress: 50, date: '2016-1-15'},
                {progress: 100, date: '2016-1-21'},
            ],
            // dependencies: 'Task 2, Task 3',
        },
    ].map(t => {
        return {...t, progress: t.progress_log?.map(p => p.progress).reduce((p,c) => p+c, 0)/(t.progress_log?.length ?? 1) ?? 0}
    });

    ngOnInit() {
        this.gantt = new Gantt('#gantt', this.tasks, {});        
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log(changes);
        
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