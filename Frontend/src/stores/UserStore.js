import { extendObservable } from "mobx";

class UserStore {
  constructor() {
    extendObservable(this, {
      loading: true,
      isLoggedIn: false,
      user: null,
      token:""
    });
  }
}

export default new UserStore();
