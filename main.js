var mainMenu
var addNewNote
var searchInput
var idCount = 0
var notes = []


const colorTab = [
  "rgb(64, 255, 0)", // zielony
  "rgb(255, 255, 0)",// zolty
  "rgb(0, 255, 255)", //niebieski
  "#E9967A", //lososiowy rozowy
  "#9370DB", //purple
  "#C0C0C0", //szary
  "#FF5733"
]

window.onload = function(){
    Load()
    mainMenu = document.querySelector('.mainMenu')
    addNewNote = document.querySelector('.addNote')
    searchInput = document.querySelector('#searchInput')
    dragMenu(mainMenu)

    //event for adding new notes
    addNewNote.addEventListener("click", function(){
        //console.log("new note added")
        addNote(idCount, 350, 30)
        dragNote(document.getElementById("note"+idCount), idCount)

        idCount++
    })

    //event for searching notes
    searchInput.addEventListener('keyup',()=>{
      document.querySelector(".contents").innerHTML=""
      for(i=0;i<notes.length;i++){
        if(notes[i]["txt"].includes(searchInput.value)){
          addNoteMain(i, notes[i]["txt"], notes[i]["time"])
        }
      }
    })
}



function addNote(id, x, y){
    var newNote = document.createElement("div")
    newNote.classList.add("note")
    newNote.style.top=y+"px"
    newNote.style.left=x+"px"
    newNote.setAttribute("id", "note"+id)
    newNote.innerHTML="<div id='noteNav"+id+"' class='noteNav' ></div>"
    newNote.innerHTML+="<textarea id='nInput"+id+"' placeholder='Utwórz notatkę...' class='noteInput' spellcheck='false'></textarea>"
    newNote.addEventListener('keyup', function(){ // writing insde the note
      var input = document.getElementById("nInput"+id)
      var where = document.getElementById("noteMainContent"+id)
      where.style.color="white"
      where.innerHTML=input.value
      notes[id]["txt"]=input.value

      Save()
      //console.log(notes)
    })
    
    var time = new Date() 
    var minutes= time.getMinutes().toString()
    var hours = time.getHours().toString()

    if(time.getMinutes()<10){
        minutes = "0" + minutes
    }
    if(time.getHours()<10){
        hours = "0" + hours
    }
    var t = hours+":"+minutes

    //get random color
    var randColor = parseInt(Math.random() * colorTab.length)

    document.querySelector(".notesContainer").appendChild(newNote)
    notes.push({"id":id,"txt":null, "pos":[x+"px", y+"px"], "time":t, "color": colorTab[randColor]})
    document.getElementById("noteNav"+id).style.backgroundColor=notes[id]["color"]
    addNoteMain(id, null, t)

    
}
function rewriteNote(id){
  var newNote = document.createElement("div")
    newNote.classList.add("note")
    newNote.style.top=notes[id]["pos"][1]
    newNote.style.left=notes[id]["pos"][0]
    newNote.setAttribute("id", "note"+id)

    newNote.innerHTML="<div id='noteNav"+id+"' class='noteNav'><div class='noteClose'></div><div class='noteSettings'></div></div>"
    if(notes[id]["txt"]==null){
      newNote.innerHTML+="<textarea id='nInput"+id+"'  class='noteInput' spellcheck='false' placeholder='Utwórz notatkę...'></textarea>"
    }else{
      newNote.innerHTML+="<textarea id='nInput"+id+"'  class='noteInput' spellcheck='false' >"+notes[id]["txt"]+"</textarea>"
    }

    newNote.addEventListener('keyup', function(){
      var input = document.getElementById("nInput"+id)
      var where = document.getElementById("noteMainContent"+id)
      where.style.color="white"
      where.innerHTML=input.value
      notes[id]["txt"]=input.value

      Save()
      //console.log(notes)
    })

    document.querySelector(".notesContainer").appendChild(newNote)
    document.getElementById("noteNav"+id).style.backgroundColor=notes[id]["color"]
    
    
}


function addNoteMain(id, txt, time){
    var newNote = document.createElement("div")
    newNote.classList.add("noteMain")
    newNote.setAttribute("id", "noteMain"+id)
    
    newNote.addEventListener('mouseover',()=>{
      newNote.style.backgroundColor = "rgb(92, 90, 90)"
      document.getElementById("noteTime"+id).style.visibility="hidden"
      document.getElementById("hideTime"+id).style.visibility="inherit"
      
    })
    newNote.addEventListener('mouseleave',()=>{
      newNote.style.backgroundColor = "rgb(65, 62, 62)"
      document.getElementById("noteTime"+id).style.visibility="inherit"
      document.getElementById("hideTime"+id).style.visibility="hidden"
    })

    //newNote.innerHTML="<div id='noteTime"+id+"' class='noteMainTimeContainer'>"+hours+":"+minutes+"</div><div id='hideTime"+id+"' onclick='delNote("+id+")' class='hideTime'>X</div><div id='noteMainContent"+id+"'class='noteMainContent' style='color:rgb(163, 163, 163);'>Utwórz notatkę...</div>"
      
    newNote.innerHTML="<div id='noteTime"+id+"' class='noteMainTimeContainer'>"+time+"</div><div id='hideTime"+id+"' onclick='delNote("+id+")' class='hideTime'>X</div>"
    if(txt==null){
      newNote.innerHTML+="<div id='noteMainContent"+id+"'class='noteMainContent' style='color:rgb(163, 163, 163);'>Utwórz notatkę...</div>"
    }else{
      newNote.innerHTML+="<div id='noteMainContent"+id+"'class='noteMainContent'>"+txt+"</div>"
    }
    
    document.querySelector(".contents").appendChild(newNote)
    document.getElementById("noteMain"+id).style.borderTop="4px solid "+notes[id]["color"]
    document.getElementById("noteTime"+id).style.color=notes[id]["color"]
    document.getElementById("hideTime"+id).style.color=notes[id]["color"]
    
}


function delNote(id){
  var note = document.querySelector("#note"+id)
  var noteMain = document.querySelector("#noteMain"+id)
  note.remove()
  noteMain.remove()
  notes.splice(id, 1)
  //console.log(notes)

  document.querySelector(".contents").innerHTML=""
  document.querySelector(".notesContainer").innerHTML=""

  for(i=0;i<notes.length;i++){
    addNoteMain(i, notes[i]["txt"], notes[i]["time"])
    rewriteNote(i)
    dragNote(document.getElementById("note"+i),i)

  }
  idCount--

  Save()
}


function dragNote(elmnt, id) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.querySelector("#noteNav"+id)) {
      document.querySelector("#noteNav"+id).onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;

      pos3 = e.clientX;
      pos4 = e.clientY;

      n = document.querySelectorAll(".note")
      n.forEach(function(note){
        note.style.zIndex = "10"
      })
      document.getElementById(elmnt.id).style.zIndex = "11"
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;

      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
 
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {  
      document.onmouseup = null;
      document.onmousemove = null;
      var posX = document.getElementById(elmnt.id).style.left
      var posY = document.getElementById(elmnt.id).style.top
      notes[id]["pos"] = [posX, posY]
      //console.log(notes)
      Save()
    }
  }
  function dragMenu(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.querySelector(".moveMenu")) {
      /* if present, the header is where you move the DIV from:*/
      document.querySelector(".moveMenu").onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;

      pos3 = e.clientX;
      pos4 = e.clientY;

      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;

      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {   
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }




function Save(){
  localStorage.setItem('notes', JSON.stringify(notes));
}
function Load(){
  notes = JSON.parse(localStorage.getItem('notes'))
  if(notes==null){
    notes=[]
  }else{
    for(i=0;i<notes.length;i++){
      addNoteMain(i, notes[i]["txt"], notes[i]["time"])
      rewriteNote(i)
      dragNote(document.getElementById("note"+i),i)
  
    }
    idCount = notes.length
  }
  //console.log(notes)
}