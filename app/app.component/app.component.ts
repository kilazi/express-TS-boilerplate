import { Component, Directive, ElementRef, Renderer } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'body',
  styles: [require('./app.component.scss')],
  template: require('./app.component.html')
})
export class AppComponent {}
