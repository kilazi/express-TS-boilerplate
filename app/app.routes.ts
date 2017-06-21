import {Route} from '@angular/router';
import {AuthGuard} from './common/authGuard/authGuard';
import {HomeComponent} from './home.component/home.component';
export const routes: Route[] = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: '**', redirectTo: 'login' }
];
