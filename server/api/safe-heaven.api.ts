import { CRUDService } from './../common/crud.service';
import { APIResponse } from './api.service';
import { Observable } from 'rxjs';
import { JWTService } from './../common/jwt.service';
var md5 = require('md5');
export class SafeHeavenAPI {
	constructor(
		private CRUD: CRUDService
	) {}

	getSafeHeavens(data, user_id) {
        return new Observable(observer => {
            this.CRUD.read('safeheaven', { user_id: user_id }).subscribe(devices => {
                observer.next(devices);
            }, err => {
                observer.error(err);
            })

        })
    }

	createSafeHeaven(data, user_id) {
		data['user_id'] = user_id;
        return new Observable(observer => {
            this.CRUD.createOne('safeheaven', data).subscribe(devices => {
                observer.next(devices);
            }, err => {
                observer.error(err);
            })

        })
    }

    updateSafeHeaven(data, user_id) {
        return new Observable(observer => {
            this.CRUD.update('safeheaven', {id: data.id, user_id: user_id}, data).subscribe(devices => {
                observer.next(devices);
            }, err => {
                observer.error(err);
            })

        })
    }

    removeSafeHeaven(data, user_id) {
        return new Observable(observer => {
            this.CRUD.delete('safeheaven', {id: data.id}).subscribe(devices => {
                observer.next(devices);
            }, err => {
                observer.error(err);
            })

        })
    }


}