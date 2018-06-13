
var urls = ['https://jsonplaceholder.typicode.com/users', 'https://jsonplaceholder.typicode.com/posts', 'https://jsonplaceholder.typicode.com/comments'];
var rootData = [];

var usersD,
    posts,
    comm;


// ********* Users ************

var usersPro = new Promise(function(res, rej) {
  var users = $.ajax({
    type: "GET",
    url: urls[0],
    success: function(data) {
      return data;
    },
    error: function(err) {
      console.log(err);
    }
  });

  if(users) {
    res(users);
  } else {
    rej(err);
  }
});

usersPro.then(function(data) {
  usersD = data;
  // console.log(data);
}, function(err) {
  // console.log("Error is there "+err);
})

// ******** Posts ***********

var postsPro = new Promise(function(res, rej) {
  var users = $.ajax({
    type: "GET",
    url: urls[1],
    success: function(data) {
      return data;
    },
    error: function(err) {
      console.log(err);
    }
  });

  if(users) {
    res(users);
  } else {
    rej(err);
  }
});

postsPro.then(function(data) {
  posts = data;
  // console.log(data);
}, function(err) {
  console.log("Error is there "+err);
})

// ****** Comments ********

var commentsPro = new Promise(function(res, rej) {
  var users = $.ajax({
    type: "GET",
    url: urls[2],
    success: function(data) {
      return data;
    },
    error: function(err) {
      // console.log(err);
    }
  });

  if(users) {
    res(users);
  } else {
    rej(err);
  }
});

commentsPro.then(function(data) {
  comm = data;
  // console.log(data);
}, function(err) {
  // console.log("Error is there "+err);
}).finally(function() {

  if(!localStorage.storedData){
    $('#mainBtn').show();
    // combineData();
  } else {
    $('#mainBtn').hide();
    display();
  }
});

$('#mainBtn').on('click', function() {
  combineData();
  $(this).hide();
})

// ********** UPDATING LS ***********
var combineData = function() {
  rootData.push(usersD);
  rootData.push(posts);
  rootData.push(comm);
  updateLS(rootData);
}

var updateLS = function(rootData) {

  if(localStorage.storedData) {
    var tempArr = JSON.parse(localStorage.storedData);
    tempArr.push(rootData);
    localStorage.storedData = JSON.stringify(tempArr);
  } else {
    localStorage.storedData = JSON.stringify(rootData);
  }
  // this.getRootData(JSON.parse(localStorage.storedData));
  display();
}

//

// ************* Listing the view ****************
var display = function(data) {
  for(i=0; i < posts.length; i++) {

    $('#container').append(`<div class="post${i}" id="post"></div>`);

    var userId = posts[i]['userId'];
    var pcId = posts[i];
    var username;
    var comments = [];

    usersD.forEach(function(e) {
    	if(e.id == userId) {
    	username = e['name'];
    }
    })

    comm.forEach(function(e) {
      if(e.postId == pcId) {
      comments.push(e.body);
    }
    })

    var content = `
      <div class="post${i}-header" id="post-header">
        <h1>` + username + ` </h1>
        <h2>` + posts[i]['title'] + `</h2>
        <h3>` + posts[i]['body'] + `</h3>
      </div>
      <div class="post${i}-lcd" id="post-lcd">
        <input type="button" name="like" id="like" value="Like">
        <input type="button" name="comments" id="comments" value="Comments">
        <input type="button" name="delete" id="delete" value="Delete">
      </div>
      <div class="post${i}-comm" id="post-comm">`;

      content += `
        <input type="text" id="post${i}-add-comm">
        <input type="button" id="post${i}-add-comm-submit" value="Submit">
      </div>
    </div>
    `;

    $(`.post${i}`).html(content);
  }

  varMain();
}

//Getting the main Array
var root = [];
function varMain () {

  for(var i=0; i<posts.length; i++) {
  	var obj = {comments: []};
  	obj.postId = posts[i]['id'];

    for(var j = 0; j < usersD.length; j++) {
  		if(posts[i]['userId'] == usersD[j]['id']) {
  		    obj.userName = usersD[j]['name'];
  	  }
    }

    obj.title = posts[i]['title'];
    obj.body = posts[i]['body'];

    for(var k = 0; k < comm.length; k++) {
      if(comm[k]['postId'] == posts[i]['id']) {
        obj.comments[k] = comm[k]['body'];
      }
    }
    root.push(obj);
  }

}
