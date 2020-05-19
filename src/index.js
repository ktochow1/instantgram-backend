const endpoint = "http://localhost:3000/api/v1/posts"

document.addEventListener("DOMContentLoaded", () => {
  getPosts();
  const createPostForm = document.querySelector('#post-form');
  createPostForm.addEventListener("submit", (e) => {
    createFormHandler(e)
  let editBtn = document.querySelector("#edit-button");
  editBtn.addEventListener("click", event => {
    console.log('click');
  })
})
})

function getPosts(){
  fetch(endpoint)
  .then(response => response.json())
  .then(posts => {
    posts.data.forEach(post => {
      const markup = `<div data-id=${post.id}>
        <h3>${post.attributes.title}</h3><br>
        <img src=${post.attributes.image_url} height="200" width="250"><br>
        <button id="edit-button" data-id=${post.id}>Edit</button><br>
        </div>`;
        document.querySelector('#post-container').innerHTML += markup
    });
  });
};

function createFormHandler(e){
  e.preventDefault();
  const formTitle = document.querySelector("#input-title").value;
  const formUrl = document.querySelector("#input-url").value;
  postFetch(formTitle, formUrl);
  // const submit = document.querySelector("#submit-button");
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
  .then(post => {
    // console.log(post);
    const postData = post.data.attributes
    const postMarkup = `
    <div data-id=${post.id}>
    <h3>${postData.title}</h3>
    <img src=${postData.image_url} height="200" width="250">
    <button data-id=${postData.id}>Edit</button>
    </div>`;
    document.querySelector("#post-container").innerHTML += postMarkup;
  })

}
