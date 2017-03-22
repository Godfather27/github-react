import React from "react";
import { inject } from "mobx-react";

export default inject("sessionStore")(({component, sessionStore}) => {
  const style = {
    border: "1px solid red",
    background: "#f88",
    padding: "5px",
    borderRadius: "2px",
    float: "left"
  }

  if(sessionStore.authenticated){
    return <div>{component}</div>
  } else {
    return <p style={style}>You are not logged in</p>
  }
});