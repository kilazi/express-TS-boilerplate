import { GlobalService } from './../common/global.service';
import { Observable } from 'rxjs';
var MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/bt';

export class DBClient {
    public db: any;
    constructor(
        private globalService: GlobalService
    ) {
        this.db = this.globalService.DBClient;
    }

    connect() {
        console.log('Connecting to db..');
        return new Observable(observer => {
            MongoClient.connect(url, (err, db) => {
                if (!err) {
                    this.db = db;
                    console.log("Connected successfully to MongoDB server.");
                    observer.next();
                }
                else {
                    console.log("Error connecting to server: ", err);
                    observer.error();
                }
            });
        })

    }

    disconnect() {
        this.db.close();
    }
}
