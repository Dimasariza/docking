import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { Subject } from "rxjs";
import { HomeBateraService } from "../home-batera.service";
import { HttpEventType } from "@angular/common/http";

@Component({
    selector: 'ngx-test-dialog',
    templateUrl: "./ship-dialog.component.html" ,
})
export class ShipDialogComponent implements OnInit {
    @Input() dialogData: any;
    constructor(
        private dialog: NbDialogRef<any>,
        private homeService : HomeBateraService
    ) { }

    ngOnInit(): void {
        if(this.dialogData.data?.imageURL) 
        this.viewImageLink = this.dialogData.data.imageURL;
    }

    private destroy$: Subject<void> = new Subject<void>();
    public viewImageLink : any = null;
    onFileChange(res) {
        const file = res.target.files[0];
            if (res.target.files.length > 0) { 
            this.uploadImageUrl = file;
            var reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (event) => {
                this.viewImageLink = event.target.result;
            }
        }
        this.onImageLoad()
    }

    public uploadImageUrl;
    public uploadProgress : any = "Drop Your Image here";
    onImageLoad(){
        const formData = new FormData(); 
        formData.append('dokumen', this.uploadImageUrl);
        this.homeService.uploadFile(formData)
        .subscribe((res) => {
            if (res.type === HttpEventType.UploadProgress) {
                this.uploadProgress = Math.round(res.loaded / res.total ) * 100 + '%';
            } else 
            if ( res.type === HttpEventType.Response){
                this.uploadProgress = 'Upload Success';
                const result : any = res;
                this.uploadImageUrl = result.body.data.file;
            }
        })
    }

    onSubmit({value}){
        let {nama_kapal, foto, id_kapal} = value;
        if(this.dialogData.data) {
            let {nama_kapal : ship_name, foto : image, id_kapal : ship_id} = this.dialogData?.data;
            id_kapal = ship_id;
            if(!this.uploadImageUrl) this.uploadImageUrl = image;
            if(nama_kapal == ship_name && foto == '') 
            return this.closeDialog();
        }
        if(this.uploadImageUrl) foto = this.uploadImageUrl;  
        const postBody = { nama_kapal, foto, id_kapal }
        this.closeDialog(postBody)
    }

    closeDialog (arr = null) {
        this.dialog.close(arr);
    } 

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
  