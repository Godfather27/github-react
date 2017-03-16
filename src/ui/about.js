import React from "react";
import { observer, Provider, inject } from "mobx-react";

export default inject("sessionStore")(
  observer(
    ({sessionStore}) => {
      const user = sessionStore.userDeferred.value;
      if (!sessionStore.authenticated) return null

      return (
        <div>
          {console.log(user)}
          <h1>About {user.login}</h1>
          <strong>Followers:</strong> {user.followers}<br/>
          <strong>Following:</strong> {user.following}
        </div>
      );
    }
  )
);