import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-work-progress',
  templateUrl: './work-progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WorkProgressComponent {
  evaIcons = [];
  constructor(iconsLibrary: NbIconLibraries) {
    this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  useIcons = [
    {
    icon: 'refresh',
    desc: 'Refresh'
    },
    {
      icon: 'plus',
      desc: 'Add Phase'
    },
    {
      icon: 'list',
      desc: 'Add Activity'
    },
    {
      icon: 'flag-outline',
      desc: 'Add Milestone'
    },
    {
      icon: 'clock-outline',
      desc: 'Add Meeting'
    },
    {
      icon: 'checkmark-square',
      desc: 'Add Task'
    },
    {
      icon: 'arrow-right-outline',
      desc: 'Add Microflow'
    },
    {
      icon: 'external-link',
      desc: 'Export to Excel'
    },
    {
      icon: 'plus-square-outline',
      desc: 'Expand'
    },
    {
      icon: 'minus',
      desc: 'Collapse'
    }
  ]
}

