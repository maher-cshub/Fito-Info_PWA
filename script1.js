let user_search_input = document.getElementById("user-search-input");
let all_items = document.getElementById("results-area");
let info_btns = document.querySelectorAll("#item-info-btn");


//events

user_search_input.oninput = search_items;

info_btns.forEach(button =>{
    button.addEventListener("click",getInfo);
})


function search_items(e){
    let input = String(e.srcElement.value);
    let items = Array.from(all_items.children);
    console.log(items)
    items.forEach(element => {
        console.log(element.children[1].childNodes[1].innerText)
        if(String(element.children[1].childNodes[1].innerText).trim().toLowerCase().startsWith(input.trim().toLowerCase())){
            element.style.removeProperty("display");
        }
        else{
            element.style.display = "none"
        }
        
    });

}

function getInfo(e){
    //get item id 
    const chosen_item = e.target.offsetParent.parentElement
    item_object = {}
    item_object["item_id"] = chosen_item.getAttribute("item_id")
    item_object["item_image"] = chosen_item.querySelector("#item-image > img").getAttribute("src")
    item_object["item_name"] = chosen_item.querySelector("#item-title").innerText
        /*image and name
    */
    localStorage.setItem("selected_item",JSON.stringify(item_object))
    window.location.href = "details.html"
}