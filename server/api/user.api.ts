import { CRUDService } from './../common/crud.service';
import { APIResponse } from './api.service';
import { Observable } from 'rxjs';
import { JWTService } from './../common/jwt.service';
var md5 = require('md5');
export class UserAPI {

    constructor(
        private JWT: JWTService,
        private CRUD: CRUDService
    ) {

    }

    getUser(data, user_id) {
        return new Observable(observer => {
            this.CRUD.read('users', { user_id: user_id }).subscribe(devices => {
                observer.next(devices);
            }, err => {
                observer.error(err);
            })

        })
    }

    updateFamily(data, user_id) {
        let device_id = data['device_id'];
        let share_to = data['share_to'];
        return new Observable(observer => {
            this.CRUD.update('devices', { user_id: user_id }, { family: data }).subscribe((devices: any) => {
                observer.next(devices);
            }, err => {
                observer.error(err);
            })
        })
    }

    updateUser(data, user_id) {
        return new Observable(observer => {
            this.CRUD.update('users', { user_id: user_id }, data).subscribe(devices => {
                observer.next(devices);
            }, err => {
                observer.error(err);
            })
        })
    }


}