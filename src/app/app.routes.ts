import { Routes } from '@angular/router';

export const routes: Routes = [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then( m => m.HomeComponent)
      },
      {
        path: 'ai',
        loadComponent: () => import('./pages/ai/ai.component').then( m => m.AiComponent)
      },
      {
        path: 'user',
        loadComponent: () => import('./pages/user/user.component').then( m => m.UserComponent)
      },
];
