import {Routes} from '@angular/router';
import {TransactionsComponent} from './transactions/transactions.component';
import {InputPageComponent} from './input-page/input-page.component';
import {MaterialTabsTestComponent} from './material-tabs-test/material-tabs-test.component';
import {ColorToggleComponent} from './color-toggle/color-toggle.component';

/**
 * The routes configuration for the application.
 *
 * This object defines the routes for the Angular application. Each route is an object with a 'path' and a 'component'.
 * The 'path' is a string that specifies the URL path for the route.
 * The 'component' is a component type that the router should instantiate when navigating to this route.
 *
 * @type {Routes}
 *
 * @property {Array} routes - An array of route objects for the application.
 *
 * @property {Object} routes[0] - The route for the root path (''). It uses the 'InputPageComponent'.
 *
 * @property {Object} routes[1] - The route for the 'transactions' path. It uses the 'TransactionsComponent'.
 *
 * @property {Object} routes[2] - The route for the 'transactions-dark' path. It uses the 'TransactionsDarkComponent'.
 *
 * @property {Object} routes[3] - The route for the 'material-tabs-test' path. It uses the 'MaterialTabsTestComponent'.
 *
 * @property {Object} routes[4] - The route for the 'color-toggle' path. It uses the 'ColorToggleComponent'.
 */

export const routes: Routes = [
  {path: '', component: InputPageComponent},
  {path: 'transactions', component: TransactionsComponent},
  {path: 'material-tabs-test', component: MaterialTabsTestComponent},
  {path: 'color-toggle', component: ColorToggleComponent},
];
