import {Routes} from '@angular/router';
import {InputPageComponent} from './input-page/input-page.component';
import {MaterialTabsTestComponent} from './material-tabs-test/material-tabs-test.component';


export const routes: Routes = [
  {path: '', component: InputPageComponent},
  {path: 'material-tabs-test', component: MaterialTabsTestComponent},
];
