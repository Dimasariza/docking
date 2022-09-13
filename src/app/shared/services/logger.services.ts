import { Injectable } from "@angular/core";
import { ProfilBateraComponent } from "../../pages/profile-batera/profil-batera.component";


export class IBaseService{
    create: any;
    update: any;
    get: any;
    getById: any;
    delete: any;
}

@Injectable({
    providedIn: 'root',
})
export class BaseService {
    constructor(private service: ProfilBateraComponent){}

}