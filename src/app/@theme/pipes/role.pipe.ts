import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'role' })
export class RolePipe implements PipeTransform {
    get user() { return JSON.parse(localStorage.getItem('user')) }

    transform(input: string[]): boolean {
        const {role} = this.user
        return input.indexOf(role) > -1
    }
}
