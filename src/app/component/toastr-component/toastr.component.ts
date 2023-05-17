import { Component, Injectable } from "@angular/core";
import { NbGlobalPhysicalPosition, NbIconConfig, NbToastrService } from "@nebular/theme";

@Injectable({
    providedIn: 'root',
})
@Component({
    selector: 'ngx-toastr-component',
    template: '',
})  
export class ToastrComponent {
    constructor(
        private toastrService: NbToastrService,
    ) {
        
    }

    public option = {
        position : NbGlobalPhysicalPosition.BOTTOM_RIGHT,
        preventDuplicates : true,
        limit: 2
    }
    
    onUpload(msg = null) {
        const iconConfig: NbIconConfig = { icon: 'upload-outline', pack: 'eva' };
        if(!msg) msg = "Please wait..."
        this.toastrService.show(msg, `Sending Your Request`,
        {   ...this.option, 
            icon : iconConfig, 
            status : 'info', 
            duration : 1000,
            duplicatesBehaviour : 'all',
        });
    }

    onError(msg = null) {
        const iconConfig: NbIconConfig = { icon: 'alert-circle-outline', pack: 'eva' };
        if(!msg) msg = "Please Reload and check your connection."
        this.toastrService.show(msg, `Your Request Failed`,
        {   ...this.option,
            icon : iconConfig, 
            status : 'danger', 
            duration : 8000,
            duplicatesBehaviour : 'all',
        });
    }

    onSuccess(msg) {
        const iconConfig: NbIconConfig = { icon: 'checkmark-circle-outline', pack: 'eva' };
        this.toastrService.show(msg, `Your Request Success`, 
        {   ...this.option,
            icon : iconConfig, 
            status : 'success', 
            duration : 4000,
            duplicatesBehaviour : 'all',
        });
    }

    onInfo({infomsg = '', title = 'There is something wrong...', duration = 4000}) {
        const iconConfig: NbIconConfig = { icon: 'alert-triangle-outline', pack: 'eva' };
        this.toastrService.show(infomsg, title, 
        {   ...this.option,
            icon : iconConfig, 
            status : 'info', 
            duration,
            duplicatesBehaviour : 'all',
        });
    }

    onWarning({warnmsg = '', duration = 2000}) {
        const iconConfig: NbIconConfig = { icon: 'alert-triangle-outline', pack: 'eva' };
        this.toastrService.show(warnmsg, `Access Denied!`, 
        {   ...this.option,
            icon : iconConfig, 
            status : 'warning', 
            duration,
            duplicatesBehaviour : 'all',
            preventDuplicates : false,
        });
    }
}