import { Component, ViewChild, ElementRef, OnInit, Output, Input, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { CommonFunction } from '../../../component/common-function/common-function';
import Gantt from './lib'
import { Observable, Subject } from 'rxjs';

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
    template: `<svg xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" #gantt id="gantt" width="100" height="100"></svg>
                <img style="position: absolute; z-index: -99" id="imgsvg"/>
                <canvas id="canvassvg" style="position: absolute; z-index: -99"></canvas>`,
    styleUrls: ['./frappe-gantt.component.scss'],
})

export class FrappeGanttComponent implements OnInit, OnChanges {
    @ViewChild('gantt') ganttEl: ElementRef;

    @Input() showSCurve: boolean = false
    @Input() viewMode: string = 'Day'
    @Input() tasks: any[] = [];

    base64 = ``
    withScurve = false

    constructor(public commonFunction : CommonFunction) {

    }

    gantt: any;// gantt object
    ngOnInit() {
        this.gantt = new Gantt('#gantt', this.tasks?.length > 0 ? this.tasks : [], {showSCurve: this.withScurve, view_mode: this.viewMode});
    }

    viewGantChart(tasks, {scurve, viewMode}: {scurve?: boolean, viewMode?: string} = {scurve: false, viewMode: 'Day'}) {
        this.tasks = tasks;
        this.withScurve = scurve
        this.viewMode = viewMode
        this.ngOnInit()

        this.getImage()
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

    showGantChart(data) {
        const { work_area = [], variant_work = [] } = data;
        // if(!this.commonFunction.arrayNotEmpty(reportWorkArea)) reportWorkArea = [];
        // if(!this.commonFunction.arrayNotEmpty(variant_work)) variant_work = [];
        // const allWorkArea = [...reportWorkArea, ...variant_work];
        let tasks = [];
        let date = this.commonFunction.transformDate(new Date());

        function reconstructData(wa) {
          let price : any = 0;
          let dependencies = [];
          wa.filter(job => job).forEach(({ id, jobName : name, unitPriceActual = "", 
            unitPriceAddOn = "", start, end, items = [], progress, 
          }) => {
            if(unitPriceActual) price = unitPriceActual;
            if(unitPriceAddOn) price = unitPriceAddOn;
            if(items?.length) reconstructData(items)
            if(typeof progress != 'object') progress = [{progress : 0, date}];
            tasks.push({id, name, price, start, end, progress_log: progress, dependencies})
          })
        }

        reconstructData([...(work_area ?? []), ...(variant_work ?? [])])
        return tasks
    }

    getImage(): Observable<string> {
        const subject = new Subject<any>()

        const svgElement =  document.querySelector('#gantt')
        if (svgElement) {
            const svgXml = new XMLSerializer().serializeToString(svgElement);
            // Create a new Blob with the XML content
            const blob = new Blob([svgXml], { type: 'image/svg+xml' });

            // Read the contents of the Blob
            const reader = new FileReader();
                reader.onload = () => {
                // Convert the read content to base64
                const base64String = btoa(reader.result as string);

                // Use the base64 string as needed
                const imgElement =  document.querySelector('#imgsvg') as HTMLImageElement
                this.base64 = imgElement.src = `data:image/svg+xml;base64,${base64String}`

                var canvas = document.querySelector("#canvassvg") as HTMLCanvasElement;
                imgElement.onload = () => {
                    var ctx = canvas.getContext("2d");
                    const {width, height} = imgElement
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(imgElement, 0, 0);
                    this.base64 = canvas.toDataURL("image/png");                    
                }


            };
            reader.readAsBinaryString(blob);

            return subject.asObservable()
        }

        return null
    }
}