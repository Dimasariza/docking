import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-report-batera',
  templateUrl: './report-batera.component.html',
  styleUrls: ['./report-batera.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class ReportBateraComponent {
  evaIcons = [];

  constructor(iconsLibrary: NbIconLibraries) {
    this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);

    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  tabs: any[] = [
    {
      title: 'Key Positions',
      route: '/pages/report-batera/key-positions',
    },
    {
      title: 'Positions',
      route: '/pages/report-batera/positions',
    },
    {
      title: 'Activity Report',
      route: '/pages/report-batera/activity-report',
    },
    {
      title: 'Meetings',
      route: '/pages/report-batera/meetings',
    },
    {
      title: 'Status Report',
      route: '/pages/report-batera/status-report',
    },
    {
      title: 'Activity Flow',
      route: '/pages/report-batera/activity-flow',
    },
  ];
}



