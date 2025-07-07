// PrimeNg
import { CarouselModule } from 'primeng/carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button'; 
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';


import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { LoginComponent } from './authentications/login/login.component';
import { RegisterComponent } from './authentications/register/register.component';
import { InstructorRegisterComponent } from './authentications/instructor-register/instructor-register.component';
import { PanelLoginComponent } from './authentications/panel-login/panel-login.component';
import { LandingComponent } from './layouts/landing/landing.component';
import { CoursesViewComponent } from './courses/courses-view/courses-view.component';
import { InfoItemComponent } from './layouts/info-item/info-item.component';
import { BooksViewComponent } from './books/books-view/books-view.component';
import { BlogViewComponent } from './blog/blog-view/blog-view.component';
import { HeaderItemComponent } from './layouts/header-item/header-item.component';
import { CourseViewComponent } from './courses/course-view/course-view.component';
import { NewsViewComponent } from './news/news-view/news-view.component';
import { CustomerServiceComponent } from './help/customer-service/customer-service.component';
import { CartComponent } from './purchase/cart/cart.component';
import { PolicyComponent } from './help/policy/policy.component';
import { PurchaseDetailsComponent } from './purchase/purchase-details/purchase-details.component';
import { ProfileEditComponent } from './authentications/profile-edit/profile-edit.component';
import { ResetPasswordComponent } from './authentications/reset-password/reset-password.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    InstructorRegisterComponent,
    PanelLoginComponent,
    LandingComponent,
    CoursesViewComponent,
    InfoItemComponent,
    BooksViewComponent,
    BlogViewComponent,
    HeaderItemComponent,
    CourseViewComponent,
    NewsViewComponent,
    CustomerServiceComponent,
    CartComponent,
    PolicyComponent,
    PurchaseDetailsComponent,
    ProfileEditComponent,
    ResetPasswordComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    CarouselModule,
    ButtonModule,
    TagModule,
    RatingModule,
    CardModule,
    OverlayPanelModule,
    TooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
