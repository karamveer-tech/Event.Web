import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { StaticPageComponent } from './pages/static-page/static-page.component';

const routes: Routes = [
  // Dynamic routes with components loaded lazily
  {
    path: 'event-details',
    loadComponent: () => import('./event-details/event-details.component').then(m => m.EventDetailsComponent)
  },
  {
    path: 'event',
    loadComponent: () => import('./events/events.component').then(m => m.EventsComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./index/index.component').then(m => m.IndexComponent)
  },
  {
    path: '',
    loadComponent: () => import('./index/index.component').then(m => m.IndexComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'edit-event/:id', 
    loadComponent: () => import('./event-create-modal/event-create-modal.component').then(m => m.EventCreateModalComponent)
  },
  // Static HTML routes using StaticPageComponent
  { path: 'about', component: StaticPageComponent, data: { htmlFile: 'about' } },
  { path: 'apps-download', component: StaticPageComponent, data: { htmlFile: 'apps-download' } },
  { path: 'blog', component: StaticPageComponent, data: { htmlFile: 'blog' } },
  { path: 'blog-2', component: StaticPageComponent, data: { htmlFile: 'blog-2' } },
  { path: 'blog-details', component: StaticPageComponent, data: { htmlFile: 'blog-details' } },
  { path: 'contact', component: StaticPageComponent, data: { htmlFile: 'contact' } },
  { path: 'dashboard2', component: StaticPageComponent, data: { htmlFile: 'dasboard' } },
  { path: 'events', component: StaticPageComponent, data: { htmlFile: 'events' } },
  { path: 'event-checkout', component: StaticPageComponent, data: { htmlFile: 'event-checkout' } },
  { path: 'event-details2', component: StaticPageComponent, data: { htmlFile: 'event-details' } },
  { path: 'event-ticket', component: StaticPageComponent, data: { htmlFile: 'event-ticket' } },
  { path: 'faq', component: StaticPageComponent, data: { htmlFile: 'faq' } },
  { path: 'forgot-password', component: StaticPageComponent, data: { htmlFile: 'forgot-password' } },
  { path: 'index', component: StaticPageComponent, data: { htmlFile: 'index' } },
  { path: 'index-2', component: StaticPageComponent, data: { htmlFile: 'index-2' } },
  { path: 'index-3', component: StaticPageComponent, data: { htmlFile: 'index-3' } },
  { path: 'login', component: StaticPageComponent, data: { htmlFile: 'login' } },
  { path: 'movie-checkout', component: StaticPageComponent, data: { htmlFile: 'movie-checkout' } },
  { path: 'movie-details', component: StaticPageComponent, data: { htmlFile: 'movie-details' } },
  { path: 'movie-details-2', component: StaticPageComponent, data: { htmlFile: 'movie-details-2' } },
  { path: 'movie-food', component: StaticPageComponent, data: { htmlFile: 'movie-food' } },
  { path: 'movie-grid', component: StaticPageComponent, data: { htmlFile: 'movie-grid' } },
  { path: 'movie-list', component: StaticPageComponent, data: { htmlFile: 'movie-list' } },
  { path: 'movie-seat-plan', component: StaticPageComponent, data: { htmlFile: 'movie-seat-plan' } },
  { path: 'movie-ticket-plan', component: StaticPageComponent, data: { htmlFile: 'movie-ticket-plan' } },
  { path: 'pricing', component: StaticPageComponent, data: { htmlFile: 'pricing' } },
  { path: 'privacy-policy', component: StaticPageComponent, data: { htmlFile: 'privacy-policy' } },
  { path: 'register', component: StaticPageComponent, data: { htmlFile: 'register' } },
  { path: 'sport-details', component: StaticPageComponent, data: { htmlFile: 'sport-details' } },
  { path: 'sports', component: StaticPageComponent, data: { htmlFile: 'sports' } },
  { path: 'sports-checkout', component: StaticPageComponent, data: { htmlFile: 'sports-checkout' } },
  { path: 'sports-ticket', component: StaticPageComponent, data: { htmlFile: 'sports-ticket' } },
  { path: 'team', component: StaticPageComponent, data: { htmlFile: 'team' } },
  { path: 'term-condition', component: StaticPageComponent, data: { htmlFile: 'term-condition' } },
  { path: 'not-found', component: StaticPageComponent, data: { htmlFile: '404' } },

  // Wildcard route (must be last)
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
