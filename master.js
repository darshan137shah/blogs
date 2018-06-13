var urls = ['https://jsonplaceholder.typicode.com/users', 'https://jsonplaceholder.typicode.com/posts', 'https://jsonplaceholder.typicode.com/comments'];


//Get the data from AJAX
function getData() {
  var raw = {
    users:'',
    posts:'',
    comm:''
  };

  for(let u of urls) {
    var newPro = new Promise(function(res, rej) {
        // AJAX starts
       $.ajax({
        type: "GET",
        url: u,
        success: (data) => {
          res(data);
        },
        error: (err) => {
          rej('Error is there');
        }
      });
      // AJAX Ends
    });

    //Resolving the data
    newPro.then(function(data) {
      if(u == urls[0]) {
        raw.users = data;
      } else if(u == urls[1]){
        raw.posts = data;
        } else if(u == urls[2]) {
          raw.comm = data;
        }
    })
  }
  return raw;
}

//Array re-Formation
function mapData(data) {

  return function() {
    var users = data.users;
    var posts = data.posts;
    var comm = data.comm;
    var root = [];

    for(var i=0; i < posts.length; i++) {
      var obj = {comments: []};
      obj.postId = posts[i]['id'];
      for(var j = 0; j < users.length; j++) {
        if(posts[i]['userId'] == users[j]['id']) {
            obj.userName = users[j]['name'];
        }
      }
      obj.title = posts[i]['title'];
      obj.body = posts[i]['body'];

      for(var k = 0; k < comm.length; k++) {
        if(comm[k]['postId'] == posts[i]['id']) {
          obj.comments.push(comm[k]['body']);
        }
      }
      root.push(obj);
    }
    return root;
  }
};

//Calling the LocalStorage
if(!localStorage.data) {
    var raw = getData();
    var rootData = mapData(raw);
}
raw = [];
