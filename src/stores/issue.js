import { extendObservable, action, when } from "mobx";
import { fromPromise, REJECTED } from "mobx-utils";

export default class IssueStore {
  constructor({ githubAPI, sessionStore }) {
    extendObservable(this, {
      issueDeferred: null,
      repo: null,
      fetchIssues: action("userIssues", (repo) => {
        if(this.repo !== repo){ this.issueDeferred = null }
        when(
          // condition
          () => sessionStore.authenticated && (this.repo !== repo || this.issueDeferred === null || this.issueDeferred.state === REJECTED),
          // ... then
          () => {
            const userDeferred = sessionStore.userDeferred;
            this.issueDeferred = fromPromise(
              githubAPI.userIssues({
                login: userDeferred.value.login,
                repo
              })
            );
            this.repo = repo
          }
        );
      }),
      postIssue: action("postIssue", (repo, title, text) => {
        return githubAPI.postIssue({
          login: sessionStore.userDeferred.value.login,
          repo,
          title,
          text
        });
      })
    });
  }
}
