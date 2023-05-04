var coll = document.getElementsByClassName("collapsible");
let item_image = document.querySelector("#item-image");

var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}


document.addEventListener("DOMContentLoaded", e =>{

    target_object = JSON.parse(localStorage.getItem("selected_item"));
    item_image.querySelector("img").setAttribute("src",target_object["item_image"])
    item_image.querySelector("span").innerText = target_object["item_name"]
})