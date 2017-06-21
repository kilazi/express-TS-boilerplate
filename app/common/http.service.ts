import {Component, Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Settings} from '../common/config.ts';
import {Observable} from 'rxjs';
import {GlobalService} from './global.service';
declare var ipc: any;
@Injectable()

export class HttpService {
  constructor(
    private http: Http,
    private globalService: GlobalService
  ) { }
}
