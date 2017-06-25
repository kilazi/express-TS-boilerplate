import { UserAPI } from './user.api';
import { DevicesAPI } from './devices.api';
import { CRUDService } from './../common/crud.service';
import { APIResponse } from './api.service';
import { Observable } from 'rxjs';
import { RequestHandler } from './request.handler';
import { AuthAPI } from './auth.api';
import { JWTService } from './../common/jwt.service';
import { DBClient } from './../db/db.client';
import { GlobalService } from '../common/global.service';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Settings } from '../../app/common/config';

export interface APIResponse {
    status: boolean,
    data?: any,
    error?: string
}

interface apiEndpoint {
    address: string,
    type: 'post' | 'get' | 'put' | 'delete',
    class: any,
    method: string
}

export class APIHandler {
    private requestHandler: RequestHandler;
    private apiEndpoints: [apiEndpoint];
    private auth: AuthAPI;
    private devices: DevicesAPI;
    private user: UserAPI;
    constructor(
        private globalService: GlobalService,
        private db: DBClient,
        private JWT: JWTService,
        private CRUD: CRUDService
    ) {
        this.auth = new AuthAPI(JWT, CRUD);
        this.devices = new DevicesAPI(JWT, CRUD);
        this.user = new UserAPI(JWT, CRUD);
        this.requestHandler = new RequestHandler();
        this.apiEndpoints = [
            {
                address: '/v1/auth/login',
                type: 'post',
                class: this.auth,
                method: 'login'
            },
            {
                address: '/v1/auth/register',
                type: 'post',
                class: this.auth,
                method: 'register'
            },
            {
                address: '/v1/auth/login-social',
                type: 'post',
                class: this.auth,
                method: 'loginSocial'
            },
            {
                address: '/v1/devices/list',
                type: 'get',
                class: this.devices,
                method: 'getDevicesList'
            },
            {
                address: '/v1/devices/meta',
                type: 'get',
                class: this.devices,
                method: 'getDevicesMETA'
            },
            {
                address: '/v1/devices/add',
                type: 'post',
                class: this.devices,
                method: 'addDevice'
            },
            {
                address: '/v1/devices/update-meta',
                type: 'put',
                class: this.devices,
                method: 'updateDeviceMeta'
            },
            {
                address: '/v1/devices/update',
                type: 'put',
                class: this.devices,
                method: 'updateDevice'
            },
            {
                address: '/v1/devices/share',
                type: 'post',
                class: this.devices,
                method: 'shareDevice'
            },
            {
                address: '/v1/devices/remove',
                type: 'post',
                class: this.devices,
                method: 'removeDevice'
            },
            {
                address: '/v1/user/get',
                type: 'get',
                class: this.user,
                method: 'getUser'
            },
            {
                address: '/v1/user/update-family',
                type: 'put',
                class: this.user,
                method: 'updateFamily'
            },
            {
                address: '/v1/user/update',
                type: 'put',
                class: this.user,
                method: 'updateUser'
            }
        ]
    }
    routes() {
        // let route = '/auth/login';
        this.apiEndpoints.forEach(endpoint => {
            this.initRoute(endpoint);
        })


        this.globalService.app.get('**', (req, res, next) => {

        });
    }
 
    initRoute(endpoint: apiEndpoint) {
        this.globalService.app[endpoint.type](endpoint.address, (req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            console.log(endpoint.address + ' ' + endpoint.type.toUpperCase() + ' Request: ', req.body);
            if(!endpoint.class || !endpoint.class[endpoint.method]) this.returnError(res, 'Endpoint not found.', endpoint.address, endpoint.type, 404);
            this.requestHandler.handle(req).subscribe(handledReq => {
                // console.log('handleReq', handledReq);
                let user = req.user;
                if (user && user['user_id'])
                    endpoint.class[endpoint.method](handledReq, user['user_id']['id']).subscribe((resAPI: APIResponse) => {
                        console.log(endpoint.address + ' ' + endpoint.type.toUpperCase() + ' Response 1: ', resAPI);
                        res.json(resAPI);
                    }, err => this.returnError(res, err, endpoint.address, endpoint.type))
                else 
                    endpoint.class[endpoint.method](handledReq).subscribe((resAPI: APIResponse) => {
                        console.log(endpoint.address + ' ' + endpoint.type.toUpperCase() + ' Response 2: ', resAPI);
                        res.json(resAPI);
                    }, err => this.returnError(res, err, endpoint.address, endpoint.type, 401))
            }, err => this.returnError(res, err));
        })
    }

    returnError(res, message: string, address: string = 'Undefined', type: string = 'Undefined', status: number = 400) {
        console.log(address + ' ' + type.toUpperCase() + ' Error: ', message);
        let error: APIResponse = {
            status: false,
            error: message
        }
        res.status(status).json(error);
    }

}
