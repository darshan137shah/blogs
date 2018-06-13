var urls = ['https://jsonplaceholder.typicode.com/users', 'https://jsonplaceholder.typicode.com/posts', 'https://jsonplaceholder.typicode.com/comments'];


// ******Get the data from AJAX******
  var p1 = new Promise ((res, rej) => {
    $.ajax({
      type: "get",
      url: urls[0],
      success: (data) => res(data),
      error: (err) => rej(err)
    })
  });
  var p2 = new Promise ((res, rej) => {
    $.ajax({
      type: "get",
      url: urls[1],
      success: (data) => res(data),
      error: (err) => rej(err)
    })
  });
  var p3 = new Promise ((res, rej) => {
    $.ajax({
      type: "get",
      url: urls[2],
      success: (data) => res(data),
      error: (err) => rej(err)
    })
  });

  Promise.all([p1,p2,p3]).then(function(data) {

    if(!(localStorage.users && localStorage.posts && localStorage.comments)) {
      storeTheData(data);
    }

  }).finally(function() {
     p1 = '';
     p2 = '';
     p3 = '';
     displayToDoc();
  });


// ******Parking the data to the LocalStorage******

function storeTheData(data) {
  var users = {};
  var comments = {};
  var posts = data[1];

  //Users
  for(let user of data[0]) {
        users[user.id] = user.name;
    }

  //Comments
  for(var i = 0; i < data[2].length ; i++) {
    //Get the id of post
    var id = data[2][i]['postId'];
    if (!comments[id]) {
      comments[id] = [data[2][i]['body']];
    } else {
      comments[id].push(data[2][i]['body']);
    }
  }
  localStorage.users = JSON.stringify(users);
  localStorage.posts = JSON.stringify(posts);
  localStorage.comments = JSON.stringify(comments);
}


// ******Data Accessor******
function dataAccess() {
  var users = JSON.parse(localStorage.users);
  var posts = JSON.parse(localStorage.posts);
  var comments = JSON.parse(localStorage.comments);
}


// ******Appending to the DOM******
function displayToDoc() {
   users = JSON.parse(localStorage.users);
   posts = JSON.parse(localStorage.posts);
   comments = JSON.parse(localStorage.comments);

  //Creating Nodes
  for(let i=0; i<posts.length; i++){
    $('#container').append(`<div class="post${i}" id="post"></div>`);

    var headings = `<h1>${users[posts[i]['userId']]}</h1>
                    <h2>${posts[i]['title']}</h2>
                    <h3>${posts[i]['body']}</h3>`;

    var lcd = `<input type="button" name="like" id="like_post_${i}" class='like_btn' value="Like">
              <input type="button" name="comments" id="comments_post_${i}" class='comments_btn' value="Comments">
              <input type="button" name="delete" id="delete_post_${i}" class='delete_btn' value="Delete">`;

    var comm = `<div class="comm_post_${i}" id="post-comm"></div>
    <input type="text" id="addcomm_post${i}">
    <input type="button" id="submit_post${i}" value="Submit">
    `;

    $(`.post${i}`).html(headings + lcd + comm);

    for(let comment of comments[posts[i]['id']]) {
      $(`.comm_post_${i}`).append(`<p class='comment_post_${i}'> ${comment} </p>`);
    }
  }
}
