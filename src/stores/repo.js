import { extendObservable, action, when } from "mobx";
import { fromPromise, REJECTED } from "mobx-utils";

export default class RepoStore {
  constructor({ githubAPI, sessionStore }) {
    extendObservable(this, {
      repoDeferred: null,
      fetchRepos: action("fetchRepos", () => {
        when(
          // condition
          () => sessionStore.authenticated && (this.repoDeferred === null || this.repoDeferred.state === REJECTED),
          // ... then
          () => {
            const userDeferred = sessionStore.userDeferred;
            this.repoDeferred = fromPromise(
              githubAPI.userRepositories(userDeferred.value)
            );
          }
        );
      })
    });
  }
}
