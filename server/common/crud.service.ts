import { DBClient } from './../db/db.client';
import { GlobalService } from './../../app/common/global.service';
import { Observable } from 'rxjs';
import * as EventEmitter from 'events';
import * as uuid from 'uuid';

export class CRUDService {
    constructor(
        private gs: GlobalService,
        private dbClient: DBClient
    ) {
    }

    read(collectionName: string, filter: Object = {}) {
        var collection = this.dbClient.db.collection(collectionName);
        return new Observable(observer => {
            collection.find(filter).toArray((err, docs) => {
                if (err) observer.err('DATABASE_ERROR');
                observer.next(docs);
            });
        })
    }

    create(collectionName: string, data: [Object]) {
        return new Observable(observer => {
            new Promise((resolve, reject) => {
                let length = data.length - 1;
                data.forEach((item, index) => {
                    if(!item['id'])
                        item['id'] = uuid.v4();
                    if (index === length) {
                        resolve(data);
                    }
                })
            }).then((data) => {
                var collection = this.dbClient.db.collection(collectionName);

                collection.insertMany(data, (err, docs) => {
                    if (err) observer.err('DATABASE_ERROR');
                    observer.next(docs);
                });
            })
        });
    }

    createOne(collectionName: string, data: [Object]) {
        return new Observable(observer => {
            if(!data['id'])
                data['id'] = uuid.v4();

            var collection = this.dbClient.db.collection(collectionName);

            collection.insertOne(data, (err, docs) => {
                if (err) observer.err('DATABASE_ERROR');
                observer.next({id: data['id']});
            });
        })

    }

    update(collectionName: string, search: Object, set: Object) {
        var collection = this.dbClient.db.collection(collectionName);
        return new Observable(observer => {
            collection.updateMany(search, { $set: set }, (err, docs) => {
                if (err) observer.err('DATABASE_ERROR');
                observer.next(docs);
            });
        });
    }

    delete(collectionName: string, search: Object) {
        var collection = this.dbClient.db.collection(collectionName);
        return new Observable(observer => {
            collection.deleteMany(search, (err, docs) => {
                if (err) observer.err('DATABASE_ERROR');
                observer.next(docs);
            });
        });
    }



}
