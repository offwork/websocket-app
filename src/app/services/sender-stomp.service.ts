import { Injectable } from '@angular/core';
import { StompService } from "@stomp/ng2-stompjs";

import * as SockJS from 'sockjs-client';

export function senderProvider() {
    return new SockJS('http://192.168.0.110:8080/register');
}

@Injectable()
export class SenderStompService extends StompService {}

export function senderStompServiceFactory() {
    return new SenderStompService({
        url: senderProvider,
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