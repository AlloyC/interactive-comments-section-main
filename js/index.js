const tweet = document.getElementById("tweets");
let container;
let usernames = [];
let userPics = [];
let replies = [];
let idreplies = [];

//fetching json file
fetch("./js/data.json")
.then((res) => res.json())
.then((data) => {
  console.log(data);
  data.comments.forEach((datum) => {
    usernames.push(datum.user.username);
    userPics.push(datum.user.image.png);
  });

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
    <button id="increase" class="btn" type="submit"><img src="images/icon-plus.svg" alt="" /></button>
    <p class="cl-blue fw-700">${datum.score}</p>
    <button id="decrease" class="btn" type="submit"><img src="images/icon-minus.svg" alt="decrease" /></button>
    </div>
    <button id="reply-${datum.id}" class="reply cl-blue fw-500" type="submit"><img src="images/icon-reply.svg" alt="reply" />Reply</button>
    </div>
    <div id="${datum.id}-reply-container" class="container reply-container hidden"></div>
    </div>`;
  });
  document.querySelectorAll(".reply").forEach(replyBtn => replyBtn.addEventListener("click", () => {
    let replyContainer = document.getElementById(`${parseInt(replyBtn.id.match(/\d/)[0])}-reply-container`);
    let repliesDetails = [];
    data.comments.forEach(userDetails => repliesDetails.push(userDetails.replies));
    //console.log(repliesDetails);

    if (replyContainer.classList.contains('hidden')) {
      replyContainer.classList.remove('hidden');
      let repliesContentEach = [];
      let repliesContent = [];
      let eachReplies = "";
      repliesDetails.forEach(replies => {
        if (replies.length > 1) {
          replies.forEach(contents => {
            if (contents.content) {

              repliesContentEach.push(contents.content);

            } else {
              repliesContentEach;

            }
          });
          repliesContent.push(repliesContentEach);
          repliesContentEach = [];
        } else {
          if (replies.content) {

            repliesContentEach.push(replies.content);

          } else {

            repliesContentEach;

          }
          repliesContent.push(repliesContentEach);
          repliesContentEach = [];
        }
      });

      repliesContent[parseInt(replyBtn.id.match(/\d/)[0]) - 1].forEach(eachReply => eachReplies = eachReply);
      console.log(eachReplies);
      console.log(repliesContent);
      replyContainer.innerHTML;
      `<div class="container bg-light">
      <div class="profile-period">
      <img class="dp" src="${repliesDetails.user.image.png}" alt="profile picture" />
      <h2 class="fw-700">${datum.user.username}</h2>
      <p class="fw-400 cl-dark-gray">${datum.createdAt}</p>
      </div>
      <p class="fw-400 content">${repliesContent[parseInt(replyBtn.id.match(/\d/)[0]) - 1]}</p>
      <div class="vote bg-gray">
      <button id="increase" class="btn" type="submit"><img src="images/icon-plus.svg" alt="" /></button>
      <p class="cl-blue fw-700">${datum.score}</p>
      <button id="decrease" class="btn" type="submit"><img src="images/icon-minus.svg" alt="decrease" /></button>
      </div>
      <button id="reply-${datum.id}" class="reply cl-blue fw-500" type="submit"><img src="images/icon-reply.svg" alt="reply" />Reply</button>
      </div>
      <div id="${datum.id}-reply-container" class="container reply-container hidden"></div>
      `;
    } else {
      replyContainer.classList.add('hidden')
    }
  }));
})
.catch((e) => console.log(e));
