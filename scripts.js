/* eslint-disable */
var pageList = new Array();
var data = new Array();
var flag = true;
var currentPage = 1;
var numberPerPage = 5;
var numberOfPages = 0;
window.onload = function(){
    const btn = document.getElementById('search-btn')
    btn.addEventListener("click",throttle(getapi,1500))
}


const getapi= async()=> { 
    const url = "https://api.lyrics.ovh/suggest"
    const search = `${url}/${document.getElementById('searchbox').value}`
    const response = await fetch(search); 
    data = await response.json(); 
    numberOfPages = Math.ceil(data.data.length / numberPerPage);
    currentPage = 1;
    loadList(data.data);
}

function loadList(list) {
    var begin = ((currentPage - 1) * numberPerPage);
    var end = begin + numberPerPage;

    pageList = list.slice(begin, end);
    var div = document.getElementById("infos");
    div.innerHTML = "";
    
    for (let r = 0; r < pageList.length; r++) {
        var li = document.createElement("div");
        li.setAttribute('class','list');
        let para = document.createElement('p');
        const lyrics = document.createElement('button');
        lyrics.setAttribute('class','lyrics_btn')
        lyrics.innerHTML = 'Show Lyrics';
        lyrics.addEventListener('click',event=>{
            throttle(lyricspage(pageList[r].artist.name,pageList[r].title),1500);
        })
        let bold = document.createElement('strong');
        bold.appendChild(document.createTextNode(`${pageList[r].artist.name} `));
        para.appendChild(bold);
        para.appendChild(document.createTextNode(`- ${pageList[r].title}`));
        li.appendChild(para);
        li.appendChild(lyrics);
        div.appendChild(li);
    }
    const next = document.createElement('button');
    next.setAttribute('class','next_btn');
    next.innerHTML = (flag && currentPage!==numberOfPages) || currentPage===1 ? "Next":"Previous"   
    next.addEventListener('click',event=>{
        if(flag || currentPage===1) flag = currentPage!==numberOfPages
        currentPage += flag ? 1:-1;
        loadList(data.data);
    });
    div.appendChild(next);
}

async function lyricspage(artist,title){
    let div = document.getElementById("infos");
    let li = document.createElement("div");
    let header = document.createElement('h1');
    let lyrics = document.createElement('div');
    li.setAttribute('class','lyrics_header');
    const url = "https://api.lyrics.ovh/v1";
    const search = `${url}/${artist}/${title}`;
    const response = await fetch(search); 
    data = await response.json(); 
    console.log(data);
    lyrics.setAttribute('class','lyrics_text');
    header.appendChild(document.createTextNode(`${artist} - ${title}`));
    lyrics.appendChild(document.createTextNode(data.lyrics));
    li.appendChild(header);
    li.appendChild(lyrics);
    div.innerHTML = "";
    div.appendChild(li);
}

function throttle (fn, limit){
    let flag = true;
    return function(){
      let context = this;
      let args = arguments;
      if(flag){
        fn.apply(context, args);
        flag = false;
        setTimeout(() => {
          flag=true;
        }, limit);
      }
    }
  }
  /* eslint-enable */