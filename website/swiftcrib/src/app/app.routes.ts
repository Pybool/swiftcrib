import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { OtpAuthorizeComponent } from './pages/otp-authorize/otp-authorize.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterAgentComponent } from './pages/register-agent/register-agent.component';
import { DashboardComponent } from './pages/DashboardPages/dashboard/dashboard.component';
import { DashboardMainComponent } from './pages/DashboardPages/dashboard-main/dashboard-main.component';
import { NoListingsComponent } from './pages/DashboardPages/no-listings/no-listings.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { BookmarksComponent } from './pages/bookmarks/bookmarks.component';
import { PropertyDetailsComponent } from './pages/property-details/property-details.component';
import { ShareModalComponent } from './components/share-modal/share-modal.component';
import { SwiftcribCarouselComponent } from './components/swiftcrib-carousel/swiftcrib-carousel.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'authentication', component: LoginComponent },
  { path: 'register-agent', component: RegisterAgentComponent },
  {
    path: 'account-verification',
    title: 'Account Verification',
    component: OtpAuthorizeComponent,
  },

  {
    path: 'dashboard', // Matches the root path
    component: DashboardComponent,
    children: [
      { path: '', title: 'Dashboard', component: DashboardMainComponent }, // Child route
      { path: 'listings', title: 'Listings', component: NoListingsComponent }
    ],
  },
  { path: 'properties/:serviceType', component: PropertiesComponent },
  { path: 'properties/:serviceType/:location', component: PropertiesComponent },
  { path: 'property/:slug', component: PropertyDetailsComponent },

  { path: 'properties-bookmarks', component: BookmarksComponent },
  { path: 'share', component: ShareModalComponent },
  { path: 'test', component: SwiftcribCarouselComponent },

];
