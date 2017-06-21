import {Injectable, EventEmitter} from "@angular/core";
export interface Notification {
    message: string;
    header?: string;
    link?: string;
}
@Injectable()
export class NotificationsService{
    public message: EventEmitter<Notification>;
    constructor(){
        this.message = new EventEmitter<Notification>();
    }

    showMessage(message, header = 'COMMON.NOTIFICATION', link = null){
        console.log('notificationsService showMessage()', message, header);
        let data: Notification = {message:message, header:header, link: link};
        this.message.emit(data);        
    }
}
