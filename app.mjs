"use strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import express from "express";
import cookieParser from 'cookie-parser';
import { PageSrv } from "@ejfdelgado/ejflab-back/srv/PageSrv.mjs";
import { cors, commonHeaders, handleErrorsDecorator, handleErrors } from "@ejfdelgado/ejflab-back/srv/Network.mjs";
import { MainHandler } from "@ejfdelgado/ejflab-back/srv/MainHandler.mjs";
import { checkAuthenticated, checkAuthenticatedSilent } from "@ejfdelgado/ejflab-back/srv/common/FirebasConfig.mjs";
import { MyFileService } from "@ejfdelgado/ejflab-back/srv/MyFileService.mjs";
import https from 'https'
import http from 'http'
import compression from 'compression';
import { Server } from "socket.io";
import { TupleSrv } from "@ejfdelgado/ejflab-back/srv/TupleSrv.mjs";
import { AuthorizationSrv } from "@ejfdelgado/ejflab-back/srv/AuthorizationSrv.mjs";
import { UtilesSrv } from "@ejfdelgado/ejflab-back/srv/UtilesSrv.mjs";
import { KeysSrv } from "@ejfdelgado/ejflab-back/srv/KeysSrv.mjs";
import { Usuario } from "@ejfdelgado/ejflab-back/srv/common/Usuario.mjs";
import { SecretsSrv } from "@ejfdelgado/ejflab-back/srv/SecretsSrv.mjs";

import { MyFileServiceLocal } from "@ejfdelgado/ejflab-back/srv/MyFileServiceLocal.mjs";
import { EmailHandler } from "@ejfdelgado/ejflab-back/srv/EmailHandler.mjs";
import { SocketIOCall } from "@ejfdelgado/ejflab-back/srv/SocketIOCall.mjs";

import { MyConstants } from "@ejfdelgado/ejflab-common/src/MyConstants.js";
import { APDLearnSrv } from "./srv/APDLearnSrv.mjs";

// Overwrite constants
MyConstants.overwriteEnvVariables();

const options = {}
let httpSrv = http;
if (process.env.USE_SECURE == "yes") {
    console.log("Using secure server...");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    options.key = fs.readFileSync(path.join(__dirname, "cert/star_xx_com.key"));
    options.cert = fs.readFileSync(path.join(__dirname, "cert/star_xx_com.pem"));
    options.minVersion = "TLSv1.3"; //Try 1.3 or 1.2
    httpSrv = https;
}

const app = express();
const httpServer = httpSrv.createServer(options, app);
//const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    },
    cors: {
        //origin: "http://localhost:4200",
        origin: "*",
        methods: ["GET", "POST", "DELETE"],
    }
});

app.use(cors);
app.use(cookieParser());
app.use(compression());
//app.use(compression({ level: 0 })); 
/*
app.use(bodyParser.urlencoded({extended: true}));
*/
//app.use(bodyParser.raw());
app.use(MainHandler.addGetUrl);
app.use('/assets', express.static('src/assets', {
    etag: false,
    maxAge: '' + (1000 * 60 * 60 * 24)
}));

app.post("/srv/email/send", [commonHeaders, checkAuthenticatedSilent, express.json(), handleErrorsDecorator(EmailHandler.send)]);

app.post('/srv/sec/r', [commonHeaders, checkAuthenticated, express.json(), handleErrorsDecorator(SecretsSrv.read)]);
app.post('/srv/sec/w', [commonHeaders, checkAuthenticated, express.json(), handleErrorsDecorator(SecretsSrv.save)]);
app.post('/srv/sec/pub', [commonHeaders, checkAuthenticated, express.json(), handleErrorsDecorator(SecretsSrv.getPubKey)]);

app.get('/srv/usr/me', [commonHeaders, checkAuthenticated, handleErrorsDecorator(Usuario.getCurrentUser)]);
app.post('/srv/usr/me', [commonHeaders, checkAuthenticated, express.json(), handleErrorsDecorator(MyFileService.uploadFile), handleErrorsDecorator(Usuario.saveMyUser)]);
app.get('/srv/date', [commonHeaders, handleErrorsDecorator(UtilesSrv.fecha)]);
app.get('/srv/pg/:pageType/:idUser/:pageId/*', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["fil_r"]]), handleErrorsDecorator(MyFileService.readFile)]);
app.delete('/srv/pg/:pageType/:idUser/:pageId/*', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["fil_w"]]), handleErrorsDecorator(MyFileService.deleteFile)]);
app.get('/srv/pg', [commonHeaders, checkAuthenticatedSilent, express.json(), handleErrorsDecorator(PageSrv.getCurrentPage)]);
app.post('/srv/pg/new', [commonHeaders, checkAuthenticatedSilent, express.json(), handleErrorsDecorator(PageSrv.createNewPage)]);
app.get('/srv/pg/mines', [commonHeaders, checkAuthenticated, express.json(), handleErrorsDecorator(PageSrv.iterateMyPages)]);
app.get('/srv/pg/all', [commonHeaders, checkAuthenticatedSilent, express.json(), handleErrorsDecorator(PageSrv.iterateAllPages)]);
app.get('/srv/:pageId/keys', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["tup_r"]]), handleErrorsDecorator(KeysSrv.getPageKeys)]);
app.post('/srv/:pageId/pg', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["pg_w"]]), express.json(), handleErrorsDecorator(MyFileService.uploadFile), handleErrorsDecorator(PageSrv.savePage)]);
app.delete('/srv/:pageId/pg', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["pg_w"]]), express.json(), handleErrorsDecorator(PageSrv.deletePage)]);
app.post('/srv/:pageId/rotate1', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["pg_w"]]), express.json(), handleErrorsDecorator(PageSrv.rotateSecret1)]);
app.post('/srv/:pageId/rotate2', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["pg_w"]]), express.json(), handleErrorsDecorator(PageSrv.rotateSecret2)]);
app.post('/srv/:pageId/rotate3', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["pg_w"]]), express.json(), handleErrorsDecorator(PageSrv.rotateSecret3)]);
app.get('/srv/:pageId/tup', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["tup_r"]]), handleErrorsDecorator(TupleSrv.read)]);
app.post('/srv/:pageId/tup', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["tup_w"]]), express.json(), handleErrorsDecorator(TupleSrv.save)]);
app.delete('/srv/:pageId/tup', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["tup_w"]]), express.json(), handleErrorsDecorator(TupleSrv.deleteAll)]);
app.get('/srv/:pageId/auth', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["per_r"]]), handleErrorsDecorator(AuthorizationSrv.readAll)]);
app.post('/srv/:pageId/auth', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["per_w"]]), express.json(), handleErrorsDecorator(AuthorizationSrv.save)]);
app.post('/srv/:pageId/file', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["fil_w"]]), express.json(), handleErrorsDecorator(MyFileService.uploadFile), MyFileService.uploadFileResponse]);
app.post('/srv/:pageId/makefilepub', [commonHeaders, checkAuthenticatedSilent, AuthorizationSrv.hasPagePermisions([["fil_w"]]), express.json(), handleErrorsDecorator(MyFileService.setFilePublicSrv)]);

app.post('/srv/:pageType/:pageId/localfile', [commonHeaders, checkAuthenticatedSilent, express.json(), handleErrorsDecorator(MyFileServiceLocal.uploadFile)]);
app.delete('/srv/:pageType/:pageId/localfile/*', [commonHeaders, checkAuthenticatedSilent, handleErrorsDecorator(MyFileServiceLocal.deleteFile)]);
app.get('/srv/:pageType/:pageId/localfile/*', [commonHeaders, checkAuthenticatedSilent, handleErrorsDecorator(MyFileServiceLocal.readFile)]);

app.post('/srv/:pageType/:pageId/localtuple.json', [commonHeaders, checkAuthenticatedSilent, express.json(), handleErrorsDecorator(MyFileServiceLocal.uploadFile)]);
app.delete('/srv/:pageType/:pageId/localtuple.json', [commonHeaders, checkAuthenticatedSilent, handleErrorsDecorator(MyFileServiceLocal.deleteFile)]);
app.get('/srv/:pageType/:pageId/localtuple.json', [commonHeaders, checkAuthenticatedSilent, handleErrorsDecorator(MyFileServiceLocal.readFile)]);

app.post('/srv/:pageType/:pageId/localpage.json', [commonHeaders, checkAuthenticatedSilent, express.json(), handleErrorsDecorator(MyFileServiceLocal.uploadFile)]);
app.delete('/srv/:pageType/:pageId/localpage.json', [commonHeaders, checkAuthenticatedSilent, handleErrorsDecorator(MyFileServiceLocal.deleteFile)]);
app.get('/srv/:pageType/:pageId/localpage.json', [commonHeaders, checkAuthenticatedSilent, handleErrorsDecorator(MyFileServiceLocal.readFile)]);


// Configure wideSight api
APDLearnSrv.configure(app);

app.use("/", handleErrorsDecorator(MainHandler.handle));// Esto solo funciona sin el npm run angular

io.on('connection', SocketIOCall.handle(io));

// fuser 8081/tcp
// fuser -k 8081/tcp
const PORT = process.env.PORT || 8081;
httpServer.listen(PORT, () => {
    console.log(
        `App listening on http://localhost:${PORT} Press Ctrl+C to quit.`
    );
});

export default app;
