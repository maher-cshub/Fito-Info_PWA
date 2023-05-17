
import firebase_app from "./util.js"
import {getDatabase , ref ,onValue,onChildAdded,onChildRemoved} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
let user_search_input = document.getElementById("user-search-input");
user_search_input.oninput = search_items;

const database = getDatabase(firebase_app);

const results_area = document.getElementById("results-area");

document.addEventListener("DOMContentLoaded",refreshData);


let info_btns = null;


//events

function initVars(){
    info_btns = document.querySelectorAll("#item-info-btn");
    info_btns.forEach(button =>{
        button.addEventListener("click",getInfo);
    })
    return
}


function getInfo(e){
    //get item id 
    const chosen_item = e.target.offsetParent.parentElement;
    let item_id = chosen_item.getAttribute("item_id")
    localStorage.setItem("selected_item_to_preview",item_id)
    window.location.href = "details.html"
}



function search_items(e){
    let all_items = document.getElementById("results-area");
    let input = String(e.srcElement.value);
    let items = Array.from(all_items.children);
    items.forEach(element => {
        if(String(element.children[1].childNodes[1].innerText).trim().toLowerCase().startsWith(input.trim().toLowerCase())){
            element.style.removeProperty("display");
        }
        else{
            element.style.display = "none"
        }
        
    });

}

function saveElement(element){
    const item = document.createElement("div")
    item.setAttribute("id","item");
    item.setAttribute("item_id",element[0]);
    item.innerHTML = `
        <div id="item-image">
            <img src=${element[1]["image"]} alt=${element[1]["name"]}>
        </div>
        <div id="item-details">
            <h1 id="item-title">${element[1]["name"]}</h1>
            <button class="info-btn-cls" id="item-info-btn">GET INFO</button>

        </div>
    `
    
    results_area.appendChild(item);
    return
}

async function getAllItems(){
    try {  
        const items_ref = ref(database,"items");
        
        await onValue(items_ref,function(snapshot){
            if (snapshot.exists()){
                let items = Object.entries(snapshot.val())
                localStorage.setItem("items",JSON.stringify(items))
            }
            else{
                localStorage.setItem("items",JSON.stringify([]))
            }
        });
    } catch (error) {
        alert("please check your internet connection")
    }
}


async function refreshData(){

    results_area.innerHTML = "";
    
    await getAllItems(); 

    let items = JSON.parse(localStorage.getItem("items"));
    console.log(items)
    if (items.length > 0){
        items.forEach(element => {
            saveElement(element);
        });
    }
    initVars()
    return
}



onChildAdded(ref(database,"items"),(snapshot)=>{
    
    let items =  JSON.parse(localStorage.getItem("items"));
    if (items == null || items == undefined)
    {
        refreshData()
        return
    }

    //check if child exist in client
    const exist = items.some((element)=>{
        return element[1]["name"] == snapshot.val()["name"]
    })
    if (exist == false){
        localStorage.removeItem("items");
        refreshData()
        return
    }
})


//--------------------item removed (done)
onChildRemoved(ref(database,"items"),(snapshot)=>{
    const deleted_item = document.querySelector(`[item_id="${snapshot.key}"]`);
    deleted_item.remove();
    let items = JSON.parse(localStorage.getItem("items"));
    items = items.filter(item => !(item[0] == snapshot.key));
    localStorage.setItem("items",items);
})


setInterval(()=>{
    localStorage.removeItem("items");
    refreshData()
},60000)

//refreshData()