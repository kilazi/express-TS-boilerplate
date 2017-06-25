import { CRUDService } from './../common/crud.service';
import { APIResponse } from './api.service';
import { Observable } from 'rxjs';
import { JWTService } from './../common/jwt.service';
var md5 = require('md5');
export class DevicesAPI {

    constructor(
        private JWT: JWTService,
        private CRUD: CRUDService
    ) {

    }

    getDevicesList(data, user_id) {
        return new Observable(observer => {
            this.CRUD.read('devices', { user_id: user_id }).subscribe(devices => {
                observer.next(devices);
            }, err => {
                observer.error(err);
            })

        })
    }

    getDevicesMETA(data, user_id) {
        return new Observable(observer => {
            this.CRUD.read('devices_meta', { user_id: user_id }).subscribe(devices => {
                observer.next(devices);
            }, err => {
                observer.error(err);
            })

        })
    }

    addDevice(data, user_id) {
        
        data['device']['user_id'] = user_id;
        data['device_meta']['user_id'] = user_id;
        console.log('USER ID', user_id);
        let device_id = data['device']['id'];
        return new Observable(observer => {
            this.CRUD.read('devices', { id: device_id }).subscribe((devices: any) => {
                console.log('Found devices', devices);
                if (devices.length > 0) {
                    observer.error('LOCKED_DEVICE');
                } else this.CRUD.createOne('devices', data['device']).subscribe(devices => {
                    this.CRUD.createOne('devices_meta', data['device_meta']).subscribe(devices => {
                        observer.next(devices);    
                    }, err => {
                        observer.error(err);
                    })                    
                }, err => {
                    observer.error(err);
                });
            }, err => {
                observer.error(err);
            })

        })
    }

    updateDeviceMeta(data, user_id) {
        let device_id = data['id'];
        return new Observable(observer => {
            this.CRUD.update('devices_meta', { id: device_id }, data).subscribe(devices => {
                observer.next(devices);
            }, err => {
                observer.error(err);
            })
        })
    }

    updateDevice(data, user_id) {
        let device_id = data['id'];
        return new Observable(observer => {
            this.CRUD.update('devices', { id: device_id }, data).subscribe(devices => {
                observer.next(devices);
            }, err => {
                observer.error(err);
            })
        })
    }

    shareDevice(data, user_id) {
        let device_id = data['id'];
        let share_to = data['share_to'];
        return new Observable(observer => {
            this.CRUD.read('devices', { id: device_id }).subscribe((devices: any) => {
                if (devices.length == 0) {
                    let shared = devices[0]['shared'];
                    shared.push(share_to);
                    this.CRUD.update('devices', { id: device_id }, shared).subscribe(devices => {
                        observer.next(devices);
                    }, err => {
                        observer.error(err);
                    });
                } else observer.error('DEVICE_NOT_FOUND');
            }, err => {
                observer.error(err);
            })
        })
    }
    
    removeDevice(data, user_id) {
        let device_id = data['id'];
        return new Observable(observer => {
            this.CRUD.delete('devices', {id: device_id}).subscribe(
                res => observer.next(),
                err => observer.error()
            )
        })
    }


}