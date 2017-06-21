import { CRUDService } from './../common/crud.service';
import { APIResponse } from './api.service';
import { Observable } from 'rxjs';
import { JWTService } from './../common/jwt.service';
var md5 = require('md5');
export class AuthAPI {

    private socialSecret: string = 'e4901652-9ef1-4e79-abd1-cde058ba51bf';

    constructor(
        private JWT: JWTService,
        private CRUD: CRUDService
    ) {

    }

    login(data) { 
        let response: APIResponse;
        return new Observable(observer => {
            data.password = md5(data.password);
            this.CRUD.read('users', data).subscribe((res: any) => {
                if (res.length == 1) {
                    response = {
                        status: true,
                        data: this.JWT.createToken({ user_id: res[0]['id'] })
                    }
                    observer.next(response);
                } else {
                    observer.error('WRONG_LOGIN')
                }
            }, err => {
                observer.error(err);
            })

        })
    }

    register(data) {
        let response: APIResponse;
        return new Observable(observer => {
            data.password = md5(data.password);
            this.CRUD.read('users', { email: data.email }).subscribe((res: any) => {
                if (!res.length) {
                    this.CRUD.createOne('users', data).subscribe((res: any) => {
                        response = {
                            status: true,
                            data: this.JWT.createToken({ user_id: res })
                        }
                        observer.next(response);
                    }, err => {
                        observer.error(err);
                    })

                } else {
                    observer.error('EMAIL_ALREADY_EXISTS')
                }
            }, err => {
                observer.error(err);
            })

        })
    }

    loginSocial(data) {
        let response: APIResponse;
        console.log('loginSocial', data);
        let filter = {};
        filter[data['type']] = data['data'];
        return new Observable(observer => {
            if (data['secret'] != this.socialSecret) observer.error('SOURCE_ERROR');
            this.CRUD.read('users', filter).subscribe((res: any) => {
                if (res.length == 1) {
                    response = {
                        status: true,
                        data: this.JWT.createToken({ user_id: data['id'] })
                    }
                    observer.next(response);
                } else if (res.length == 0) {
                    this.CRUD.createOne('users', data).subscribe((res: any) => {
                        response = {
                            status: true,
                            data: this.JWT.createToken({ user_id: res })
                        }
                        observer.next(response);
                    }, err => {
                        observer.error(err);
                    })
                } else observer.error('UNKNOWN_ERROR');
            }, err => observer.error(err))
        })
    }
}