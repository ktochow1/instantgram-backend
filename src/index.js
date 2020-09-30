const endpoint = "http://localhost:3000/api/v1/posts"

document.addEventListener("DOMContentLoaded", () => {
  getPosts();    
})

function getPosts(){
  fetch(endpoint)
  .then(response => response.json())
  .then(posts => { 

     // let domPostCollection = document.getElementsByClassName('post-container')

    posts.data.forEach(postData => {

    let post = new Post(postData)
    let sortButton = document.querySelector('#sort-button')
    let likeBtn = post.postContainer.children[3]
    let editBtn = post.postContainer.children[4]
    let comSub = post.postContainer.children[7]
    let deleteBtn = post.postContainer.children[6]
    
    function sortedPosts(){
      let postContainer = document.querySelectorAll('.post-container')
      let mainDiv = document.querySelector('#div-container')
      let alphabeticalPosts = Array.from(postContainer).sort((a, b) => {
        nameA = a.children.item(a).innerHTML 
        nameB = b.children.item(b).innerHTML 
        if(nameA < nameB){
          return -1
        }
        if(nameA > nameB){
          return 1
        }
        return 0
      })
      mainDiv.childNodes.forEach((el) => {
        el.remove()
      })
      alphabeticalPosts.forEach((el) => {
        mainDiv.append(el)
      })
      return alphabeticalPosts
    }
    
    sortButton.addEventListener("click", function(e){
      sortedPosts()
    })

    let searchBar = document.getElementById("searchBar")

    //SEARCH FUNCTIONALITY vv

    searchBar.addEventListener("keyup", function(e){
      let val = e.target.value.toLowerCase()
      let posts = document.getElementsByClassName("post-container")
      Array.from(posts).forEach(function(post){
        let title = post.children[0].innerHTML
        if(title.toLowerCase().indexOf(val) != -1){
          post.style.display = 'block'
        } else {
          post.style.display = "none"
        }
        
      })

      handleSearch(sortedPosts, val)
    })



let comments = postData.attributes.comments
comments.forEach(c => {
  // console.log(c.content)
  // let postContainer = document.querySelector(`[data-id='${postData.id}'] .post-container`)
  let newComment = new Comment(c.content)
  // console.log(newComment)
  newComment.content = c.content
  newComment.id = c.id
  newComment.post_id = c.post_id
  
  let commentBox = document.createElement("div")
  
  
  let commentDiv = document.querySelector(`[data-id='${postData.id}'] .comments`)
  // commentDiv.setAttribute("data-id", `${postData.id}`)
  let commentEl = document.createElement("h6")
  let commentElTxt = document.createTextNode(`${newComment.content}`)

  commentBox.appendChild(commentEl)
  commentBox.appendChild(commentElTxt)
  // commentEl.innerHTML += commentElTxt
  // console.log(commentBox)
  commentDiv.appendChild(commentBox)

  // if(c.post_id == postData.id){
  // commentDiv.appendChild(commentEl)
  // commentEl.appendChild(commentElTxt)
  // }
  // console.log(c.id)
  // console.log(postData)
})  

// let likeBtn = post.postContainer.children[3]
// console.log(likeBtn)
// let editBtn = post.postContainer.children[4]
// let comSub = post.postContainer.children[7]
// let deleteBtn = post.postContainer.children[6]

deleteBtn.addEventListener("click", function(e){
  console.log("click")
  deleteFormHandler(e)
})

function addEditForm(e){
      let target = e.target
      // console.log(target)
      let editFormDiv = document.querySelector(`[data-id='${target.id}'] .edit-form`)
      // let editBtn = document.querySelector(`[data-id='${target.id}'] .edit-buttons`)
      // console.log(editDiv)
      let editForm = document.createElement("form")
      let editTitle = document.createElement("input")
      editTitle.setAttribute("type", "text")
      editTitle.setAttribute("value", `${target.parentNode.childNodes[1].innerHTML}`)
      let editImg = document.createElement("input")
      editImg.setAttribute("type", "text")
      editImg.setAttribute("value", `${target.parentNode.childNodes[3].attributes[2].value}`)
      // console.log(target.parentNode.childNodes)
      let editSub = document.createElement("input")
      editSub.setAttribute("type", "submit")
      editFormDiv.appendChild(editForm)
      // editDiv.appendChild(editForm)
      editForm.appendChild(editTitle)
      editForm.appendChild(editImg)
      editForm.appendChild(editSub)
      editForm.addEventListener("submit", function(e){
        e.preventDefault()
        let formTitle = e.target[0].value
        let formUrl = e.target[1].value
        patchFetch(formTitle, formUrl)
        // e.stopPropagation()
        // console.log(e)
      })
}

editBtn.addEventListener("click", function(e){
      // editFormHandler(e)
      e.preventDefault();
      addEditForm(e);
      
     
})
     
function patchFetch(title, image_url){
      const bodyData = {title, image_url}
      fetch(`http://localhost:3000/api/v1/posts/${postData.id}`, {
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json"
        },
        method: 'PATCH',
        body: JSON.stringify(bodyData),
        }).then(response => response.json())
        .then(data =>  {
          console.log(data)
        //make the page reload after submitting patch
          let currentContainer =  document.querySelector(`[data-id='${data.data.id}']`)
          currentContainer.firstChild.innerHTML = data.data.attributes.title
          currentContainer.childNodes[3].attributes[1].value = data.data.attributes.image_url
        })
}
    
function deleteFormHandler(e){
      const postOb = post
      // console.log(postOb)
      deleteFetch(postOb)
}



comSub.addEventListener("submit", function(e){
       e.preventDefault();

       comment = new Comment()
       console.log()
       let val = e.srcElement[0].value
       comment.content = val
       postComment(val)
}) 

function postComment(val){
fetch(`http://localhost:3000/api/v1/posts/${postData.id}/comments`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
  "content": val
  }) 
})
.then(res => res.json())
.then(ob => {
  console.log(ob)
  let content = ob.data.attributes.content    
  let currentContainer = document.querySelector(`[data-id='${postData.id}'], #post-container`)
    // console.log(currentContainer)
  let comDiv = document.createElement("div")
  comDiv.setAttribute("class", "comment-div")
    // console.log(comDiv)
      // let comLabel = document.createElement("h5")
      // let comLabelTxt = document.createTextNode("Comments")
      // comLabel.setAttribute("text", "Comments")
      // console.log(comLabel)
  let comContent = document.createElement("h6")
  let comContentTxt = document.createTextNode(`${content}`)
      // comContent.setAttribute("innerHTML", `${content}`)
  currentContainer.append(comDiv)
      // comDiv.append(comLabel)
      // comLabel.appendChild(comLabelTxt)
  
  comContent.appendChild(comContentTxt)
  comDiv.append(comContent)
        // console.log(content)
  })
}

function deleteFetch(postOb){
// console.log(postOb)
  const bodyData = {postOb}
  fetch(`http://localhost:3000/api/v1/posts/${postOb.id}`, {
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json"
    },
    method: "DELETE"
   }).then(response => response.json())
   .then(data => {
        // console.log(data)
     let currentPost = document.querySelector(`[data-id='${data.data.id}']`)
     currentPost.remove()
        // DELETE WORKS BUT POSTS DELETE AFTER REFRESH
        // console.log(post)
        // let post = document.querySelector(`[data-id='${data.data.id}']`);
    })
      // this.location.reload()
}

likeBtn.addEventListener("click", function(e){
  e.preventDefault();
  console.log("click")
  likes(e);
    
})
function likes(e){
  
  let postId = e.sourceElement
  console.log(e)
  // .parentNode.attributes[0].nodeValue
  let more = parseInt(e.target.innerText[2]) + 1
  fetch(`http://localhost:3000/api/v1/posts/${post.id}`,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": more
    })
    }).then(res => res.json())
    .then(newlike => {   
      console.log(newlike)   
      newlike = post.postContainer.children[3].textContent;
        newlike = `♥ ${more}` 
      })
}
})



    const createPostForm = document.querySelector('#post-form');
  // // const body = document.getElementsByTagName('h2')
  
  //   let sortButton = document.createElement("button")
  //   let sortButtonText = document.createTextNode("Sort")
  //   sortButton.appendChild(sortButtonText)
  //   let div = document.querySelector("#div-container");
  //   let sortDiv = document.createElement('div')
    // createPostForm.append(sortDiv)
    // body.appendChild(sortButton)
    // createPostForm.appendChild(sortButton)
      
      createPostForm.addEventListener("submit", (e) => {
        e.preventDefault()
        createFormHandler(e) 
      })

      function createFormHandler(e){
        const title = document.querySelector("#input-title").value;
        const image_url = document.querySelector("#input-url").value;
        postFetch(title, image_url);

      }

      

    
function postFetch(title, image_url){
        const bodyData = {title, image_url}
        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", //explicit about content type
            "Accept": "application/json"
          },
          body: JSON.stringify(bodyData)
        })
        .then(response => response.json())
        .then(data => {
          // console.log(data)

          // bodyData.data.attributes.like = 0
          // let current_post = document.querySelector(`[data-id='${bodyData.id}']`)
          let div = document.querySelector("#div-container");

          let postC = document.createElement("div");
          postC.setAttribute("id", "post-container");
          postC.setAttribute("data-id", `${bodyData.id}`);

          let pTitle = document.createElement("h3");
          let h3Text = document.createTextNode(`${data.data.attributes.title}`)
          let img = document.createElement("img");
          img.setAttribute("src", `${data.data.attributes.image_url}`)
          img.setAttribute("height", "350");
          img.setAttribute("width", "250");

          
          // likeB.post_id = bodyData.data.id
          // console.log(likeB)
          let eBtn = document.createElement("button")
          let ebtnTxt = document.createTextNode("Edit");
          let lBtn = document.createElement("h5");
          let lTxt = document.createTextNode(`♡ ${data.data.attributes.likes}`);
          // lTxt.setAttribute("value", `♡ ${0}`)
          let dBtn = document.createElement("button");
          let dTxt = document.createTextNode("Delete");
          
          let comments = document.createElement("div");
          comments.setAttribute("id", "comments");
          let commentForm = document.createElement("FORM");
          commentForm.setAttribute("id", "comment-form");
          let comTxtArea = document.createElement("INPUT");
          comTxtArea.setAttribute("type", "textarea");
          comTxtArea.setAttribute("placeholder", "write your comment here")
          let comSub = document.createElement("INPUT");
          comSub.setAttribute("type", "submit")
          comSub.setAttribute("value", "Submit")

          div.appendChild(postC)
          postC.appendChild(pTitle)
          pTitle.appendChild(h3Text)
          postC.appendChild(img)
          postC.appendChild(lBtn)
          lBtn.appendChild(lTxt)
          postC.appendChild(eBtn)
          eBtn.appendChild(ebtnTxt)
          postC.appendChild(dBtn)
          dBtn.appendChild(dTxt)
          postC.appendChild(comments);
          comments.appendChild(commentForm);
          commentForm.appendChild(comTxtArea);
          commentForm.appendChild(comSub);
})}

  })}

  class Post {
    constructor(attributes){
      this.id = attributes.id
      this.postContainer = document.createElement("div");
      this.postContainer.setAttribute("data-id", `${this.id}`);
      this.postContainer.setAttribute("class", "post-container")
      let fcontainer = document.querySelector("#div-container")
      this.postContainer.innerHTML =  `
        <h3 class='post-title'>${attributes.attributes.title}</h3>
        <img data-id='${this.id}' id='imgUrl' src='${attributes.attributes.image_url}' width='250' height='350'>
        <label>Likes</label><h5 class='like-buttons' id='like' like-data-id='${this.id}'>♡ ${attributes.attributes.likes}</h5> 
        <button  class='edit-buttons' id='${this.id}'>Edit</button>
        <div class='edit-form'></div>
        <button id='deleteBtn' class='buttons' data-id='${attributes.id}'>Delete</button>
        <div class='comments'><form data-id='${attributes.id}' class='comment-form'>
        <input type='textarea' placeholder='write your comment here'><input id='comment-submit' type='submit' value='Submit'></form>
        <b>Comments</b></div>
        `
        fcontainer.appendChild(this.postContainer)
    }
  }

  class Comment {
    contructor(content){
      this.content = "comment"

    }}