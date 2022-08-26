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
      title: 'PIC',
      route: '/pages/report-batera/pic',
    },
    {
      title: 'Work Progress',
      route: '/pages/report-batera/work-progress',
    },
    {
      title: 'BAST*',
      route: '/pages/report-batera/bast',
    },
    {
      title: 'Surat Teguran*',
      route: '/pages/report-batera/surat-teguran',
    },
    {
      title: 'Close Out Report(COR)*',
      route: '/pages/report-batera/close-out',
    },
    {
      title: 'Activity Report',
      route: '/pages/report-batera/activity-report',
    },
  ];
}



