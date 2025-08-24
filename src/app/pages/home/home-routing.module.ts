import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { DashboardPage } from './home.dashboard';

const routes: Routes = [
  { path: '',         component: HomePage      },  // matches “/”
  { path: 'dashboard', component: DashboardPage }   // matches “/dashboard”
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
