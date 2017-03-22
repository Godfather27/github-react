import React from "react";
import { observer, inject } from "mobx-react";
import Unauthenticated from "./unauthenticated"

const About = inject("sessionStore")(
  observer(
    ({sessionStore}) => {
      const user = sessionStore.userDeferred.value;

      return (
        <div>
          <h1>About {user.login}</h1>
          <strong>Followers:</strong> {user.followers}<br/>
          <strong>Following:</strong> {user.following}
        </div>
      );
    }
  )
);

export default ()=>{
  return <Unauthenticated component={About}/>
}