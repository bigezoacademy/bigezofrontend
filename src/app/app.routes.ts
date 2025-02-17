import { Routes } from '@angular/router';
import { ContactComponent } from './pages/contact/contact.component';
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
import { TransactionsComponent } from './pages/sidenav-functions/transactions/transactions.component';
import { SchoolfeesComponent } from './pages/sidenav-functions/schoolfees/schoolfees.component';
import { RequirementsdefaultersComponent } from './pages/sidenav-functions/requirementsdefaulters/requirementsdefaulters.component';
import { PhotosComponent } from './pages/sidenav-functions/photos/photos.component';

export const routes: Routes = [
   // Public route
  { path: '', component: GeneralLayoutComponent,
    children:[
      { path: '', component: HomeComponent },
      { path: 'contact', component: ContactComponent }, // Public route
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
      {path:'transactions',
        component:TransactionsComponent,
        canActivate:[authGuard],
        data:{role:['ROLE_ADMIN','ROLE_USER','ROLE_TEACHER']}
      },
      {path:'newrequirement',
        component:NewRequirementComponent,
        canActivate:[authGuard],
        data:{role:'ROLE_ADMIN'}
      },
      {path:'requirementsdefaulters',
        component:RequirementsdefaultersComponent,
        canActivate:[authGuard],
        data:{role:'ROLE_ADMIN'}
      },
      {path:'schoolfees',
        component:SchoolfeesComponent,
        canActivate:[authGuard],
        data:{role:['ROLE_ADMIN','ROLE_USER']}
      },
      {
        path: 'pay',
        component: PayComponent,
        canActivate: [authGuard],
        data: { role: 'ROLE_USER' } // Only students can access
      },
      {
        path: 'photos',
        component: PhotosComponent,
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
