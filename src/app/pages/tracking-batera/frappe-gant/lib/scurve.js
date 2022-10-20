import { createSVG } from './svg_utils';
import date_utils from './date_utils';

export default class SCurve {

    constructor(gantt, rect) {
        this.gantt = gantt
        this.rect = rect;
        this.layer = createSVG('g', { append_to: this.gantt.layers.chart });
        this.circleSize = 8;
        this.currentProgress = 0

        this.draw()
    }

    compute_x(date) {
        const { step, column_width } = this.gantt.options;
        const gantt_start = this.gantt.gantt_start;

        const diff = date_utils.diff(date, gantt_start, 'hour');
        let x = (diff / step) * column_width;

        if (this.gantt.view_is('Month')) {
            const diff = date_utils.diff(date, gantt_start, 'day');
            x = (diff * column_width) / 30;
        }
        return x;
    }

    compute_y(progress) {
        const {y1,y2} = this.rect
        const total_height = y1 - y2
        this.currentProgress = progress + this.currentProgress
        return this.currentProgress/100 * total_height
    }

    draw() {
        const points = this.gantt.tasks.map(task => {
            const x = this.compute_x(task._start)
            const progress =  task.progress_log.map(log => log.progress).reduce((p, c) => p += c, 0)

            const y = this.compute_y(progress/(task.progress_log?.length ?? 1))

            const duration = date_utils.diff(task._end, task._start, 'hour') / this.gantt.options.step;
            const width = this.gantt.options.column_width * duration;

            return {x, y, width}
        })
        // .reduce((p, c) => [...p, ...c], [])
        const {x1, y1, x2, y2} = this.rect

        const lines = [{x: points[0].x, y: 0}, ...points]
        // console.log(points.map(p => `${p.x},${y1 - p.y}`).join(' '));
        this.element = createSVG('polyline', {
            points: `${lines.map(p => `${p.x},${y1 - p.y}`).join(' ')}`,
            class: 'curve-line',
            append_to: this.layer
        });

        // createSVG('line', {
        //     ...this.rect,
        //     class: 'curve-line',
        //     append_to: this.layer,
        // });

        // this.$boundingBox = createSVG('rect', {
        //     x: this.rect.x2-(this.circleSize/2),
        //     y: this.rect.y2-(this.circleSize/2),
        //     width: this.circleSize,
        //     height: this.circleSize,
        //     rx: 100,
        //     ry: 100,
        //     class: 'curve-circle',
        //     append_to: this.layer,
        // });
        // createSVG('circle', {
        //     cx:"50", 
        //     cy:"50",
        //     r:"50",
        //     class: 'curve-circle',
        //     append_to: this.layer,
        // });
    }
}