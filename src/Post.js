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
            <input type='text' id='body'></input>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </>
    );
  }
}

export default Post;
