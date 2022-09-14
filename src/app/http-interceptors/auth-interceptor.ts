import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { getDeepFromObject, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  strategy: string = ''

  constructor(
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    private auth: NbAuthService
  ) {
    this.strategy = this.getConfigValue('forms.logout.strategy')
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service.
    return this.auth.getToken().pipe(
            switchMap(token => {
                const authReq = req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${token}`
                    }
                });
          
                return next.handle(authReq)
            }),
            catchError((error) => {
              if (error.status !== 401) {
                  return next.handle(error);
              } else {
                  return this.auth.logout(this.strategy).pipe(
                    switchMap((result) => {
                      window.location.href = "/"
                      return next.handle(error)
                    })
                  )
              }
            })
        )
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}