module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId, 
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/var/www/BT";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var bootstrap_1 = __webpack_require__(8);
	var global_service_1 = __webpack_require__(10);
	var $server = new bootstrap_1.Server(new global_service_1.GlobalService());


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = require("rxjs");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = require("md5");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var user_api_1 = __webpack_require__(7);
	var devices_api_1 = __webpack_require__(5);
	var request_handler_1 = __webpack_require__(6);
	var auth_api_1 = __webpack_require__(4);
	var APIHandler = (function () {
	    function APIHandler(globalService, db, JWT, CRUD) {
	        this.globalService = globalService;
	        this.db = db;
	        this.JWT = JWT;
	        this.CRUD = CRUD;
	        this.auth = new auth_api_1.AuthAPI(JWT, CRUD);
	        this.devices = new devices_api_1.DevicesAPI(JWT, CRUD);
	        this.user = new user_api_1.UserAPI(JWT, CRUD);
	        this.requestHandler = new request_handler_1.RequestHandler();
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
	                method: 'getDevicesMeta'
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
	        ];
	    }
	    APIHandler.prototype.routes = function () {
	        var _this = this;
	        this.apiEndpoints.forEach(function (endpoint) {
	            _this.initRoute(endpoint);
	        });
	        this.globalService.app.get('**', function (req, res, next) {
	        });
	    };
	    APIHandler.prototype.initRoute = function (endpoint) {
	        var _this = this;
	        this.globalService.app[endpoint.type](endpoint.address, function (req, res, next) {
	            console.log(endpoint.address + ' ' + endpoint.type.toUpperCase() + ' Request: ', req.body);
	            _this.requestHandler.handle(req).subscribe(function (handledReq) {
	                var user = req.user;
	                if (user && user['user_id'])
	                    endpoint.class[endpoint.method](handledReq, user['user_id']).subscribe(function (resAPI) {
	                        console.log(endpoint.address + ' ' + endpoint.type.toUpperCase() + ' Response 1: ', resAPI);
	                        res.json(resAPI);
	                    }, function (err) { return _this.returnError(res, err, endpoint.address, endpoint.type); });
	                else
	                    endpoint.class[endpoint.method](handledReq).subscribe(function (resAPI) {
	                        console.log(endpoint.address + ' ' + endpoint.type.toUpperCase() + ' Response 2: ', resAPI);
	                        res.json(resAPI);
	                    }, function (err) { return _this.returnError(res, err, endpoint.address, endpoint.type, 401); });
	            }, function (err) { return _this.returnError(res, err); });
	        });
	    };
	    APIHandler.prototype.returnError = function (res, message, address, type, status) {
	        if (address === void 0) { address = 'Undefined'; }
	        if (type === void 0) { type = 'Undefined'; }
	        if (status === void 0) { status = 400; }
	        console.log(address + ' ' + type.toUpperCase() + ' Error: ', message);
	        var error = {
	            status: false,
	            error: message
	        };
	        res.status(status).json(error);
	    };
	    return APIHandler;
	}());
	exports.APIHandler = APIHandler;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var rxjs_1 = __webpack_require__(1);
	var md5 = __webpack_require__(2);
	var AuthAPI = (function () {
	    function AuthAPI(JWT, CRUD) {
	        this.JWT = JWT;
	        this.CRUD = CRUD;
	        this.socialSecret = 'e4901652-9ef1-4e79-abd1-cde058ba51bf';
	    }
	    AuthAPI.prototype.login = function (data) {
	        var _this = this;
	        var response;
	        return new rxjs_1.Observable(function (observer) {
	            data.password = md5(data.password);
	            _this.CRUD.read('users', data).subscribe(function (res) {
	                if (res.length == 1) {
	                    response = {
	                        status: true,
	                        data: _this.JWT.createToken({ user_id: res[0]['id'] })
	                    };
	                    observer.next(response);
	                }
	                else {
	                    observer.error('WRONG_LOGIN');
	                }
	            }, function (err) {
	                observer.error(err);
	            });
	        });
	    };
	    AuthAPI.prototype.register = function (data) {
	        var _this = this;
	        var response;
	        return new rxjs_1.Observable(function (observer) {
	            data.password = md5(data.password);
	            _this.CRUD.read('users', { email: data.email }).subscribe(function (res) {
	                if (!res.length) {
	                    _this.CRUD.createOne('users', data).subscribe(function (res) {
	                        response = {
	                            status: true,
	                            data: _this.JWT.createToken({ user_id: res })
	                        };
	                        observer.next(response);
	                    }, function (err) {
	                        observer.error(err);
	                    });
	                }
	                else {
	                    observer.error('EMAIL_ALREADY_EXISTS');
	                }
	            }, function (err) {
	                observer.error(err);
	            });
	        });
	    };
	    AuthAPI.prototype.loginSocial = function (data) {
	        var _this = this;
	        var response;
	        console.log('loginSocial', data);
	        var filter = {};
	        filter[data['type']] = data['data'];
	        return new rxjs_1.Observable(function (observer) {
	            if (data['secret'] != _this.socialSecret)
	                observer.error('SOURCE_ERROR');
	            _this.CRUD.read('users', filter).subscribe(function (res) {
	                if (res.length == 1) {
	                    response = {
	                        status: true,
	                        data: _this.JWT.createToken({ user_id: data['id'] })
	                    };
	                    observer.next(response);
	                }
	                else if (res.length == 0) {
	                    _this.CRUD.createOne('users', data).subscribe(function (res) {
	                        response = {
	                            status: true,
	                            data: _this.JWT.createToken({ user_id: res })
	                        };
	                        observer.next(response);
	                    }, function (err) {
	                        observer.error(err);
	                    });
	                }
	                else
	                    observer.error('UNKNOWN_ERROR');
	            }, function (err) { return observer.error(err); });
	        });
	    };
	    return AuthAPI;
	}());
	exports.AuthAPI = AuthAPI;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var rxjs_1 = __webpack_require__(1);
	var md5 = __webpack_require__(2);
	var DevicesAPI = (function () {
	    function DevicesAPI(JWT, CRUD) {
	        this.JWT = JWT;
	        this.CRUD = CRUD;
	    }
	    DevicesAPI.prototype.getDevicesList = function (data, user_id) {
	        var _this = this;
	        return new rxjs_1.Observable(function (observer) {
	            _this.CRUD.read('devices', { user_id: user_id }).subscribe(function (devices) {
	                observer.next(devices);
	            }, function (err) {
	                observer.error(err);
	            });
	        });
	    };
	    DevicesAPI.prototype.getDevicesMETA = function (data, user_id) {
	        var _this = this;
	        return new rxjs_1.Observable(function (observer) {
	            _this.CRUD.read('devices_meta', { user_id: user_id }).subscribe(function (devices) {
	                observer.next(devices);
	            }, function (err) {
	                observer.error(err);
	            });
	        });
	    };
	    DevicesAPI.prototype.addDevice = function (data, user_id) {
	        var _this = this;
	        data['user_id'] = user_id;
	        var device_id = data['device_id'];
	        return new rxjs_1.Observable(function (observer) {
	            _this.CRUD.read('devices', { id: device_id }).subscribe(function (devices) {
	                console.log('Found devices', devices);
	                if (devices.length > 0) {
	                    observer.error('LOCKED_DEVICE');
	                }
	                else
	                    _this.CRUD.createOne('devices', data).subscribe(function (devices) {
	                        observer.next(devices);
	                    }, function (err) {
	                        observer.error(err);
	                    });
	            }, function (err) {
	                observer.error(err);
	            });
	        });
	    };
	    DevicesAPI.prototype.updateDeviceMeta = function (data, user_id) {
	        var _this = this;
	        var device_id = data['device_id'];
	        return new rxjs_1.Observable(function (observer) {
	            _this.CRUD.update('devices_meta', { device_id: device_id }, data).subscribe(function (devices) {
	                observer.next(devices);
	            }, function (err) {
	                observer.error(err);
	            });
	        });
	    };
	    DevicesAPI.prototype.updateDevice = function (data, user_id) {
	        var _this = this;
	        var device_id = data['device_id'];
	        return new rxjs_1.Observable(function (observer) {
	            _this.CRUD.update('devices', { device_id: device_id }, data).subscribe(function (devices) {
	                observer.next(devices);
	            }, function (err) {
	                observer.error(err);
	            });
	        });
	    };
	    DevicesAPI.prototype.shareDevice = function (data, user_id) {
	        var _this = this;
	        var device_id = data['device_id'];
	        var share_to = data['share_to'];
	        return new rxjs_1.Observable(function (observer) {
	            _this.CRUD.read('devices', { device_id: device_id }).subscribe(function (devices) {
	                if (devices.length == 0) {
	                    var shared = devices[0]['shared'];
	                    shared.push(share_to);
	                    _this.CRUD.update('devices', { device_id: device_id }, shared).subscribe(function (devices) {
	                        observer.next(devices);
	                    }, function (err) {
	                        observer.error(err);
	                    });
	                }
	                else
	                    observer.error('DEVICE_NOT_FOUND');
	            }, function (err) {
	                observer.error(err);
	            });
	        });
	    };
	    DevicesAPI.prototype.removeDevice = function (data, user_id) {
	        var _this = this;
	        var device_id = data['device_id'];
	        return new rxjs_1.Observable(function (observer) {
	            _this.CRUD.delete('devices', { device_id: device_id }).subscribe(function (res) { return observer.next(); }, function (err) { return observer.error(); });
	        });
	    };
	    return DevicesAPI;
	}());
	exports.DevicesAPI = DevicesAPI;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var rxjs_1 = __webpack_require__(1);
	var RequestHandler = (function () {
	    function RequestHandler() {
	    }
	    RequestHandler.prototype.handle = function (req) {
	        return new rxjs_1.Observable(function (observer) {
	            var hasQuery = false;
	            if (Object.keys(req.query).length)
	                hasQuery = true;
	            var hasBody = false;
	            if (Object.keys(req.body).length)
	                hasBody = true;
	            if (hasBody && !hasQuery)
	                observer.next(req.body);
	            else if (hasQuery && !hasBody)
	                observer.next(req.query);
	            else if (hasQuery && hasBody)
	                observer.next(Object.assign(req.query, req.body));
	            else {
	                observer.next({});
	            }
	        });
	    };
	    return RequestHandler;
	}());
	exports.RequestHandler = RequestHandler;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var rxjs_1 = __webpack_require__(1);
	var md5 = __webpack_require__(2);
	var UserAPI = (function () {
	    function UserAPI(JWT, CRUD) {
	        this.JWT = JWT;
	        this.CRUD = CRUD;
	    }
	    UserAPI.prototype.getUser = function (data, user_id) {
	        var _this = this;
	        return new rxjs_1.Observable(function (observer) {
	            _this.CRUD.read('users', { user_id: user_id }).subscribe(function (devices) {
	                observer.next(devices);
	            }, function (err) {
	                observer.error(err);
	            });
	        });
	    };
	    UserAPI.prototype.updateFamily = function (data, user_id) {
	        var _this = this;
	        var device_id = data['device_id'];
	        var share_to = data['share_to'];
	        return new rxjs_1.Observable(function (observer) {
	            _this.CRUD.update('devices', { user_id: user_id }, { family: data }).subscribe(function (devices) {
	                observer.next(devices);
	            }, function (err) {
	                observer.error(err);
	            });
	        });
	    };
	    UserAPI.prototype.updateUser = function (data, user_id) {
	        var _this = this;
	        return new rxjs_1.Observable(function (observer) {
	            _this.CRUD.update('users', { user_id: user_id }, data).subscribe(function (devices) {
	                observer.next(devices);
	            }, function (err) {
	                observer.error(err);
	            });
	        });
	    };
	    return UserAPI;
	}());
	exports.UserAPI = UserAPI;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {"use strict";
	var jwt_service_1 = __webpack_require__(11);
	var crud_service_1 = __webpack_require__(9);
	var path = __webpack_require__(20);
	var express = __webpack_require__(15);
	var bodyParser = __webpack_require__(13);
	var cookieParser = __webpack_require__(14);
	var api_service_1 = __webpack_require__(3);
	var http = __webpack_require__(17);
	var db_client_1 = __webpack_require__(12);
	var Server = (function () {
	    function Server(globalService) {
	        var _this = this;
	        this.globalService = globalService;
	        this.dbClient = new db_client_1.DBClient(this.globalService);
	        this.dbClient.connect().subscribe(function () {
	            _this.CRUD = new crud_service_1.CRUDService(_this.globalService, _this.dbClient);
	            _this.JWT = new jwt_service_1.JWTService();
	            _this.API = new api_service_1.APIHandler(_this.globalService, _this.dbClient, _this.JWT, _this.CRUD);
	            _this.bootstrap();
	        });
	    }
	    Server.prototype.bootstrap = function () {
	        this.app = express();
	        this.$http = http['Server'](this.app);
	        this.app.use(bodyParser.json());
	        this.app.use(cookieParser());
	        this.app.use(express.static(path.join(__dirname, '../public')));
	        this.globalService.app = this.app;
	        this.JWT.init(this.app);
	        this.API.routes();
	        this.$http.listen(1337, function () {
	            console.log('Server runs at 1337.');
	        });
	    };
	    return Server;
	}());
	exports.Server = Server;
	
	/* WEBPACK VAR INJECTION */}.call(exports, "server"))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var rxjs_1 = __webpack_require__(1);
	var uuid = __webpack_require__(21);
	var CRUDService = (function () {
	    function CRUDService(gs, dbClient) {
	        this.gs = gs;
	        this.dbClient = dbClient;
	    }
	    CRUDService.prototype.read = function (collectionName, filter) {
	        if (filter === void 0) { filter = {}; }
	        var collection = this.dbClient.db.collection(collectionName);
	        return new rxjs_1.Observable(function (observer) {
	            collection.find(filter).toArray(function (err, docs) {
	                if (err)
	                    observer.err('DATABASE_ERROR');
	                observer.next(docs);
	            });
	        });
	    };
	    CRUDService.prototype.create = function (collectionName, data) {
	        var _this = this;
	        return new rxjs_1.Observable(function (observer) {
	            new Promise(function (resolve, reject) {
	                var length = data.length - 1;
	                data.forEach(function (item, index) {
	                    if (!item['id'])
	                        item['id'] = uuid.v4();
	                    if (index === length) {
	                        resolve(data);
	                    }
	                });
	            }).then(function (data) {
	                var collection = _this.dbClient.db.collection(collectionName);
	                collection.insertMany(data, function (err, docs) {
	                    if (err)
	                        observer.err('DATABASE_ERROR');
	                    observer.next(docs);
	                });
	            });
	        });
	    };
	    CRUDService.prototype.createOne = function (collectionName, data) {
	        var _this = this;
	        return new rxjs_1.Observable(function (observer) {
	            if (!data['id'])
	                data['id'] = uuid.v4();
	            var collection = _this.dbClient.db.collection(collectionName);
	            collection.insertOne(data, function (err, docs) {
	                if (err)
	                    observer.err('DATABASE_ERROR');
	                observer.next({ id: data['id'] });
	            });
	        });
	    };
	    CRUDService.prototype.update = function (collectionName, search, set) {
	        var collection = this.dbClient.db.collection(collectionName);
	        return new rxjs_1.Observable(function (observer) {
	            collection.updateMany(search, { $set: set }, function (err, docs) {
	                if (err)
	                    observer.err('DATABASE_ERROR');
	                observer.next(docs);
	            });
	        });
	    };
	    CRUDService.prototype.delete = function (collectionName, search) {
	        var collection = this.dbClient.db.collection(collectionName);
	        return new rxjs_1.Observable(function (observer) {
	            collection.deleteMany(search, function (err, docs) {
	                if (err)
	                    observer.err('DATABASE_ERROR');
	                observer.next(docs);
	            });
	        });
	    };
	    return CRUDService;
	}());
	exports.CRUDService = CRUDService;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	"use strict";
	var GlobalService = (function () {
	    function GlobalService() {
	    }
	    return GlobalService;
	}());
	exports.GlobalService = GlobalService;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var expressJwt = __webpack_require__(16);
	var jwt = __webpack_require__(18);
	exports.secret = '0f952eb0-5da5-45ad-8971-a9b15f9db6db';
	var UNAUTHORIZED_PATHS = [
	    '/favicon.ico',
	    '/v1/auth/login',
	    '/v1/auth/register',
	    '/v1/auth/login-social',
	    '/v1/auth/forgot-password'
	];
	var JWTService = (function () {
	    function JWTService() {
	    }
	    JWTService.prototype.init = function (app) {
	        console.log('JwT initiated with secret: ' + exports.secret);
	        app.use(expressJwt({ secret: exports.secret }).unless({ path: UNAUTHORIZED_PATHS }));
	        this.handleError(app);
	    };
	    JWTService.prototype.handleError = function (app) {
	        app.use(function (err, req, res, next) {
	            if (err.name === 'UnauthorizedError') {
	                var response = {
	                    status: false,
	                    error: 'UNAUTHORIZED'
	                };
	                res.status(401).send(response);
	            }
	        });
	    };
	    JWTService.prototype.createToken = function (data) {
	        var token = jwt.sign(data, exports.secret);
	        return token;
	    };
	    return JWTService;
	}());
	exports.JWTService = JWTService;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var rxjs_1 = __webpack_require__(1);
	var MongoClient = __webpack_require__(19).MongoClient;
	var url = 'mongodb://localhost:27017/bt';
	var DBClient = (function () {
	    function DBClient(globalService) {
	        this.globalService = globalService;
	        this.db = this.globalService.DBClient;
	    }
	    DBClient.prototype.connect = function () {
	        var _this = this;
	        console.log('Connecting to db..');
	        return new rxjs_1.Observable(function (observer) {
	            MongoClient.connect(url, function (err, db) {
	                if (!err) {
	                    _this.db = db;
	                    console.log("Connected successfully to MongoDB server.");
	                    observer.next();
	                }
	                else {
	                    console.log("Error connecting to server: ", err);
	                    observer.error();
	                }
	            });
	        });
	    };
	    DBClient.prototype.disconnect = function () {
	        this.db.close();
	    };
	    return DBClient;
	}());
	exports.DBClient = DBClient;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = require("body-parser");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	module.exports = require("cookie-parser");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	module.exports = require("express");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = require("express-jwt");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = require("http");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	module.exports = require("jsonwebtoken");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	module.exports = require("mongodb");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	module.exports = require("path");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = require("uuid");

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map