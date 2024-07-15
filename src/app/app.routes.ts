import {Routes} from '@angular/router';
import {TransactionsComponent} from './transactions/transactions.component';
import {InputPageComponent} from './input-page/input-page.component';
import {MaterialTabsTestComponent} from './material-tabs-test/material-tabs-test.component';
import {ColorToggleComponent} from './color-toggle/color-toggle.component';

export const routes: Routes = [
  {path: '', component: InputPageComponent},
  {path: 'transactions', component: TransactionsComponent},
  {path: 'material-tabs-test', component: MaterialTabsTestComponent},
  {path: 'color-toggle', component: ColorToggleComponent},
];
