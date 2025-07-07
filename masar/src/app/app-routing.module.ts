import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentications/login/login.component';
import { RegisterComponent } from './authentications/register/register.component';
import { InstructorRegisterComponent } from './authentications/instructor-register/instructor-register.component';
import { PanelLoginComponent } from './authentications/panel-login/panel-login.component';
import { LandingComponent } from './layouts/landing/landing.component';
import { CoursesViewComponent } from './courses/courses-view/courses-view.component';
import { BooksViewComponent } from './books/books-view/books-view.component';
import { BlogViewComponent } from './blog/blog-view/blog-view.component';
import { CourseViewComponent } from './courses/course-view/course-view.component';
import { NewsViewComponent } from './news/news-view/news-view.component';
import { CustomerServiceComponent } from './help/customer-service/customer-service.component';
import { CartComponent } from './purchase/cart/cart.component';
import { PolicyComponent } from './help/policy/policy.component';
import { PurchaseDetailsComponent } from './purchase/purchase-details/purchase-details.component';
import { ProfileEditComponent } from './authentications/profile-edit/profile-edit.component';
import { ResetPasswordComponent } from './authentications/reset-password/reset-password.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'instructor-register',component:InstructorRegisterComponent},
  {path:'panel-login',component:PanelLoginComponent},
  {path:'courses',component:CoursesViewComponent},
  {path:'course',component:CourseViewComponent},
  {path:'books',component:BooksViewComponent},
  {path:'blog',component:BlogViewComponent},
  {path:'news',component:NewsViewComponent},
  {path:'main',component:LandingComponent},
  {path:'help',component:CustomerServiceComponent},
  {path:'policy',component:PolicyComponent},
  {path:'cart',component:CartComponent},
  {path:'purchase',component:PurchaseDetailsComponent},
  {path:'profile',component:ProfileEditComponent},
  {path:'reset-password',component:ResetPasswordComponent},
  {path:'',redirectTo:'main',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
