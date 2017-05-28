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
              email: userEmail,
              admin: false,
              admin_code: '0000'
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

      this.angularFire.auth.subscribe((auth) => {
          let users = this.angularFire.database.object('/users/'+ auth.uid);
          users.update({admin: false});
      });

      return this.angularFire.auth.logout();
  }

}
