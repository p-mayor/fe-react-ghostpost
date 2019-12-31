import React, { Component } from "react";

const API_HOST = "http://localhost:8000";

// test code
// let _csrfToken = null;

// async function getCsrfToken() {
//   if (_csrfToken === null) {
//     const response = await fetch(`${API_HOST}/csrf/`, {
//       credentials: "include"
//     });
//     const data = await response.json();
//     _csrfToken = data.csrfToken;
//   }
//   return _csrfToken;
// }

// async function testRequest(method) {
//   const response = await fetch(`${API_HOST}/ping/`, {
//     method: method,
//     headers: method === "POST" ? { "X-CSRFToken": await getCsrfToken() } : {},
//     credentials: "include"
//   });
//   const data = await response.json();
//   return data.result;
// }

async function getPosts() {
  const response = await fetch(`${API_HOST}/posts/`, {
    method: "GET",
    credentials: "include"
  });
  const data = await response.json();
  return data.results;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      displayPosts: []
    };
  }
  boastsOnly = () => {
    this.setState(state => ({
      displayPosts: state.posts.filter(post => {
        return post.is_boast === true;
      })
    }));
  };

  roastsOnly = () => {
    this.setState(state => ({
      displayPosts: state.posts.filter(post => {
        return post.is_boast === false;
      })
    }));
  };

  async componentDidMount() {
    this.setState({
      posts: await getPosts(),
      displayPosts: await getPosts()
    });
  }

  render() {
    return (
      <div>
        <h1>Ghostpost!</h1>
        {this.state.displayPosts.length !== 0 &&
          this.state.displayPosts.map(post => (
            <div key={post.id}>
              {post.body} <br/>{post.time} likes: {post.likes}{" "}
              <form
                name="upvote"
                method="post"
                action={`${API_HOST}/like/${post.id}`}
              >
                <input type="submit" value="Upvote" />
              </form>
              <form
                name="downvote"
                method="post"
                action={`${API_HOST}/unlike/${post.id}`}
              >
                <input type="submit" value="Downvote" />
              </form>
            </div>
          ))}
        <button onClick={this.boastsOnly}>Boasts Only</button>
        <button onClick={this.roastsOnly}>Roasts Only</button>
        <button
          onClick={() =>
            this.setState(state => ({
              displayPosts: state.posts
            }))
          }
        >
          All posts
        </button>
        <button onClick={() =>
            this.setState(state => ({
              displayPosts: state.displayPosts.sort((a,b)=>b.likes-a.likes)
            }))}>Sort by Likes</button>
      </div>
    );
  }
}

export default App;
