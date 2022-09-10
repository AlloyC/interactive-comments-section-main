const tweet = document.getElementById("tweets");
const userCommentBox = document.getElementById('comment');
let currentUser;
let container;
let usernames = [];
let userPics = [];
let replies = [];

let repliesUsernames = [];
let repliesUserPics = [];
let repliesReplingTo = [];


let lastClicked;

let increaseAmount = []
let active = false;

//fetching json file
fetch("js/data.json")
.then((res) => res.json())
.then((data) => {
  console.log(data);

              //  COMMENTS LOOPS
  data.comments.forEach((datum) => {
    usernames.push(datum.user.username);
    userPics.push(datum.user.image.png);
    
  });
  
    
// DYNAMICALLY DISPLAYING THE COMMENTS
  data.comments.forEach((datum) => {
    
    tweet.innerHTML += `
    <div id=${datum.id}>
    <div class="container bg-light">
    <div class="profile-period">
    <img class="dp" src="${datum.user.image.png}" alt="profile picture" />
    <h2 class="fw-700">${datum.user.username}</h2>
    <p class="fw-400 cl-dark-gray">${datum.createdAt}</p>
    </div>
    <p class="fw-400 content">${datum.content}</p>
    <div class="vote bg-gray">
    <button id="" class="increase-btn btn" type="submit"><img src="images/icon-plus.svg" alt="" /></button>
    <p class="cl-blue vote-score fw-700">${datum.score}</p>
    <button id="" class="decrease-btn btn" type="submit"><img src="images/icon-minus.svg" alt="decrease" /></button>
    </div>
    <button id="reply-${datum.id}" class="reply cl-blue fw-500" type="submit"><img src="images/icon-reply.svg" alt="reply" />Reply</button>
    </div>
    
    <div id="${datum.id}-reply-container" class="container reply-container">
      
    </div>
    <div id="${datum.id}-reply-comment" class="reply-comment">
    
    </div>
    </div>`;
  });
    increase();
    decrease();
  //DYNAMICALLY DISPLAYING USER COMMENT BOX
  //CREATING NEW DIV.CONTAINER
  let  commentDiv = document.createElement('div');
  commentDiv.className ="container comment-box bg-light";
  
  userCommentBox.appendChild(commentDiv);
  
  //CREATING NEW IMG
  let commentImg = document.createElement('img');
  commentImg.className = 'dp';
  commentImg.src = data.currentUser.image.png;
  commentImg.setAttribute('alt', 'profile picture');
  
  commentDiv.appendChild(commentImg);
  
  //CREATING NEW TEXTAREA
  let textarea = document.createElement('textarea');
  textarea.id = "comment-textarea";
  textarea.className = "fw-400 content";
  textarea.setAttribute('placeholder', "Add a comment...");
  textarea.rows = "5";
  textarea.cols = "20";
  
  commentDiv.appendChild(textarea);
  
  //CREATING NEW BUTTON
  let commentBtn = document.createElement('button');
  commentBtn.id = 'comment-btn';
  commentBtn.className = 'cl-light bg-blue fw-500';
  commentBtn.setAttribute('type','submit')
  commentBtn.appendChild(document.createTextNode('SEND'));  
  
  commentDiv.appendChild(commentBtn);
 // console.log(commentDiv.children);
  
  // LOOPING TROUGH EACH REPLY BTN WITH ADDEVENTLISTENER
  document.querySelectorAll('.reply').forEach(clickedBtn => {clickedBtn.addEventListener('click', replyClicked);
   
   function replyClicked () {
      pushingClickedRA();
      if (typeof lastClicked != 'undefined' && document.getElementById(`reply-${lastClicked}`) != clickedBtn) {
         document.getElementById(`${lastClicked}-reply-container`).innerHTML = '';
         document.getElementById(`${lastClicked}-reply-comment`).innerHTML = '';
         document.getElementById(`${lastClicked}-reply-comment`).style.display = 'none';
         
         document.getElementById(`${lastClicked}-reply-container`).style.display = "none";
          
         document.getElementById(`reply-${lastClicked}`).classList.remove('showing');
        
      }
      
      if (clickedBtn.classList.contains('showing') ) {
         document.getElementById(`${clickedBtn.id.match(/\d/g)[0]}-reply-container`).innerHTML = '';
         document.getElementById(`${clickedBtn.id.match(/\d/g)[0]}-reply-comment`).innerHTML = '';
         document.getElementById(`${clickedBtn.id.match(/\d/g)[0]}-reply-comment`).style.display = 'none';
         
         document.getElementById(`${clickedBtn.id.match(/\d/g)[0]}-reply-container`).style.display = "none";
          
         clickedBtn.classList.remove('showing');
       }  else {
         document.getElementById(`${clickedBtn.id.match(/\d/g)[0]}-reply-container`).style.display = "grid";
         document.getElementById(`${clickedBtn.id.match(/\d/g)[0]}-reply-comment`).style.display = 'grid';
     
          document.getElementById(`${clickedBtn.id.match(/\d/g)[0]}-reply-container`).style.gridGap = "20px";
     
          replyFillUp();
          
          lastClicked = `${clickedBtn.id.match(/\d/g)[0]}`;
          clickedBtn.classList.add('showing');
      }
    };
   
    function pushingClickedRA () { // RA = replies Array
      replies = [];
      replies = data.comments[parseInt(clickedBtn.id.match(/\d/g)[0]) - 1].replies;
    }
    
    function pushingRepliesC () { //C = contents
      repliesUsernames = [];
      repliesUserPics = [];
      repliesReplyingTo = [];
    
      replies.forEach( repliedFrom => {
          repliesUsernames.push(repliedFrom.user.username);
          repliesUserPics.push(repliedFrom.user.image.png);
          repliesReplyingTo.push(repliedFrom.replyingTo);
        }
      );
    }
    
    function replyFillUp() {
      function replyComment () {
      document.querySelectorAll('.reply-comment').forEach(allReply => allReply.innerHTML = '');
      document.querySelectorAll('.reply-container').forEach(allReply => allReply.innerHTML = '');
       document.getElementById(`${clickedBtn.id.match(/\d/g)[0]}-reply-comment`).innerHTML +=
          `
          <div class="container comment-box bg-light ">
      <img class="dp" src="${data.currentUser.image.png}" alt="profile picture" />
      <textarea class="fw-400 content" name=""  rows="5" cols="20"></textarea>
      <button id="reply-currentUser-${clickedBtn.id.match(/\d/g)[0]}" class="reply post-reply cl-blue fw-500" type="submit"><img src="images/icon-reply.svg" alt="reply" />Reply</button>
      </div>
          `
           
          postReply();
      }
      replyComment()
          if (replies[0].hasOwnProperty('id') && replies.length > 1) {
        pushingRepliesC();
        function  repliesfill() {
  for (let i = 0; i < replies.length; i++) {
        document.getElementById(`${clickedBtn.id.match(/\d/g)[0]}-reply-container`).innerHTML +=
          `
          <div class="container bg-light">
      <div class="profile-period">
      <img class="dp" src="${repliesUserPics[i]}" alt="profile picture" />
      <h2 class="fw-700">${repliesUsernames[i]}</h2>
      <p class="fw-400 cl-dark-gray">${replies[i].createdAt}</p>
      </div>
      <p class="fw-400 content"><span class="cl-blue fw-500" >@${repliesReplyingTo[i]}</span> ${replies[i].content}</p>
      <div class="vote bg-gray">
      <button id="" class="increase-btn btn" type="submit"><img src="images/icon-plus.svg" alt="" /></button>
      <p class="cl-blue vote-score fw-700">${replies[i].score}</p>
      <button id="" class="decrease-btn btn" type="submit"><img src="images/icon-minus.svg" alt="decrease" /></button>
      </div>
      <button id="reply-${replies[i].id}" class="reply cl-blue fw-500" type="submit"><img src="images/icon-reply.svg" alt="reply" />Reply</button>
      </div>
          `
        }
          increase();
          decrease();
}
        repliesfill()
      }
    }
  });
  
    // ADD COMMENT VALUES
  document.getElementById('comment-btn').addEventListener('click', addComment)
    
       let commentId = []
       let newCommentOutput = "";
       let newCommentOutput2 = '';
   function addComment(){
     commentId.push(true);
     newCommentOutput2 = document.getElementById('new-comment').innerHTML;
  // console.log(document.getElementById('new-comment').innerHTML);
     if (document.querySelector('#comment-textarea').value) {
     document.getElementById('new-comment').style.display = "grid"
     let paragraph = document.createElement('p');
     paragraph.className ='fw-400 content';
     paragraph.appendChild(document.createTextNode(document.querySelector('#comment-textarea').value));
    // document.getElementById('new-comment').appendChild(paragraph)
     newCommentOutput = `
     <div id="comment-container-${commentId.length}" class="container bg-light">
     <div class="profile-period">
      <img class="dp" src="${data.currentUser.image.png}" alt="profile picture" />
      <h2 class="fw-700">${data.currentUser.username}</h2>
      <p class="fw-400 cl-dark-gray"></p>
      </div>
      <p id="paragraph-${commentId.length}" class="fw-400 content"></p>
      <div class="vote bg-gray">
      <button id="new-comment-vote-up-${commentId.length}" class="increase-btn btn" type="submit"><img src="images/icon-plus.svg" alt="" /></button>
      <p class="cl-blue vote-score fw-700">0</p>
      <button id="new-comment-vote-down-${commentId.length}" class="decrease-btn btn" type="submit"><img src="images/icon-minus.svg" alt="decrease" /></button>
      </div>
      <button id="new-comment-${commentId.length}" class="reply cl-blue fw-500" type="submit"><img src="images/icon-reply.svg" alt="reply" />Reply</button>
        </div>`
        
       document.getElementById('new-comment').style.display = "none"
        document.getElementById('new-comment').innerHTML = newCommentOutput;
        document.getElementById(`paragraph-${commentId.length}`).innerText = document.querySelector('#comment-textarea').value;
        newCommentOutput2 += document.getElementById('new-comment').innerHTML;
        document.getElementById('new-comment').innerHTML = newCommentOutput2;
        document.getElementById('new-comment').style.display = "grid";
        for (let i = 0; i < document.getElementById('new-comment').children.length; i++){
        document.getElementById('new-comment').children[i].children[2].children[0].classList.remove('active');
        document.getElementById('new-comment').children[i].children[2].children[2].classList.remove('active');
        }
     }
     document.querySelector('#comment-textarea').value = '';
     
     increase();
     decrease();
   }
   
   //FUCTION INCREASE FOR ALL '+'
   function increase () {
     document.querySelectorAll('.increase-btn').forEach(perIncrease => {
       if (perIncrease.classList.contains('active')) {
 
       } else {
         perIncrease.addEventListener('click', () => { 
           if (perIncrease.nextElementSibling.classList.contains('incremented')) {
         //  console.log('click')
           } else {
           perIncrease.nextElementSibling.innerHTML = parseInt(perIncrease.nextElementSibling.innerHTML) + 1;
           perIncrease.nextElementSibling.classList.add('incremented');
           if (perIncrease.nextElementSibling.classList.contains('decremented')) {
             perIncrease.nextElementSibling.classList.remove('decremented');
           }
           }
         });
       perIncrease.classList.add('active');
       }
    //   console.log(perIncrease.classList.value + ": " + perIncrease.nextElementSibling.classList.value + ' :' + perIncrease.id);
     })
   }
   
   // FUNCTION FOR DECREASE VOTE VALUE
   function decrease () {
     document.querySelectorAll('.decrease-btn').forEach(perDecrease => {
       if (perDecrease.classList.contains('active')) {
//console.log('active');
       } else {
         perDecrease.addEventListener('click', () => { 
           if (perDecrease.previousElementSibling.classList.contains('decremented') || !perDecrease.previousElementSibling.classList.contains('incremented')) {
          // console.log('click')
           } else {
           perDecrease.previousElementSibling.innerHTML = parseInt(perDecrease.previousElementSibling.innerHTML) - 1;
           perDecrease.previousElementSibling.classList.add('decremented');
           if (perDecrease.previousElementSibling.classList.contains('incremented')) {
             perDecrease.previousElementSibling.classList.remove('incremented');
           }
           }
         });
       perDecrease.classList.add('active');
       }
     })// body...
   }
   function postReply() {
     let commentId = [];
       let newCommentOutput = "";
       
     document.querySelectorAll('.post-reply').forEach(post => {
     let newReplyOutput2 = '';
       
     newReplyOutput2 = document.getElementById(`${post.id.match(/\d/g)[0]}-reply-container`).innerHTML;
       post.addEventListener('click', () => {
      // console.log(post.id);
       console.log(post.previousElementSibling.value);
      
   function addReply(){
     commentId.push(true);
     console.log(newReplyOutput2);
  // // console.log(document.getElementById('new-comment').innerHTML);
     if (post.previousElementSibling.value) {
    document.getElementById(`${post.id.match(/\d/g)[0]}-reply-container`).style.display = "grid";
    // let paragraph = document.createElement('p');
    // paragraph.className ='fw-400 content';
    // paragraph.appendChild(document.createTextNode(document.querySelector('#comment-textarea').value));
    // document.getElementById('new-comment').appendChild(paragraph)
    newCommentOutput = `
    <div class="container bg-light">
      <div class="profile-period">
      <img class="dp" src="${data.currentUser.image.png}" alt="profile picture" />
      <h2 class="fw-700">${data.currentUser.username}</h2>
      <p class="fw-400 cl-dark-gray">just now</p>
      </div>
      <p id="reply-paragraph-${commentId.length}" class="fw-400 content"><span class="cl-blue fw-500" >@</span> </p>
      <div class="vote bg-gray">
      <button id="" class="increase-btn btn" type="submit"><img src="images/icon-plus.svg" alt="" /></button>
      <p class="cl-blue vote-score fw-700">0</p>
      <button id="" class="decrease-btn btn" type="submit"><img src="images/icon-minus.svg" alt="decrease" /></button>
      </div>
      <button id="reply-${parseInt(replies[0].id) + commentId.length}" class="reply cl-blue fw-500" type="submit"><img src="images/icon-reply.svg" alt="reply" />Reply</button>
      </div>`
        console.log(`${post.id.match(/\d/g)[0]}-reply-container`);
      document.getElementById(`${post.id.match(/\d/g)[0]}-reply-container`).style.display = "none"
        document.getElementById(`${post.id.match(/\d/g)[0]}-reply-container`).innerHTML = newCommentOutput;
        document.getElementById(`reply-paragraph-${commentId.length}`).innerText = post.previousElementSibling.value;
        newReplyOutput2 += document.getElementById(`${post.id.match(/\d/g)[0]}-reply-container`).innerHTML;
        document.getElementById(`${post.id.match(/\d/g)[0]}-reply-container`).innerHTML = newReplyOutput2;
        document.getElementById(`${post.id.match(/\d/g)[0]}-reply-container`).style.display = "grid";
        for (let i = 0; i < document.getElementById(`${post.id.match(/\d/g)[0]}-reply-container`).children.length; i++){
        document.getElementById(`${post.id.match(/\d/g)[0]}-reply-container`).children[i].children[2].children[0].classList.remove('active');
        document.getElementById(`${post.id.match(/\d/g)[0]}-reply-container`).children[i].children[2].children[2].classList.remove('active');
        }
     }
     post.previousElementSibling.value = '';
     
     increase();
     decrease();
   }
   addReply();
     })});
     
   }
})
.catch((e) => console.log(e));
