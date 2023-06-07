import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { Home1Component } from './home1/home1.component';
import { Home2Component } from './home2/home2.component';
import { TvshowsComponent } from './tvshows/tvshows.component';
import { MoviesComponent } from './movies/movies.component';
import { LoginHelpComponent } from './login-help/login-help.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DemoComponent } from './demo/demo.component';
import { BrowseByLangComponent } from './browse-by-lang/browse-by-lang.component';
import { AccountComponent } from './account/account.component';
import { ViewcontentComponent } from './viewcontent/viewcontent.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { ManageprofileComponent } from './manageprofile/manageprofile.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { NewprofileComponent } from './newprofile/newprofile.component';
import { SignupComponent } from './signup/signup.component';
import { SearchComponent } from './search/search.component';
import { PlayerComponent } from './player/player.component';
import { NewpopularComponent } from './newpopular/newpopular.component';
import { AccessGuard } from 'src/guards/accessGuards';


const routes: Routes = [
  { path: "", component: Home1Component },
  { path: "home1", component: Home1Component },
  { path: 'signin', component: SigninComponent },
  { path: 'signup/:email', component: SignupComponent },
  { path: 'home2', component: Home2Component, canActivate: [AccessGuard] },
  { path: 'movies', component: MoviesComponent, canActivate: [AccessGuard] },
  { path: 'tvshows', component: TvshowsComponent, canActivate: [AccessGuard] },
  { path: 'browseByLang', component: BrowseByLangComponent, canActivate: [AccessGuard] },
  { path: 'loginHelp', component: LoginHelpComponent },
  { path: "title/:id", component: ViewcontentComponent, canActivate: [AccessGuard] },
  { path: "account", component: AccountComponent, canActivate: [AccessGuard] },
  { path: "profiles", component: ProfilesComponent, canActivate: [AccessGuard] },
  { path: "watchlist", component: WatchlistComponent, canActivate: [AccessGuard] },
  { path: "manage", component: ManageprofileComponent, canActivate: [AccessGuard] },
  { path: "edit/:id", component: EditprofileComponent, canActivate: [AccessGuard] },
  { path: "newprofile", component: NewprofileComponent, canActivate: [AccessGuard] },
  // { path: "search", component: SearchComponent },
  { path: "play/:id", component: PlayerComponent, canActivate: [AccessGuard] },
  { path: "latest", component: NewpopularComponent, canActivate: [AccessGuard] },

  { path: 'demo', component: DemoComponent },
  {
    path: '**', pathMatch: 'full',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
