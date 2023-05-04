import { of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Contacts, RecentUsers } from '../data/users';

@Injectable()
export class UserService   {

  private users = {
    nick: { name: 'Bahri', picture: 'assets/images/nick.png' },
  };

  private types = {
    mobile: 'mobile',
    home: 'home',
    work: 'work',
  };

  private contacts: Contacts[] = [
    { user: this.users?.nick, type: this.types.mobile },
  ];

  private recentUsers: RecentUsers[]  = [
  ];

  getUsers(): Observable<any> {
    return observableOf(this.users);
  }

  getContacts(): Observable<Contacts[]> {
    return observableOf(this.contacts);
  }

  getRecentUsers(): Observable<RecentUsers[]> {
    return observableOf(this.recentUsers);
  }
}
