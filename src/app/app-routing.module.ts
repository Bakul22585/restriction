import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import {AuthComponent} from './auth/auth.component';

const routes: Routes = [
    {
        path: '',
        loadChildren: './auth/auth.module#AuthModule'
    },
    {
        path: 'resetpassword/:id',
        loadChildren: './auth/auth.module#AuthModule'
    }
    /*{
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    }*/
];
@NgModule({
  imports: [
      RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
