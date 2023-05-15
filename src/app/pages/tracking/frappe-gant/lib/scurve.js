import { createSVG } from './svg_utils';
import date_utils from './date_utils';

export default class SCurve {

    constructor(gantt, rect) {
        this.gantt = gantt
        this.rect = rect;
        this.layer = createSVG('g', { append_to: this.gantt.layers.chart });
        this.circleSize = 8;

        const {actual, plan} = this.calculateData()
        console.log(actual);
        this.draw(actual, true)
        this.draw(plan)
    }

    get_total_progress(date, currentTask) {
        return currentTask.progress_log?.filter(log => {
            const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())

            return start.getTime() >= log.date.getTime()
        })
        .map(log => {
            return parseFloat(log.progress)/100*parseFloat(currentTask.weight ?? 0)})
    }

    calculateData() {
        const { options: {step, column_width}, gantt_start, gantt_end } = this.gantt;

        const total_days = date_utils.diff(gantt_end, gantt_start, 'day')

        let start_date = new Date()
        let end_date = new Date(0)

        // find early and latest date in task
        this.gantt.tasks.forEach(task => {
            if (task._start.getTime() < start_date.getTime()) {
                start_date = task._start
            }

            if (task._end.getTime() > end_date.getTime()) {
                end_date = task._end
            }
        })

        // loop total days in a project
        let currentDate = new Date(gantt_start)
        let actual = []

        // actual progress
        for (var day = 0; day <= total_days; day++) {
            // console.log(day);
            const _progress = this.gantt.tasks.map(task => {
                // get the progress of task
                return this.get_total_progress(currentDate, task)
            }).reduce((p, c) => [...p, ...c.map(d => d+(p.length ? p[p.length-1] : 0))])

            const diff = date_utils.diff(currentDate, gantt_start, 'hour');
            const x = (diff / step) * column_width;

            if (start_date.getTime() <= currentDate.getTime() && end_date.getTime() >= currentDate.getTime()) {
                actual.push({x, y: _progress.length > 0 ? _progress[_progress.length-1] : 0, date: new Date(currentDate)})
            }

            currentDate.setDate(currentDate.getDate() + 1)
        }


        currentDate = new Date(gantt_start)
        let lastProgress = 0
        let progressTrack = -1
        let plan = []
        // planning progress
        for (var day = 0; day <= total_days; day++) {
            // console.log(day);
            const progress = this.gantt.tasks.map(task => {
                // get the progress of task
                if (/*task._start.getTime() <= currentDate.getTime() && */
                task._end.getTime() == currentDate.getTime()) {
                    // console.log(task.weight);
                    return parseFloat(task.weight ?? 0)
                } else {
                    return 0
                }
            }).reduce((p, c) => p+c, 0)

            const diff = date_utils.diff(currentDate, gantt_start, 'hour');
            const x = (diff / step) * column_width;

            if (start_date.getTime() <= currentDate.getTime() && end_date.getTime() >= currentDate.getTime() && lastProgress != (progressTrack + progress) ) {
                // console.log(_progress.length > 0 ? _progress[_progress.length-1] : 0);
                lastProgress += progress
                plan.push({x, y: Math.min(Math.max(lastProgress, 0), 100), date: new Date(currentDate)})
                progressTrack = lastProgress
            }

            currentDate.setDate(currentDate.getDate() + 1)
        }

        return {actual, plan}
    }

    draw(data, isActual = false) {
        const {x1, y1, x2, y2} = this.rect
        const lines = data.map(d => {
            return {x: d.x, y: y1 - (d.y/100 * (y1 - y2))}
        })

        this.element = createSVG('polyline', {
            points: `${[...new Set(lines)].map(p => `${p.x},${p.y}`).join(' ')}`,
            class: isActual ? 'actual-line' : 'plan-line',
            append_to: this.layer
        });

        let current = {x: 0, y: 0}
        let max = 1
        // console.log(data);
        data.forEach(({x, y}) => {
            if (y !== current.y || y == 100) {

                if (x != current.x && max == 1) {
                    this.$boundingBox = createSVG('rect', {
                        x: current.x-(this.circleSize/2),
                        y: (y1-(current.y/100 * (y1-y2)))-(this.circleSize/2),
                        width: this.circleSize,
                        height: this.circleSize,
                        rx: 100,
                        ry: 100,
                        class: 'curve-circle',
                        append_to: this.layer,
                    });
                }

                this.$boundingBox = createSVG('rect', {
                    x: x-(this.circleSize/2),
                    y: (y1-(y/100 * (y1-y2)))-(this.circleSize/2),
                    width: this.circleSize,
                    height: this.circleSize,
                    rx: 100,
                    ry: 100,
                    class: 'curve-circle',
                    append_to: this.layer,
                });

                current = {x,y}
                max--
            } else {
                current.x = x
                max = 1
            }
        })
    }
}