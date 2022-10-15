import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { root } from "rxjs/internal-compatibility";

@Injectable({
    providedIn : root
})
export class SharedService {
    private subject = new Subject<any>();

    sendClickEvent(){
        this.subject.next();
    }

    getClickEvent(){
        return this.subject.asObservable();
    }
}