import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import Gantt from './lib'

@Component({
    selector: 'f-gantt',
    template: '<svg id="gantt" style="min-height: 100%"></svg>',
    styleUrls: ['./frappe-gantt.component.scss'],
})

export class FrappeGanttComponent implements OnInit {
    @ViewChild('gantt') ganttEl: ElementRef;

    gantt;
    tasks = [
        {
            id: 'Task 1',
            name: 'Redesign website',
            start: '2016-1-11',
            end: '2016-1-21',
            progress_log: [
                {progress: 100, date: '2016-1-15'},
            ],
            // dependencies: 'Task 2, Task 3',
        },
        {
            id: 'Task 2',
            name: 'Redesign website 2',
            start: '2016-1-21',
            end: '2016-1-25',
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
            progress_log: [
                {progress: 100, date: '2016-1-30'},
            ],
            dependencies: 'Task 2',
        },
    ].map(t => {
        return {...t, progress: t.progress_log.map(p => p.progress).reduce((p,c) => p+c, 0)/(t.progress_log?.length ?? 1)}
    });

    ngOnInit() {
        this.gantt = new Gantt('#gantt', this.tasks, {});
    }
}