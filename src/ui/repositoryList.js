import React from "react";
import { observer, inject } from "mobx-react";
import { PENDING, REJECTED, FULFILLED } from "mobx-utils";
import { Spinner, Button } from "@blueprintjs/core";
import Unauthenticated from "./unauthenticated"

export default inject("repoStore", "viewStore")(
  observer(
    class RepositoryList extends React.Component {
      constructor({ repoStore, viewStore }) {
        super();
        repoStore.fetchRepos();
      }
      renderRepoList() {
        const {repoStore, viewStore} = this.props;
        const repoDeferred = repoStore.repoDeferred;
        if(repoDeferred===null) return null
        const state = repoDeferred.state;

        switch (state) {
          case PENDING: {
            return <Spinner />;
          }
          case REJECTED: {
            return (
              <div className="pt-non-ideal-state">
                <div
                  className="pt-non-ideal-state-visual pt-non-ideal-state-icon"
                >
                  <span className="pt-icon pt-icon-error" />
                </div> 
                <h4 className="pt-non-ideal-state-title">Error occured</h4>
                <div className="pt-non-ideal-state-description">
                  <Button onClick={repoStore.fetchRepos} text="retry"/>
                </div>
              </div>
            )
          }
          case FULFILLED: {
            const repos = repoDeferred.value;
            return repos.map((entry, key) => {
              return <li key={key}>
                  <Button
                  className="pt-button pt-minimal pt-icon-edit"
                  onClick={() => viewStore.push(viewStore.routes.issue({repo: entry.name}))}
                  text={entry.name}
                  />
                </li>
            })
          }
          default: {
            console.error("deferred state not supported", state);
          }
        }
      }
      render() {
        return (
          <div>
            <h1>Repos</h1>
            <ul>
              <Unauthenticated component={this.renderRepoList()}/>
            </ul>
          </div>
        );
      }
    }
  )
);
