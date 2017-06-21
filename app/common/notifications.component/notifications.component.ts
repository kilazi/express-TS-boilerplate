import { Router } from '@angular/router';
import { Notification } from './../notifications.service';
import {Component, OnInit} from "@angular/core";
import {NotificationsService} from "../notifications.service";

@Component({
    selector: 'notifications',
    template: require('./notifications.component.html'),
    styles: [require('./notifications.component.scss')]
})
export class NotificationsComponent implements OnInit{
    constructor(
        private notificationService: NotificationsService,
        private router: Router
        ){
    }
    ngOnInit(){
        this.notificationService.message.subscribe(
            res => {
                this.showMessage(res);
            }
        )
    }
    showMessage(data: Notification){
        let $this = this;
        var error = document.createElement('DIV');
        error.classList.add('notification', 'error', 'ns-box' , 'ns-growl' , 'ns-effect-genie' , 'ns-type-notice',  'ns-show');
        error.innerHTML = `
            <div class="ns-box-inner">
                <p>
                   ${data['header']}
                   <br />
                   ${data['message']}
                </p>
            </div>
        <span class="ns-close"></span>
        `;
        document.getElementById('notifications_container').appendChild(error);
        error.addEventListener('click', function () {
            if (data.link && data.link.length)
                $this.router.navigateByUrl(data.link); 
            else
                this.remove();
        })
        setTimeout(() => {
            error.remove();
        }, 3500);
    }
}