import config from "../config"

export default class GithubAPI {
  constructor({ userToken }) {
    this.userToken = userToken;
    this.defaultHeaders = {
      Authorization: `token ${this.userToken}`
    };
  }

  currentUser = () => {
    return fetch(`${config.API}/user`, {
      headers: {
        ...this.defaultHeaders
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  userRepositories = ({ login }) => {
    return fetch(`${config.API}/users/${login}/repos`, {
      headers: {
        ...this.defaultHeaders
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  userIssues = ({login, repo}) => {
    return fetch(`${config.API}/repos/${login}/${repo}/issues`, {
      headers: {
        ...this.defaultHeaders
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  }

  postIssue = ({ login, repo, title, text }) => {
    return fetch(`${config.API}/repos/${login}/${repo}/issues`, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        body: text
      })
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };
}
