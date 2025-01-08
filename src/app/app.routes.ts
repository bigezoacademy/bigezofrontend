import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TermsComponent } from './pages/terms/terms.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { AdminComponent } from './pages/admin/admin.component';
import { HomeComponent } from './pages/home/home.component';
import { StudentComponent } from './pages/student/student.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path:'',
       component:HomeComponent
    },
    {
        path:'terms',
       component:TermsComponent
    },
    {
        path:'',
       component:LayoutComponent,
       children:[
        {
            path:'admin',
           component:AdminComponent,
           canActivate:[authGuard]
        },
        {
            path:'student',
           component:StudentComponent,
           canActivate:[authGuard]
        },
       ]
    },
];
