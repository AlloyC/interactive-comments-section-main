const body = document.querySelector('body');
const tweets = document.getElementById('tweets');
let replyIndex;
let replyParent;
let clickReplyExternal;
let replyingToBtn;
let replyBtnEx;
let reload = true;
let exComment;
let exReplies;
let edited = false;
let newReply;
let exDelete;
let lastClicked;
let editBtnId;

fetch('js/data.json')
.then(res => res.json())
.then(data => {
  console.log(data);
  function fillingDOM () {
    
    let tweetsOutput = '';
    let repliesOutput = '';
    let userName = data.currentUser.username;
    let userImg = data.currentUser.image.png;
    let index = 0;
    let repliesIndex = 0;
  
  data.comments.forEach(data => {
          data.replies.forEach(replies => {
          if (replies.content) {
            let replyButton;
            let replyCont;
            if (replies.user.username == userName) {
              replyButton = `
              <div class="delete-edit">
               <button class="delete-btn | fw-500 cl-red"><img src="./images/icon-delete.svg"/>Delete</button>
               <button id="edit-${repliesIndex}-${index}-btn" class="edit-btn | fw-500 cl-blue"><img src="./images/icon-edit.svg"/>Edit</button>
              </div>
              `
            }
            else {replyButton = `<button id="comments-${repliesIndex}-${index}-btn" class="reply-btn | fw-500 cl-blue"><img src="./images/icon-reply.svg"/>Reply</button>`}
            if (replies.user.username == userName) {
              replyCont = 
              `<div id="create-replies__${repliesIndex}-${index}" class="update create-replies hidden bg-light">
            <div class="name-img-date">
              <img class="comment-img" src="${replies.user.image.png}" alt="user picture" />
              <h2 class="comment-name">${replies.user.username}</h2>
            </div>
            <textarea class="content textarea" name=""  rows="5"></textarea>
            <div class="vote bg-gray">
              <button id="vote-up-${replies.id}" class="btn-up | btn"><img src="./images/icon-plus.svg" alt="increase sign"/></button>
              <p class="vote-val">${replies.score}</p>
              <button id="vote-down-${replies.id}" class="btn-down | btn"><img src="./images/icon-minus.svg" alt="decrease sign"/></button>
            </div>
            ${replyButton}
            <button id="create-replies__${repliesIndex}-${index}-btn" class="send-reply update-btn reply-btn | fw-500 cl-blue">update</button>
          </div>`
              
            } else {
              replyCont = 
              `<div id="create-replies__${repliesIndex}-${index}" class="create-replies hidden bg-light">
            <img class="comment-img" src="${userImg}" alt="profile picture" />
            <textarea class="textarea" name=""  rows="5"></textarea>
            <button id="create-replies__${repliesIndex}-${index}-btn" class="send-reply reply-btn | fw-500 cl-blue"><img src="./images/icon-reply.svg"/>Reply</button>
          </div>
              `
            }
          repliesOutput +=  `
          <div class="replies">
          <div class="container hidden bg-light">
            <div class="name-img-date">
              <img class="comment-img" src="${replies.user.image.png}" alt="user picture" />
              <h2 class="comment-name">${replies.user.username}</h2>
              <p class="created-at">${replies.createdAt}</p>
            </div>
            <p id="content-${replies.id}" class="content"><span class="cl-blue fw-500">@${replies.replyingTo} </span><span>${replies.content}</span></p>
            <div class="vote bg-gray">
              <button id="vote-up-${replies.id}" class="btn-up | btn"><img src="./images/icon-plus.svg" alt="increase sign"/></button>
              <p class="vote-val">${replies.score}</p>
              <button id="vote-down-${replies.id}" class="btn-down | btn"><img src="./images/icon-minus.svg" alt="decrease sign"/></button>
            </div>
            ${replyButton}
          </div>
          ${replyCont}
      </div>`
      repliesIndex++
          } else {
            repliesOutput = '';
          }
          })
          
    tweetsOutput += `
    <div id="comments-${index}" class="comment-reply-container">
      <div class="container bg-light">
        <div class="name-img-date">
          <img class="comment-img" src="${data.user.image.png}" alt="user picture" />
          <h2 class="comment-name">${data.user.username}</h2>
          <p class="created-at">${data.createdAt}</p>
        </div>
        <p class="content"></p>
        <div class="vote bg-gray">
              <button id="vote-up-${data.id}" class="btn-up | btn"><img src="./images/icon-plus.svg" alt="increase sign"/></button>
              <p class="vote-val">${data.score}</p>
              <button id="vote-down-${data.id}" class="btn-down | btn"><img src="./images/icon-minus.svg" alt="decrease sign"/></button>
            </div>
        <button id="comments-${index}-btn" class="reply-btn | fw-500 cl-blue"><img src="./images/icon-reply.svg"/>Reply</button>
      </div>
      <div class="div">
       ${repliesOutput}
       <div id="create-replies-${index}" class="create-replies hidden bg-light">
            <img class="comment-img" src="${userImg}" alt="profile picture" />
            <textarea class="textarea" name=""  rows="5"></textarea>
            <button id="create-replies-${index}-btn" class="send-reply reply-btn | fw-500 cl-blue"><img src="./images/icon-reply.svg"/>Reply</button>
        </div>
      </div>
    </div>
    `
    repliesOutput = '';
    tweets.style.display = 'none';
    tweets.innerHTML = tweetsOutput;
    document.querySelector(`#comments-${index} .container .content`).innerText = data.content;
      document.querySelectorAll('.comment-name').forEach(commentName => commentName.innerText == userName? commentName.innerHTML = `${userName} <span class="you fw-500 cl-light bg-blue">you</span>`: commentName = commentName)
    
    tweetsOutput = tweets.innerHTML;
    index++;
  })
  tweetsOutput += `
    <div id="create-comment" class="create-replies bg-light">
      <img class="comment-img" src="${data.currentUser.image.png}" alt="profile picture" />
      <textarea class="textarea" name=""  rows="5" placeholder="Add a comment..."></textarea>
      <button class="send cl-light bg-blue fw-500">SEND</button>
    </div>
  `
  tweets.style.display = 'block';
    tweets.innerHTML = tweetsOutput;
  document.querySelector('.send').addEventListener('click', addComment)
   if (typeof externalReplyBtn != 'undefined') {
    
    reload = true;
    clickReply();
  }
  // SHOWING REPLIES ON REPLY CLICKED
  
  document.querySelectorAll('.reply-btn').forEach(replyBtn => {
    replyBtn.addEventListener('click', () => {replyBtnEx = replyBtn.id; reload = false; clickReply()})});
  function clickReply() {
    let replyBtn;
    if (!reload) {
     replyBtn = document.getElementById(replyBtnEx);
    } 
    else {
       replyBtn = document.getElementById(externalReplyBtn);
    }
      replyIndex = parseInt(replyBtn.parentNode.id.match(/\d$/g));
    if (replyBtn.classList.contains('send-reply')) {
      replyParent = replyBtn.parentNode.id;
      if (document.querySelector(`#${replyParent} .textarea`).value) {
        if (!replyBtn.parentNode.parentNode.classList.contains('replies')) {
        externalReplyBtn = replyingToBtn.id;
      } else {
       externalReplyBtn = document.getElementById(replyBtnEx).parentNode.parentNode.parentNode.previousElementSibling.lastElementChild.id;
      }
        addNewReply();
      }
    } else {
      if (!replyBtn.classList.contains('send-reply')) {
      replyingToBtn = replyBtn;
      }
      
      if (replyBtn.parentNode.nextElementSibling.lastElementChild.classList.contains('hidden') || (replyBtn.parentNode.parentNode.classList.contains('replies') && replyBtn.parentNode.nextElementSibling.classList.contains('hidden'))) {
       
       if (lastClicked != replyBtn && typeof lastClicked != "undefined" && !lastClicked.classList.contains('send-reply') && lastClicked.parentNode.parentNode.classList.contains('replies') /*&& replyBtn.parentNode.parentNode.classList.contains('replies')*/) {
         lastClicked.parentNode.nextElementSibling.classList.add('hidden')
         if (!replyBtn.parentNode.parentNode.classList.contains('replies')) {
           for (let i = 0; i < lastClicked.parentNode.parentNode.parentNode.children.length; i++) {
             if (lastClicked.parentNode.parentNode.parentNode.children[lastClicked.parentNode.parentNode.parentNode.children.length - 1] == lastClicked.parentNode.parentNode.parentNode.lastElementChild) {
               lastClicked.parentNode.parentNode.parentNode.children[i].classList.add('hidden')
             } else {
           lastClicked.parentNode.parentNode.parentNode.children[i].children[0].classList.add('hidden')
             }
           }
         }
       }
       
        if ( lastClicked != replyBtn && typeof lastClicked != "undefined" && !lastClicked.classList.contains('send-reply') && !lastClicked.parentNode.parentNode.classList.contains('replies') && !replyBtn.parentNode.parentNode.classList.contains('replies')) {
         let lastChildren = lastClicked.parentNode.nextElementSibling.children;
         for (let i = 0; i < lastChildren.length; i++) {
          if(!lastChildren[i].classList.contains('hidden') && lastChildren[i].children[0].classList.contains('hidden')) {
            lastChildren[i].children[0].classList.add('hidden');
          } else {
            lastChildren[i].classList.add('hidden');
          }
        }
        }
        
        if (!(replyBtn.parentNode.parentNode.classList.contains('replies') && replyBtn.parentNode.nextElementSibling.classList.contains('hidden'))) {
        let children = replyBtn.parentNode.nextElementSibling.children;
        for (let i = 0; i < children.length; i++) {
          if(!children[i].classList.contains('hidden') && children[i].children[0].classList.contains('hidden')) {
            children[i].children[0].classList.remove('hidden');
          } else {
            children[i].classList.remove('hidden');
          }
        }
        } else {
          replyBtn.parentNode.nextElementSibling.classList.remove('hidden')
        }
      } else {
        if (!(replyBtn.parentNode.parentNode.classList.contains('replies') && !replyBtn.parentNode.nextElementSibling.classList.contains('hidden'))) {
        let children = replyBtn.parentNode.nextElementSibling.children;
        for (let i = 0; i < children.length; i++) {
          if(!children[i].classList.contains('hidden') && !children[i].children[0].classList.contains('hidden') && i != children.length - 1) {
            children[i].children[0].classList.add('hidden');
          } else {
            children[i].classList.add('hidden');
            if (!lastClicked.classList.contains('send-reply') && !lastClicked.parentNode.nextElementSibling.classList.contains('hidden') && lastClicked.parentNode.parentNode.classList.contains('replies')) {
              lastClicked.parentNode.nextElementSibling.classList.add('hidden')
            }
          }
        }
        } else {
          replyBtn.parentNode.nextElementSibling.classList.add('hidden')
        }
      }
    }
    lastClicked = replyBtn;
    clickReplyExternal = () => clickReply();
  }
  // ADDING DELETE BTN FUNCTIONALITY
  document.querySelectorAll('.delete-btn').forEach(DeleteBtn => DeleteBtn.addEventListener('click',() => {exDelete = DeleteBtn.nextElementSibling.id; deletePopUp()}));
  
  function deletePopUp() {
    if (edited) {
      
    } else {
    document.querySelector('.card').classList.remove('hidden');
    }
  }
  
  // ADDING EDIT BTN FUNCTIONALITY
  
  document.querySelectorAll('.edit-btn').forEach(edit => edit.addEventListener('click',() => {editBtnId = edit.id; editComment()}));
  
  function editComment() {
    data.comments.forEach(comment => comment.replies.forEach(replies => {if(replies.id == document.getElementById(editBtnId).parentNode.previousElementSibling.previousElementSibling.id.match(/\d+.*\d*/g)[0]) { 
      document.getElementById(editBtnId).parentNode.parentNode.nextElementSibling.children[1].value = document.getElementById(editBtnId).parentNode.previousElementSibling.previousElementSibling.lastElementChild.innerText;
      document.getElementById(editBtnId).parentNode.parentNode.classList.add('hidden');
      document.getElementById(editBtnId).parentNode.parentNode.nextElementSibling.classList.remove('hidden');
      exComment = comment;
      exReplies = replies;
      edited = true;
       }
    }))
  }
  // ADDING VOTE FUNCTIONALITY
  let exBtn;
  document.querySelectorAll('.btn-up').forEach(btnUp => btnUp.addEventListener('click',() => { exBtn = btnUp.id;if (!document.getElementById(exBtn).classList.contains('incremented')) {increment()}}))
  
  document.querySelectorAll('.btn-down').forEach(btndown => btndown.addEventListener('click',() => { exBtn = btndown.id;if (!document.getElementById(exBtn).classList.contains('decremented')) {decrement()}}))
  function increment() {
    data.comments.forEach(comments => {
      if (comments.id == exBtn.match(/\d+.*\d*/g)[0] && typeof comments.incremented == "undefined") {
        comments.score = parseInt(comments.score) + 1;
        document.getElementById(exBtn).nextElementSibling.innerText = comments.score;
        comments.incremented = true;
      } else {
        comments.replies.forEach(replies => {
          if (replies.id == exBtn.match(/\d+.*\d*/g)[0] && typeof replies.incremented == 'undefined') {
            replies.score = parseInt(replies.score) + 1;
            document.getElementById(exBtn).nextElementSibling.innerText = replies.score;
          replies.incremented = true;
          }
        })
      }
    })
  }
  
  function decrement() {
    data.comments.forEach(comments => {
      if (comments.id == exBtn.match(/\d+.*\d*/g)[0] && typeof comments.incremented != "undefined") {
        comments.score = parseInt(comments.score) - 1;
        document.getElementById(exBtn). previousElementSibling.innerText = comments.score;
       delete comments.incremented;
      } else {
        comments.replies.forEach(replies => {
          if (replies.id == exBtn.match(/\d+.*\d*/g)[0] && typeof replies.incremented != 'undefined') {
            replies.score = parseInt(replies.score) - 1;
            document.getElementById(exBtn). previousElementSibling.innerText = replies.score;
         delete replies.incremented;
          }
        })
      }
    })
  }
  }
  fillingDOM();
  // ADDING NEW COMMENT VALUES TO JSON  FILE
  let lastId = 0.001;
  function addComment() {
    let newContent = document.getElementById('create-comment').children[1].value;
    if (newContent) {
    let newCommentObj = {
      id: lastId,
      content: newContent,
      createdAt: "just now",
      score: 0,
      user: {image: data.currentUser.image,
              username: data.currentUser.username},
      replies: []
    };
    data.comments.push(newCommentObj);
    lastId += 0.001;
    fillingDOM();
    }
  };
  
  //ADDING NEW REPLIES
  lastRep = 1
  function addNewReply() {
    if (edited && document.getElementById(editBtnId).parentNode.previousElementSibling.previousElementSibling.previousElementSibling.children[1].innerText != data.currentUser.username) {
      let replyingTo = lastClicked;
    }
    newReply = {
      id: `${replyIndex}.${lastRep}`,
      content: document.querySelector(`#${replyParent} .textarea`).value,
      createdAt: 'just now',
      score: 0,
      replyingTo: replyingToBtn.previousElementSibling.previousElementSibling.previousElementSibling.children[1].innerText,
      user: {image: data.currentUser.image,
              username: data.currentUser.username}
    };
    lastRep++
    if (edited && document.getElementById(editBtnId).parentNode.previousElementSibling.previousElementSibling.previousElementSibling.children[1].innerText == data.currentUser.username) {
      newReply.replyingTo = exComment.replies[exComment.replies.indexOf(exReplies)].replyingTo;
      newReply.score = exComment.replies[exComment.replies.indexOf(exReplies)].score;
      newReply.incremented = exComment.replies[exComment.replies.indexOf(exReplies)].incremented;
    }
    if (edited) {
    slicing();
    edited = false;
    
    } else {
    data.comments[replyIndex].replies.push(newReply)};
    fillingDOM();
  }
  function slicing() {
      exComment.replies.splice(exComment.replies.indexOf(exReplies),1,newReply);
      }
      
  // ADDING CONFIRM DELETE FUNCTIONALITY
  document.getElementById('confirm-delete').addEventListener('click',() => {
    let textContentVal = document.getElementById(exDelete).parentNode.previousElementSibling.previousElementSibling.lastElementChild.innerText;
    data.comments.forEach(comment => {
      comment.replies.forEach(replies => {
      if (replies.content == textContentVal) { 
    comment.replies.splice(comment.replies.indexOf(replies),1);
    document.querySelector('.card').classList.add('hidden');
    fillingDOM();
    }
    })})
    });
    // ADDING CANCEL FUNCTIONALILY
    document.getElementById('cancel').addEventListener('click',() => document.querySelector('.card').classList.add('hidden'));
  
  })
.catch((error) => console.log(error))