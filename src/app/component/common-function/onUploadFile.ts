import { Injectable } from "@angular/core";
import { ToastrComponent } from "../toastr-component/toastr.component";

@Injectable({
  providedIn: 'root',
})
export class CheckFile {
    constructor(
        private toastr : ToastrComponent
    ) {}

    public readExtension = ['.doc', '.docx', '.pdf', '.txt', '.dotx'];
    public numericExtension = ['.xlsx', '.xlsm', '.xls', '.xltx', '.xltm'];
    public imageExtension = ['.png', '.jpg', '.jpeg'];

    extension(res, docType){
        if(!res) return;
        const formData = new FormData();
        const file = res.target?.files[0];
        const { size, name } = file;
        const ext = name.match(/[.](?!\S*[.])\S*/gm)[0];
        let accepExtension; 
        if(docType == 'read file') accepExtension = this.readExtension;
        if(docType == 'numeric file') accepExtension = this.numericExtension;
        if(docType == 'image file') accepExtension = this.imageExtension;

        if(size > 2500000) {
            this.toastr.onInfo({infomsg :'Your file size must be less then 2 Mb.'});
            return false;
        } else
        if(!accepExtension.includes(ext)) {
            this.toastr.onInfo({infomsg : `Your file extension must be on ${ accepExtension.join(', ') } format.`})
            return false;
        }
        formData.append('dokumen', file);
        return formData;
    }
}