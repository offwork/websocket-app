import { Injectable } from '@angular/core';
import { StompService } from "@stomp/ng2-stompjs";

import * as SockJS from 'sockjs-client';

export function receiverProvider() {
    return new SockJS('http://192.168.0.103:8080/register');
}

@Injectable()
export class ReceiverStompService extends StompService {}

export function receiverStompServiceFactory() {
    return new ReceiverStompService({
        url: receiverProvider,
        headers: {
            login: "guest",
            passcode: "guest"
        },
        heartbeat_in: 0,
        heartbeat_out: 19000,
        reconnect_delay: 5000,
        debug: true
    });
}
