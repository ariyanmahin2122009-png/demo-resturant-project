/* Green Plate Bistro — main script */
var TEXT_SEL='.logo,.brand-text,.links a:not(.btn),.links .btn,.tag,.hero h1,.hero p,.cta .btn,.title small,.title h2,.about p,.stats div,.info h3,.info p,.call .btn,.ft';
var STORE='gpb_content';
var DEFAULT_DISHES=[
 {bn:"কাচ্চি বিরিয়ানি",en:"Kacchi Biryani",d:"খাসির মাংস, সুগন্ধি চাল আর আলুবোখারার ঐতিহ্যবাহী দম।",img:"kacchi.jpg",p:"৪৫০",c:["#e9b24a","#9a4a22"]},
 {bn:"ইলিশ ভাপা",en:"Ilish Bhapa",d:"সর্ষে-নারকেলের ঝাঁঝালো মাখা, কচুপাতায় ভাপে রান্না।",img:"ilish.jpg",p:"৫৫০",c:["#e8c547","#5e7d2e"]},
 {bn:"ভুনা খিচুড়ি",en:"Bhuna Khichuri",d:"মসুর ডাল-চালের গরম খিচুড়ি, সঙ্গে ডিম ভাজা।",img:"khichuri.jpg",p:"২৮০",c:["#e0a93a","#b8731f"]},
 {bn:"গরুর ভুনা",en:"Beef Bhuna",d:"ধীর আঁচে কষানো ঝাল ভুনা, সঙ্গে পরোটা।",img:"beef-bhuna.jpg",p:"৩৮০",c:["#8b3a1a","#c8202f"]},
 {bn:"শুঁটকি ভর্তা",en:"Shutki Bhorta",d:"ভাজা শুঁটকি, পেঁয়াজ, কাঁচা মরিচ আর সর্ষের তেল।",img:"shutki.jpg",p:"১৮০",c:["#a8672c","#0f7a4d"]},
 {bn:"পায়েস",en:"Payesh",d:"গোবিন্দভোগ চাল, খেজুরের গুড় আর দুধে রাঁধা মিষ্টি।",img:"payesh.jpg",p:"১২০",c:["#fff1cf","#d99a1e"]}
];
var content={};
try{content=JSON.parse(localStorage.getItem(STORE)||'null')||window.SITE_CONTENT||{}}catch(e){content=window.SITE_CONTENT||{}}
var dishes=content.dishes||DEFAULT_DISHES;

function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
function imgSrc(x){return !x?'':(x.indexOf('data:')===0?x:'images/'+x)}
function dish(c){
 return '<svg viewBox="0 0 200 170"><circle cx="100" cy="85" r="78" fill="#fffaf0" stroke="#c8202f" stroke-width="5"/><circle cx="100" cy="85" r="64" fill="none" stroke="#0b5d3b" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"/><ellipse cx="100" cy="88" rx="48" ry="36" fill="'+c[0]+'"/><ellipse cx="104" cy="80" rx="26" ry="17" fill="'+c[1]+'"/><circle cx="72" cy="92" r="6" fill="'+c[1]+'" opacity=".7"/><circle cx="132" cy="98" r="6" fill="'+c[1]+'" opacity=".7"/><circle cx="85" cy="66" r="5" fill="#0f7a4d"/><circle cx="125" cy="108" r="5" fill="#c8202f"/></svg>';
}
function fallback(img,i){img.parentNode.innerHTML=dish(dishes[i].c)}
function renderMenu(ed){
 var a=ed?' contenteditable="true"':'';
 document.getElementById('menuGrid').innerHTML=dishes.map(function(x,i){
  var im=x.img?'<img src="'+esc(imgSrc(x.img))+'" alt="'+esc(x.en)+'" loading="lazy" onerror="fallback(this,'+i+')">':dish(x.c);
  return '<article class="card">'+(ed?'<button class="del" title="মুছুন">✕</button>':'')+
   '<div class="img">'+im+'</div><div class="body"><h3'+a+'>'+esc(x.bn)+'</h3><div class="en"'+a+'>'+esc(x.en)+'</div><p'+a+'>'+esc(x.d)+'</p>'+
   '<div class="price"><span'+a+'>৳ '+esc(x.p)+'</span><a href="#contact">অর্ডার</a></div></div></article>';
 }).join('');
}
function setHero(src){var h=document.querySelector('.hero-img');h.onerror=null;h.src=src;h.style.display='block';if(h.nextElementSibling)h.nextElementSibling.style.display='none'}
function setAbout(src){document.querySelector('.frame').innerHTML='<img src="'+src+'" alt="">'}
function setTel(){
 var p=document.querySelector('.info:nth-child(3) p'),b=document.querySelector('.call .btn');if(!p||!b)return;
 var line=p.innerText.split('\n')[0],bd='০১২৩৪৫৬৭৮৯';
 var n=line.replace(/[০-৯]/g,function(d){return bd.indexOf(d)}).replace(/[^0-9+]/g,'');
 if(n.length>5)b.setAttribute('href','tel:'+n);
}
/* সেভ করা কনটেন্ট বসানো */
(function(){
 if(content.texts){document.querySelectorAll(TEXT_SEL).forEach(function(el,i){if(content.texts[i]!=null)el.innerHTML=content.texts[i]})}
 if(content.hero)setHero(content.hero);
 if(content.about)setAbout(content.about);
 renderMenu(false);setTel();
})();
/* মোবাইল মেনু */
var l=document.getElementById('links');
document.getElementById('burger').onclick=function(){l.classList.toggle('open')};
l.addEventListener('click',function(e){if(e.target.tagName==='A')l.classList.remove('open')});

/* স্ক্রল করলে একে একে ফোটার অ্যানিমেশন */
(function(){
 if(!('IntersectionObserver' in window)||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))return;
 document.documentElement.classList.add('js');
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
 document.querySelectorAll('.title,.card,.about-g>*,.stats div,.info,.call').forEach(function(el){
  var i=Array.prototype.indexOf.call(el.parentNode.children,el);
  el.style.setProperty('--d',(el.classList.contains('card')?(i%3)*120:i*110)+'ms');
  el.classList.add('reveal');io.observe(el);
 });
})();