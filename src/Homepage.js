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

async function fetchHelper(pageNum) {
  const response = await fetch(`${API_HOST}/posts/?page=${pageNum}`);
  const data = await response.json()
  return data;
}

async function fetchPostData() {
  let pageNum = 1;
  let done = false;
  let currentResBody = await fetchHelper(pageNum);
  const finalResBody = currentResBody;
  while (!done) {
    pageNum += 1;
    currentResBody = await fetchHelper(pageNum);
    finalResBody.results = finalResBody.results.concat(currentResBody.results);
    if (currentResBody.next === null || currentResBody.next === undefined) {
      done = true;
    }
  }
  return finalResBody.results
}

class Homepage extends Component {
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
      posts: await fetchPostData(),
      displayPosts: await fetchPostData()
    });
  }

  render() {
    return (
      <div>
        <h1>Ghostpost!</h1>
        {this.state.displayPosts.length !== 0 &&
          this.state.displayPosts.map(post => (
            <div key={post.id}>
              {post.body} <br />
              {post.time} likes: {post.likes}{" "}
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
        <hr />
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
        <button
          onClick={() =>
            this.setState(state => ({
              displayPosts: state.displayPosts.sort((a, b) => b.likes - a.likes)
            }))
          }
        >
          Sort by Likes
        </button>
      </div>
    );
  }
}

export default Homepage;
