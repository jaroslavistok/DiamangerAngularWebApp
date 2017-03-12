import { Injectable } from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

@Injectable()
export class AuthService {

  constructor(public angularFire: AngularFire) {

  }

  registerUserWithEmailAndPassword(userEmail: string, userPassword: string){
      return this.angularFire.auth.createUser({
          email: userEmail,
          password: userPassword
      }).then((user)=> {
          return this.angularFire.database.object(`/users/${user.uid}`).update({
              email: userEmail
          });
      });
  }

  loginWithEmailAndPassword(userEmail: string, userPassword: string){
      return this.angularFire.auth.login({
              email: userEmail,
              password: userPassword,
          },
          {
              provider: AuthProviders.Password,
              method: AuthMethods.Password,
          });
  }

  logout(){
      return this.angularFire.auth.logout();
  }

}
