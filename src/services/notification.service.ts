import { Server } from 'socket.io';
import { Global, Injectable, Logger } from '@nestjs/common';
import { ClientMap } from '@common/utils/ClientConnection';

@Global()
@Injectable()
export class NotificationService  {
    logger: Logger = new Logger("NotificationService");

    private static _server: Server;
    public static _clients: ClientMap = new ClientMap();
    
    constructor() {}

    public get clients(): ClientMap {
        return NotificationService._clients;
    }

    public get server(): Server {
        return NotificationService._server;
    }

    public initialize(server: Server) {
        NotificationService._server = NotificationService._server ?? server;
        this.logger.log("initialized");
    }

    public notify<T>(notification: T) {
        const topic = notification.constructor.name;

        this.clients.all().forEach(client => client.emit(topic, notification))
        this.logger.log("notified:  " + topic)
    }

    public notifyUser(userId: string, event: string, body: any) {
        const sockets = this.clients.getSockets(userId);

        sockets.forEach(socket => socket.emit(event, body));
    }

    public notifyApp(appID: string, event: string, body: any) {
        const socket = this.clients.getSocket(appID);

        socket.emit(event, body);
    }
}