import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Home1Component } from './home1/home1.component';
import { SigninComponent } from './signin/signin.component';
import { FooterComponent } from './footer/footer.component';
import { Home2Component } from './home2/home2.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MoviesComponent } from './movies/movies.component';
import { TvshowsComponent } from './tvshows/tvshows.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { LoginHelpComponent } from './login-help/login-help.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DemoComponent } from './demo/demo.component';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';
import { BrowseByLangComponent } from './browse-by-lang/browse-by-lang.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AccountComponent } from './account/account.component';
import { ViewcontentComponent } from './viewcontent/viewcontent.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { ManageprofileComponent } from './manageprofile/manageprofile.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { NewprofileComponent } from './newprofile/newprofile.component';
import { MatSelectModule } from '@angular/material/select';

import { SearchComponent } from './search/search.component';

import { SignupComponent } from './signup/signup.component';
import { PasswordPipe } from './password.pipe';
import { CustomdatePipe } from './customdate.pipe';
import { UpdateEmailDialogComponent } from './update-email-dialog/update-email-dialog.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CardnumberPipe } from './cardnumber.pipe';
import { CardtypePipe } from './cardtype.pipe';
import { ChangePhoneNumberDialogComponent } from './change-phone-number-dialog/change-phone-number-dialog.component';
import { PlayerComponent } from './player/player.component';
import { NewpopularComponent } from './newpopular/newpopular.component';
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';
import { AccessGuard } from 'src/guards/accessGuards';

@NgModule({
  declarations: [
    AppComponent,
    Home1Component,
    SigninComponent,
    FooterComponent,
    Home2Component,
    HeaderComponent,
    MoviesComponent,
    TvshowsComponent,
    DashboardComponent,
    LoginHelpComponent,
    PageNotFoundComponent,
    DemoComponent,
    BrowseByLangComponent,
    AccountComponent,
    ViewcontentComponent,
    ProfilesComponent,
    WatchlistComponent,
    ManageprofileComponent,
    SpinnerComponent,
    EditprofileComponent,
    NewprofileComponent,
    SearchComponent,
    SignupComponent,
    PasswordPipe,
    CustomdatePipe,
    UpdateEmailDialogComponent,
    ChangePasswordDialogComponent,
    CardnumberPipe,
    CardtypePipe,
    ChangePhoneNumberDialogComponent,
    PlayerComponent,
    NewpopularComponent,
    NotificationDialogComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgImageSliderModule,
    NgxUsefulSwiperModule,
    MatTabsModule,
    HttpClientModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    NgxSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatAutocompleteModule
    
  ],
  exports:[
    NgxSpinnerModule
  ],
  providers: [
    AccessGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
