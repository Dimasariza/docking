import { Component, Injector, OnInit } from "@angular/core";
import { CommonFunction } from "../component/common-function/common-function";
import { ToastrComponent } from "../component/toastr-component/toastr.component";

@Component({
    selector: 'base',
    template: ''
})
export class PageBaseComponent implements OnInit {

    get user() { return JSON.parse(localStorage.getItem('user')) }

    commonFucntion: CommonFunction
    toastr: ToastrComponent

    constructor(injector: Injector) {
        this.commonFucntion = injector.get(CommonFunction)
        this.toastr = injector.get(ToastrComponent)
    }

    ngOnInit(): void {
    }
}