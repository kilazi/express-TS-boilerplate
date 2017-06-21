import { JWTService } from './common/jwt.service';
import { CRUDService } from './common/crud.service';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { GlobalService } from './common/global.service';
import { APIHandler } from './api/api.service';
import * as http from 'http';
import { DBClient } from './db/db.client';

export class Server {
    private app: any;
    private API: APIHandler;
    private CRUD: CRUDService;
    private JWT: JWTService
    private $http;
    private dbClient: DBClient;
    constructor( 
        private globalService: GlobalService
    ) {
        this.dbClient = new DBClient(this.globalService);
        this.dbClient.connect().subscribe(() => {
            this.CRUD = new CRUDService(this.globalService, this.dbClient);
            this.JWT = new JWTService();
            this.API = new APIHandler(this.globalService, this.dbClient, this.JWT, this.CRUD);
            this.bootstrap();
        });


    }
    bootstrap() { 
        this.app = express();
        this.$http = http['Server'](this.app);
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../public')));
        this.globalService.app = this.app;
        this.JWT.init(this.app);
        this.API.routes();



        this.$http.listen(1337, () => {
            console.log('Server runs at 1337.');
        });
    }
}
