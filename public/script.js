let assets={}

async function updateAssets(){

const role=localStorage.getItem("role") || "nurse"

const response=await fetch(`/assets?role=${role}`)

assets=await response.json()

drawAssets()

}

function drawAssets(){

document.querySelectorAll(".asset").forEach(a=>a.remove())

const search=document.getElementById("search").value.toLowerCase()

Object.keys(assets).forEach(tag=>{

const asset=assets[tag]

if(search && !asset.name.toLowerCase().includes(search)) return

const zone=document.getElementById(asset.zone)

if(zone){

const div=document.createElement("div")

div.className="asset"

div.innerText=asset.name

zone.appendChild(div)

}

})

}

document.getElementById("search").addEventListener("input",drawAssets)

async function loadHistory(){

const response=await fetch("/history")

const data=await response.json()

const list=document.getElementById("history")

list.innerHTML=""

data.forEach(item=>{

const li=document.createElement("li")

li.innerText=item.name+" → "+item.zone+" ("+item.time+")"

list.appendChild(li)

})

}

async function askAI(){

const question=document.getElementById("question").value

const response=await fetch("/ask",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({question})

})

const data=await response.json()

document.getElementById("answer").innerText=data.answer

}

setInterval(()=>{

updateAssets()
loadHistory()

},2000)

updateAssets()
loadHistory()
