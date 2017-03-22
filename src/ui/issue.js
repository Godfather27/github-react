import MobxReactForm from "mobx-react-form";
import React from "react";
import { observer, Provider, inject } from "mobx-react";
import { extendObservable } from "mobx";
import { fromPromise, PENDING, REJECTED, FULFILLED } from "mobx-utils";
import { Button, Intent, Toaster, Position } from "@blueprintjs/core";
import validatorjs from "validatorjs";
import FormInput from './formInput';
import { Spinner } from "@blueprintjs/core";
import Unauthenticated from "./unauthenticated"

const plugins = { dvr: validatorjs };

const fields = [
  {
    name: "title",
    label: "Title",
    placeholder: "Issue Title",
    rules: "required|string|between:5,10"
  },
  {
    name: "text",
    label: "Text",
    placeholder: "Issue Description",
    rules: "required|string|between:5,25"
  }
];

class IssueForm extends MobxReactForm {
  constructor(fields, options, issueStore, repo) {
    super(fields, options);
    this.issueStore = issueStore;
    this.repo = repo;

    extendObservable(this, {
      issuePostDeferred: fromPromise(Promise.resolve())
    });
  }

  onSuccess(form) {
    const { title, text } = form.values();
    const resultPromise = this.issueStore.postIssue(this.repo, title, text);
    resultPromise
      .then(() => Toaster.create({ position: Position.TOP }).show({
        message: "issue posted",
        intent: Intent.SUCCESS
      }))
      .catch(() => Toaster.create({ position: Position.TOP }).show({
        message: "failed posting issue",
        action: { text: "retry", onClick: () => form.submit() },
        intent: Intent.DANGER
      }));
    this.issuePostDeferred = fromPromise(resultPromise);
  }
}

const FormComponent = inject("form")(
  observer(function({ form }) {
    return (
      <form onSubmit={form.onSubmit}>

        <FormInput form={form} field="title" />
        <FormInput form={form} field="text" />

        {form.issuePostDeferred.case({
          pending: () => <Button type="submit" loading={true} text="submit" />,
          rejected: () => (
            <Button type="submit" className="pt-icon-repeat" text="submit" />
          ),
          fulfilled: () => (
            <Button type="submit" onClick={form.onSubmit} text="submit" />
          )
        })}
        <Button onClick={form.onClear} text="clear" />
        <Button onClick={form.onReset} text="reset" />

        <p>{form.error}</p>
      </form>
    );
  })
);

export default inject("issueStore")(
  observer(
    class IssueFormComponent extends React.Component {
      constructor({ issueStore, route }) {
        super();
        issueStore.fetchIssues(route.params.repo);
        this.state = {
          form: new IssueForm({ fields }, { plugins }, issueStore, route.params.repo)
        };
      }

      renderIssueList() {
        const { issueStore } = this.props;
        const issueDeferred = issueStore.issueDeferred;
        if( issueDeferred === null) return null
        const state = issueDeferred.state;

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
                  <Button onClick={this.props.issueStore.fetchIssues} text="retry"/>
                </div>
              </div>
            );
          }
          case FULFILLED: {
            let issues = issueDeferred.value

            return issues.map((entry, key) => {
              return (
                <div key={key}>
                  <button onClick={this.foo}>{entry.title}</button>
                </div>
              )
            })
          }
          default: {
            console.error("deferred state not supported", state);
            return null
          }
        }
      }

      foo(){
        console.log('foo')
      }

      render() {
        const { form } = this.state;
        const { route } = this.props;
        const style = {
          float: "left",
          padding: "0 20px",
          borderLeft: "1px solid grey"
        };

        return (
          <Provider form={form}>
            <div>
              <h1 style={{paddingBottom: "20px"}}>Repo {route.params.repo}</h1>
              <div style={style}>
                <h3>New Issue</h3>
                <FormComponent />
              </div>
              <div style={style}>
                <h2>Issues</h2>
                <Unauthenticated component={this.renderIssueList()}/>
              </div>
            </div>
          </Provider>
        );
      }
    }
  )
);
