import React, { Component } from "react";

const API_HOST = "http://localhost:8000";

class Post extends Component {
  render() {
    return (
      <>
        <h1>Add a boast or roast!</h1>
        <form action={`${API_HOST}/posts/`} method="post">
            {/* body
            is_boast */}
            <input type='text' name='body'></input>
            <br/>
            This is a boast<input type='checkbox' name='is_boast'></input>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </>
    );
  }
}

export default Post;
