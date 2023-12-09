function saveTip() {
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const subject = document.getElementById('subject').value;
    const tip = document.getElementById('tip').value;
  
    const tipData = {
      name: name,
      date: date,
      subject: subject,
      tip: tip
    };
  
    const tips = JSON.parse(localStorage.getItem('tips')) || [];
    tips.push(tipData);
    localStorage.setItem('tips', JSON.stringify(tips));
  
    displayTip(tipData);
  }
  
  function displayTip(tipData) {
    const tipSection = document.getElementById('tipSection');
    const tipDiv = document.createElement('div');
    const tipContent = document.createElement('p');
  
    tipContent.innerHTML = `<strong>${tipData.name} (${tipData.date}): ${tipData.subject}</strong><br>${tipData.tip}`;
    tipDiv.appendChild(tipContent);
    tipSection.appendChild(tipDiv);
  }
  
  function loadTips() {
    const tips = JSON.parse(localStorage.getItem('tips')) || [];
    const tipSection = document.getElementById('tipSection');
    tipSection.innerHTML = '';
  
    tips.forEach(tip => {
      displayTip(tip);
    });
  }
  
  function postComment() {
    const commentName = document.getElementById('commentName').value;
    const commentText = document.getElementById('commentText').value;
  
    const comment = { name: commentName, comment: commentText };
    saveComment(comment);
    displayComment(comment);
  }
  
  function saveComment(comment) {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push(comment);
    localStorage.setItem('comments', JSON.stringify(comments));
  }
  
  function displayComment(comment) {
    const commentSection = document.getElementById('commentSection');
    const commentDiv = document.createElement('div');
    const commentContent = document.createElement('p');
  
    commentContent.innerHTML = `<strong>${comment.name}:</strong> ${comment.comment}`;
    commentDiv.appendChild(commentContent);
    commentSection.appendChild(commentDiv);
  }
  
  function loadComments() {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    const commentSection = document.getElementById('commentSection');
    commentSection.innerHTML = '';
  
    comments.forEach(comment => {
      displayComment(comment);
    });
  }
  
  document.getElementById('tipForm').addEventListener('submit', function(event) {
    event.preventDefault();
    saveTip();
    this.reset();
  });
  
  document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    postComment();
    this.reset();
  });
  
  loadTips();
  loadComments();