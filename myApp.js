var urls = ['https://jsonplaceholder.typicode.com/users', 'https://jsonplaceholder.typicode.com/posts', 'https://jsonplaceholder.typicode.com/comments'];

if(!(localStorage.users && localStorage.posts && localStorage.comments)) {
  $('#show').fadeIn();
  $(document).on('click', '#show', function() {
    loadData();
    $('#show').fadeOut();
  });
} else {
  $('#show').remove();
  users = JSON.parse(localStorage.users);
  posts = JSON.parse(localStorage.posts);
  comments = JSON.parse(localStorage.comments);
  displayToDoc(users, posts, comments);
}

function loadData() {
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
        formatTheData(data);
      }

    }).finally(function() {
       p1 = '';
       p2 = '';
       p3 = '';
       displayToDoc(users, posts, comments);
    });
}


//
function updateLS(users, posts, comments) {
  //Updating the localStorage
  localStorage.users = JSON.stringify(users);
  localStorage.posts = JSON.stringify(posts);
  localStorage.comments = JSON.stringify(comments);
  displayToDoc(users, posts, comments);
}

// ******Reformatting raw data and updating LS******
function formatTheData(data) {
  users = {};
  comments = {};
  posts = data[1];

  //Posts - Likes
  for(let postele of data[1]) {
    postele['likes'] = 0;
  }

  //Users
  for(let user of data[0]) {
        users[user.id] = user.name;
    }

  //Comments
  for(var i = 0; i < data[2].length ; i++) {
    var id = data[2][i]['postId'];
    if (!comments[id]) {
      comments[id] = [data[2][i]['body']];
    } else {
      comments[id].push(data[2][i]['body']);
    }
  }

  //Update localStorage
  updateLS(users, posts, comments);
}

// ******Appending to the DOM******
function displayToDoc(users, posts, comments) {

  //Creating Nodes
  for(let i=0; i<posts.length; i++){
    $('#container').append(`<div class="post${i}" id="post"></div>`);

    var headings = `<h1>${users[posts[i]['userId']]}</h1>
                    <h2>${posts[i]['title']}</h2>
                    <h3>${posts[i]['body']}</h3>
                    <h4> Likes <span class = 'likes_${i}'>${posts[i]['likes']}<span></h4>`;

    var lcd = `<input type="button" name="like" id="like_post_${i}" class='like_btn' value="Like">
              <input type="button" name="comments" id="comments_post_${i}" class='comments_btn' value="Comments">
              <input type="button" name="delete" id="delete_post_${i}" class='delete_btn' value="Delete">`;

    var comm = `<div id="comm_post_${i}" class="post-comm">
    <input type="text" id="submit_comments_input${i}">
    <input type="button" id="submit_post${i}" class='submit_comments_btn' value="Submit">
    </div>
    `;

    $(`.post${i}`).html(headings + lcd + comm);

    for(let comment of comments[posts[i]['id']]) {
      $(`#submit_comments_input${i}`).before(`<p class='comment_post_${i}'> ${comment} </p>`);
    }
  }
}

// ******LCD Listeners******
$(document).on('click', '.like_btn', function() {
  $(this).val('Liked!!!!');
  var postId = $(this).attr('id').substr(10,4);
  console.log(postId)
  posts[postId]['likes'] += 1;
  localStorage.posts = JSON.stringify(posts);
  $(`.likes_${postId}`).html(posts[postId]['likes']);
  $(this).attr('disabled', 'true');
});

$(document).on('click', '.comments_btn', function() {
  var id = $(this).attr('id');
  var commensDiv = id.replace('comments', '#comm');
  $(commensDiv).fadeToggle();
});

$(document).on('click', '.delete_btn', function() {
  var post = $(this).parent().attr('class').substr(4,4);
  delete comments[posts[post]['id']];
  posts.splice(post,1);
  // $(this).parent().remove();
  updateLS(users, posts, comments);
});

$(document).on('click', '.submit_comments_btn', function() {
  var postId = $(this).attr('id').substr(11,4);
  var inputVal = $(this).siblings('input').val();
  comments[posts[postId]['id']].push(inputVal);
  localStorage.comments = JSON.stringify(comments);
  $(this).siblings('input').before(`<p class='comment_post_${postId}'> ${inputVal} </p>`);
  $(this).siblings('input').val('');
});
