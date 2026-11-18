const grid=document.querySelector("#people-grid");
const filters=document.querySelector("#filters");
const searchInput=document.querySelector("#search-input");
const count=document.querySelector("#result-count");
const empty=document.querySelector("#empty-state");
const dialog=document.querySelector("#profile-dialog");
const profileContent=document.querySelector("#profile-content");
let activeFilter="Todos";
const people=window.CIRANDEIROS||[];
const categories=["Todos",...new Set(people.map(person=>person.categoria).filter(Boolean))];
filters.innerHTML=categories.map(category=>`<button class="filter ${category==="Todos"?"active":""}" data-filter="${category}">${category}</button>`).join("");
function art(person,index){
  const style=`--card-bg:${person.corFundo||"#eadcf0"};--card-color:${person.cor||"#75418a"}`;
  return person.foto
    ? `<div class="person-art" style="${style}"><img src="${person.foto}" alt="Foto de ${person.nome}" style="width:100%;height:100%;object-fit:cover"></div>`
    : `<div class="person-art" style="${style}"><span class="person-number">FM • ${String(index+1).padStart(2,"0")}</span><span class="person-symbol">${person.simbolo||"✿"}</span><span class="person-tag">${person.categoria||"Cirandeiro"}</span></div>`;
}
function render(){
  const term=searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const visible=people.map((person,index)=>({...person,index})).filter(person=>
    (activeFilter==="Todos"||person.categoria===activeFilter)&&
    [person.nome,person.personagem,person.categoria].join(" ").toLocaleLowerCase("pt-BR").includes(term)
  );
  count.textContent=`${visible.length} ${visible.length===1?"perfil":"perfis"}`;
  empty.hidden=visible.length>0;
  grid.innerHTML=visible.map(person=>`<article class="person-card" tabindex="0" role="button" aria-label="Ver perfil de ${person.nome}" data-index="${person.index}">${art(person,person.index)}<div class="person-info"><h3>${person.nome}</h3><p>${person.personagem||"Integrante da Ciranda Flor Matizada"}</p><div class="person-more"><span>CONHEÇA A HISTÓRIA</span><span>↗</span></div></div></article>`).join("");
}
filters.addEventListener("click",event=>{const button=event.target.closest("[data-filter]");if(!button)return;activeFilter=button.dataset.filter;filters.querySelectorAll(".filter").forEach(item=>item.classList.toggle("active",item===button));render();});
searchInput.addEventListener("input",render);
function openProfile(index){const person=people[index];if(!person)return;profileContent.innerHTML=`${art(person,index)}<div class="profile-body"><span class="eyebrow">${person.categoria||"CIRANDEIRO"}</span><h2>${person.nome}</h2><strong>${person.personagem||""}</strong><p>${person.descricao||"Integrante da Ciranda Flor Matizada."}</p></div>`;dialog.showModal();}
grid.addEventListener("click",event=>{const card=event.target.closest("[data-index]");if(card)openProfile(Number(card.dataset.index));});
grid.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){const card=event.target.closest("[data-index]");if(card){event.preventDefault();openProfile(Number(card.dataset.index));}}});
dialog.querySelector(".dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
const menuToggle=document.querySelector(".menu-toggle");
const navigation=document.querySelector(".navigation");
menuToggle.addEventListener("click",()=>{const opened=navigation.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(opened));});
navigation.addEventListener("click",event=>{if(event.target.closest("a")){navigation.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");}});
render();