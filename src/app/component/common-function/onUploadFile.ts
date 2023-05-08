import { Injectable } from "@angular/core";
import { ToastrComponent } from "../toastr-component/toastr.component";

@Injectable({
  providedIn: 'root',
})
export class CheckFile {
    constructor(
        private toastr : ToastrComponent
    ) {}

    writeFile(res){
        if(!res) return;
        const formData = new FormData();
        const file = res.target?.files[0];
        const fileSize = file.size;
        const ext = file.type.split("/")[1];
        const acceptionFIle = ['doc', 'docx', 'pdf', 'txt'];
        if(fileSize > 2500000) {
            this.toastr.onInfo('Your file size must be less then 2 Mb.');
            return false;
        } else
        if(!acceptionFIle.includes(ext)) {
            this.toastr.onInfo('Your file extension must be on txt, doc, docx or pdf format.')
            return false;
        }
        formData.append('dokumen', file);
        return formData;
    }

    numericFile() {
        
    }
}