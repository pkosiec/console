import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  ActivationEnd,
  NavigationEnd,
  ActivatedRouteSnapshot
} from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';

import { NavVisibilityService } from '../services/nav-visibility.service';
import { CurrentEnvironmentService } from '../../content/environments/services/current-environment.service';
import { LoginService } from '../../auth/login.service';
import { AppConfig } from '../../app.config';
import { Subscription } from 'rxjs/Subscription';
import NavigationUtils from '../services/navigation-utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: { class: 'sf-header' }
})
export class HeaderComponent implements OnInit, OnDestroy {
  public orgName = AppConfig.orgName;
  private navVisibilityService: NavVisibilityService;
  public isExpanded = false;
  public ariaHidden = true;
  private currentEnvironmentSubscription: Subscription;
  private currentEnvironmentId: string;
  private routerSub: Subscription;
  public leftNavCollapsed = false;
  public loggedIn = false;

  constructor(
    @Inject(NavVisibilityService) navVisibilityService: NavVisibilityService,
    private router: Router,
    private route: ActivatedRoute,
    private currentEnvironmentService: CurrentEnvironmentService,
    private oauthService: OAuthService,
    private loginService: LoginService
  ) {
    this.navVisibilityService = navVisibilityService;

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
      });

    this.routerSub = router.events.subscribe(val => {
      if (val instanceof ActivationEnd) {
        this.leftNavCollapsed = NavigationUtils.computeLeftNavCollapseState(
          val.snapshot
        );
      }
    });

    this.loginService.isLoggedIn().subscribe(val => (this.loggedIn = val));
  }

  public goToEnvironments() {
    const currentEnvironmentId = this.currentEnvironmentId;
    const link =
      'home/' +
      (currentEnvironmentId
        ? 'environments/' + currentEnvironmentId
        : 'environments');
    this.router.navigateByUrl(link);
  }

  public toggleLeftNav() {
    this.navVisibilityService.toggleVisibility();
  }

  public ngOnInit() {}

  public toogleUserDropdown() {
    this.isExpanded = !this.isExpanded;
    this.ariaHidden = !this.ariaHidden;
  }

  public closeUserDropdown() {
    this.isExpanded = false;
    this.ariaHidden = true;
  }

  get name() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    return claims['name'];
  }

  public logout() {
    this.loginService.logout();
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
    this.routerSub.unsubscribe();
  }
}
