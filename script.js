const questionPage=document.getElementById("questionPage");
const datePage=document.getElementById("datePage");
const dinnerPage=document.getElementById("dinnerPage");
const summaryPage=document.getElementById("summaryPage");
const finalPage=document.getElementById("finalPage");
const noBtn=document.getElementById("noBtn");

const pages=[questionPage,datePage,dinnerPage,summaryPage,finalPage];
const dots=document.querySelectorAll(".progress .dot");

function setProgress(page){
  const idx=pages.indexOf(page);
  dots.forEach((d,i)=>{
    d.classList.toggle("active",i===idx);
    d.classList.toggle("done",i<idx);
  });
}

function nextPage(current,next){current.classList.remove("active");setTimeout(()=>{next.classList.add("active");setProgress(next)},250)}

let dodgeCount=0;
const dodgeCounter=document.getElementById("dodgeCounter");
const dodgeMessages=[
  "Choose carefully... the NO button is suspicious 👀",
  "Wow, okay, one dodge. Try again? 🙈",
  "Two dodges. The NO button is not giving up. 😂",
  "Three! At this point it's basically a workout 🏃",
  "Four dodges. Impressive persistence, still no NO. 👀",
  "Five. I think the button is scared of you now. 😌",
  "Okay this is a lot of dodging. Just saying. ❤️"
];

function moveNoButton(){
  dodgeCount++;
  const maxX=Math.max(15,window.innerWidth-noBtn.offsetWidth-15);
  const maxY=Math.max(15,window.innerHeight-noBtn.offsetHeight-15);
  noBtn.style.position="fixed";
  noBtn.style.left=Math.random()*maxX+"px";
  noBtn.style.top=Math.random()*maxY+"px";
  const scale=Math.max(0.6,1-dodgeCount*0.05);
  noBtn.style.transform=`scale(${scale})`;
  const messages=["Are you sure? 🙈","Try YES ❤️","Nice try 😂","Think again 👀","Wrong button 😌","Nope, not that one 🚫","Getting closer to YES though 😉"];
  noBtn.textContent=messages[Math.floor(Math.random()*messages.length)];
  if(dodgeCounter){
    dodgeCounter.textContent=dodgeMessages[Math.min(dodgeCount,dodgeMessages.length-1)];
  }
}
noBtn.addEventListener("mouseenter",moveNoButton);
noBtn.addEventListener("touchstart",e=>{e.preventDefault();moveNoButton()});

// subtle cursor sparkle trail
let lastTrail=0;
document.addEventListener("mousemove",e=>{
  const now=Date.now();
  if(now-lastTrail<45)return;
  lastTrail=now;
  const dot=document.createElement("div");
  dot.className="trail-dot";
  const size=4+Math.random()*4;
  dot.style.width=size+"px";
  dot.style.height=size+"px";
  dot.style.left=e.clientX-size/2+"px";
  dot.style.top=e.clientY-size/2+"px";
  dot.style.background=["#ffd66e","#ff83cf","#b79cff"][Math.floor(Math.random()*3)];
  dot.style.opacity="0.7";
  document.body.appendChild(dot);
  requestAnimationFrame(()=>{
    dot.style.opacity="0";
    dot.style.transform=`translateY(${10+Math.random()*15}px)`;
  });
  setTimeout(()=>dot.remove(),650);
});

// gentle parallax tilt on cards
document.querySelectorAll(".card").forEach(card=>{
  card.addEventListener("mousemove",e=>{
    if(window.innerWidth<700)return;
    const rect=card.getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width-0.5;
    const y=(e.clientY-rect.top)/rect.height-0.5;
    card.style.transform=`rotateY(${x*4}deg) rotateX(${-y*4}deg)`;
  });
  card.addEventListener("mouseleave",()=>{card.style.transform="rotateY(0) rotateX(0)"});
});

// fun fact reveal on restaurant pick + "Other" text input toggle
const funFact=document.getElementById("funFact");
const otherInput=document.getElementById("otherInput");
document.querySelectorAll('input[name="restaurant"]').forEach(input=>{
  input.addEventListener("change",()=>{
    if(funFact){
      funFact.textContent=input.dataset.fact||"";
      funFact.classList.remove("show");
      requestAnimationFrame(()=>funFact.classList.add("show"));
    }
    if(otherInput){
      const isOther=input.value==="other";
      otherInput.classList.toggle("show",isOther);
      if(isOther)otherInput.focus();
    }
  });
});

document.getElementById("yesBtn").addEventListener("click",()=>{
  burst(18);
  nextPage(questionPage,datePage);
});

document.getElementById("dateBtn").addEventListener("click",()=>{
  const date=document.getElementById("date").value;
  const time=document.getElementById("time").value;
  if(!date||!time){alert("Pick both a date and time first ❤️");return}
  nextPage(datePage,dinnerPage);
});

document.getElementById("restaurantBtn").addEventListener("click",()=>{
  const selected=document.querySelector('input[name="restaurant"]:checked');
  if(!selected){alert("You have to choose our dinner spot 😌🍽️");return}
  let restaurantName=selected.value;
  if(restaurantName==="other"){
    const customValue=document.getElementById("otherInput").value.trim();
    if(!customValue){alert("Tell me where you'd rather go 👀");return}
    restaurantName=customValue;
  }
  const date=document.getElementById("date").value;
  const time=document.getElementById("time").value;
  const d=new Date(date+"T00:00:00");
  document.getElementById("summaryDate").textContent=d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
  document.getElementById("summaryTime").textContent=new Date("1970-01-01T"+time).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
  document.getElementById("summaryRestaurant").textContent=restaurantName;
  nextPage(dinnerPage,summaryPage);
});

let countdownTimer=null;

document.getElementById("thankBtn").addEventListener("click",()=>{
  const date=document.getElementById("date").value;
  const time=document.getElementById("time").value;
  const restaurant=document.getElementById("summaryRestaurant").textContent;
  submitToGoogleForm(date,time,restaurant);
  nextPage(summaryPage,finalPage);
  celebration();
  startCountdown();
});

function submitToGoogleForm(date,time,restaurant){
  const formUrl="https://docs.google.com/forms/d/e/1FAIpQLScX3qaJi3GDNvdWj7LuoXij7TrAqjImN77jUuY_i4nul1Ocbg/formResponse";
  console.log("[GoogleForm] submitting:",{date,time,restaurant});

  const iframe=document.createElement("iframe");
  iframe.name="hidden_google_form_frame";
  iframe.style.display="none";
  document.body.appendChild(iframe);

  const form=document.createElement("form");
  form.action=formUrl;
  form.method="POST";
  form.target="hidden_google_form_frame";

  function addField(name,value){
    const input=document.createElement("input");
    input.type="hidden";
    input.name=name;
    input.value=value;
    form.appendChild(input);
  }
  addField("entry.181553961","yes");
  addField("entry.995725818",date);
  addField("entry.2032883795",time);
  addField("entry.1168509398",restaurant);
  addField("entry.1903631728","Confirmed ✅");

  document.body.appendChild(form);
  console.log("[GoogleForm] form action:",form.action,"fields:",new FormData(form));
  try{
    form.submit();
    console.log("[GoogleForm] form.submit() called successfully");
  }catch(err){
    console.error("[GoogleForm] form.submit() threw an error:",err);
  }
  setTimeout(()=>{form.remove();iframe.remove();console.log("[GoogleForm] cleanup done");},3000);
}

function celebration(){
  burst(45);
}

function burst(count){
  for(let i=0;i<count;i++){
    const piece=document.createElement("span");
    piece.textContent=["✦","♥","•","✧","★"][Math.floor(Math.random()*5)];
    piece.style.position="fixed";
    piece.style.left=Math.random()*100+"vw";
    piece.style.top="-20px";
    piece.style.zIndex="50";
    piece.style.fontSize=12+Math.random()*18+"px";
    piece.style.color=["#ffd66e","#ff83cf","#b79cff","#ffffff"][Math.floor(Math.random()*4)];
    piece.style.pointerEvents="none";
    const duration=2.5+Math.random()*3;
    piece.style.transition=`top ${duration}s linear,transform ${duration}s linear`;
    document.body.appendChild(piece);
    requestAnimationFrame(()=>{
      piece.style.top="110vh";
      piece.style.transform=`translateX(${(Math.random()-.5)*300}px) rotate(${Math.random()*900}deg)`;
    });
    setTimeout(()=>piece.remove(),duration*1000+500);
  }
}

function startCountdown(){
  const countdownEl=document.getElementById("countdown");
  if(!countdownEl)return;
  const date=document.getElementById("date").value;
  const time=document.getElementById("time").value;
  if(!date||!time)return;
  const target=new Date(date+"T"+time);
  if(countdownTimer)clearInterval(countdownTimer);
  function tick(){
    const diff=target-new Date();
    if(diff<=0){
      countdownEl.textContent="It's happening. See you there! 🏁";
      clearInterval(countdownTimer);
      return;
    }
    const days=Math.floor(diff/86400000);
    const hours=Math.floor((diff%86400000)/3600000);
    const mins=Math.floor((diff%3600000)/60000);
    countdownEl.textContent=`⏳ ${days}d ${hours}h ${mins}m until go-time`;
  }
  tick();
  countdownTimer=setInterval(tick,60000);
}
