import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TermsComponent } from './pages/terms/terms.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { AdminComponent } from './pages/admin/admin.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guard/auth.guard';
import { GeneralLayoutComponent } from './pages/general-layout/general-layout.component';
import { RequirementsComponent } from './pages/sidenav-functions/requirements/requirements.component';
import { NewRequirementComponent } from './pages/sidenav-functions/newrequirement/newrequirement.component';
import { NewStudentComponent } from './pages/sidenav-functions/newstudent/newstudent.component';
import { StudentComponent } from './pages/sidenav-functions/student/student.component';
import { PayComponent } from './pages/sidenav-functions/pay/pay.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Public route
  { path: '', component: GeneralLayoutComponent,
    children:[
      { path: 'terms', component: TermsComponent }, // Public route
    ]
   },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path:'requirements',
        component:RequirementsComponent,
        canActivate:[authGuard],
        data:{role:['ROLE_ADMIN','ROLE_USER','ROLE_TEACHER']}
      },
      {path:'newrequirement',
        component:NewRequirementComponent,
        canActivate:[authGuard],
        data:{role:'ROLE_ADMIN'}
      },
      {
        path: 'pay',
        component: PayComponent,
        canActivate: [authGuard],
        data: { role: 'ROLE_USER' } // Only students can access
      },
      
      {path:'student',
        component:StudentComponent,
        canActivate:[authGuard],
        data:{role:['ROLE_ADMIN','ROLE_USER','ROLE_TEACHER']}
      },
      {path:'newstudent',
        component: NewStudentComponent,
        canActivate:[authGuard],
        data:{role:'ROLE_ADMIN'}
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [authGuard],
        data: { role: 'ROLE_ADMIN' }, // Required role
      }
    ],
  },
  { path: '**', redirectTo: '' }, // Catch-all for unknown routes
];
