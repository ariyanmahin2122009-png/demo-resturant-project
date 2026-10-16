/* Green Plate Bistro — কোড ছাড়া এডিট করার মোড (Admin) */
(function(){
 var body=document.body,tb=null;
 function getPw(){try{return localStorage.getItem('gpb_pw')||'1234'}catch(e){return '1234'}}
 document.getElementById('adminLink').onclick=function(e){
  e.preventDefault();
  if(body.classList.contains('editing'))return;
  var p=prompt('অ্যাডমিন পাসওয়ার্ড দিন:');
  if(p===null)return;
  if(p!==getPw()){alert('পাসওয়ার্ড ভুল');return}
  start();
 };
 /* ছবি পিক + ছোট করা */
 function pick(max,cb){
  var f=document.createElement('input');f.type='file';f.accept='image/*';
  f.onchange=function(){
   var file=f.files[0];if(!file)return;
   var fr=new FileReader();
   fr.onload=function(){
    var im=new Image();
    im.onload=function(){
     var s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');
     c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
     c.getContext('2d').drawImage(im,0,0,c.width,c.height);
     cb(c.toDataURL('image/jpeg',0.82));
    };
    im.onerror=function(){alert('এই ছবিটা পড়া যাচ্ছে না। JPG বা PNG দিন।')};
    im.src=fr.result;
   };
   fr.readAsDataURL(file);
  };
  f.click();
 }
 function collectDishes(){
  document.querySelectorAll('.card').forEach(function(c,i){
   if(!dishes[i])return;
   dishes[i].bn=c.querySelector('h3').textContent.trim();
   dishes[i].en=c.querySelector('.en').textContent.trim();
   dishes[i].d=c.querySelector('p').textContent.trim();
   dishes[i].p=c.querySelector('.price span').textContent.replace(/^\s*৳\s*/,'').trim();
  });
 }
 function collect(){
  collectDishes();
  var out={texts:{},dishes:dishes,hero:content.hero||null,about:content.about||null};
  document.querySelectorAll(TEXT_SEL).forEach(function(el,i){out.texts[i]=el.innerHTML});
  return out;
 }
 function save(){
  content=collect();
  try{localStorage.setItem(STORE,JSON.stringify(content));setTel();alert('সেভ হয়েছে ✔')}
  catch(e){alert('জায়গা শেষ! কয়েকটা বড় ছবি কমিয়ে আবার চেষ্টা করুন।')}
 }
 function download(){
  var txt='window.SITE_CONTENT = '+JSON.stringify(collect())+';';
  var a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([txt],{type:'text/javascript'}));
  a.download='content.js';a.click();
 }
 function btn(label,fn,cls){var b=document.createElement('button');b.textContent=label;b.className='tbb '+(cls||'');b.onclick=fn;return b}
 function start(){
  body.classList.add('editing');
  document.querySelectorAll(TEXT_SEL).forEach(function(el){el.contentEditable='true'});
  renderMenu(true);
  var grid=document.getElementById('menuGrid');
  grid.onclick=function(e){
   var card=e.target.closest('.card');if(!card)return;
   var i=Array.prototype.indexOf.call(grid.children,card);
   if(e.target.closest('.del')){
    collectDishes();
    if(confirm('এই খাবারটা মুছবেন?')){dishes.splice(i,1);renderMenu(true)}
    return;
   }
   if(e.target.closest('.img')){
    pick(900,function(d){dishes[i].img=d;card.querySelector('.img').innerHTML='<img src="'+d+'" alt="">'});
   }
  };
  document.querySelector('.plate').onclick=function(){pick(1000,function(d){content.hero=d;setHero(d)})};
  document.querySelector('.frame').onclick=function(){pick(1000,function(d){content.about=d;setAbout(d)})};
  /* লিংক বন্ধ, শুধু এডিট */
  document.addEventListener('click',function(e){
   if(!body.classList.contains('editing'))return;
   if(e.target.closest('#tb'))return;
   if(e.target.closest('a,.btn'))e.preventDefault();
  },true);
  document.addEventListener('keydown',function(e){
   if(body.classList.contains('editing')&&e.key==='Enter'&&e.target.isContentEditable&&!e.target.matches('.about p,.hero p,.card p,.info p'))e.preventDefault();
  });
  document.addEventListener('paste',function(e){
   if(!body.classList.contains('editing')||!e.target.isContentEditable)return;
   e.preventDefault();
   document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text/plain'));
  });
  tb=document.createElement('div');tb.id='tb';
  tb.appendChild(btn('💾 সেভ',save,'ok'));
  tb.appendChild(btn('➕ নতুন খাবার',function(){
   collectDishes();
   dishes.push({bn:'নতুন খাবার',en:'New Dish',d:'খাবারের বিবরণ লিখুন',img:'',p:'০০০',c:['#e0a93a','#b8731f']});
   renderMenu(true);
   var last=grid.lastElementChild;if(last)last.scrollIntoView({behavior:'smooth',block:'center'});
  }));
  tb.appendChild(btn('⬇ content.js',download));
  tb.appendChild(btn('🔑 পাসওয়ার্ড',function(){var p=prompt('নতুন পাসওয়ার্ড লিখুন:');if(p){try{localStorage.setItem('gpb_pw',p);alert('পাসওয়ার্ড বদলেছে')}catch(e){}}}));
  tb.appendChild(btn('♻ রিসেট',function(){if(confirm('সব এডিট মুছে প্রথম অবস্থায় ফিরবে। নিশ্চিত?')){try{localStorage.removeItem(STORE)}catch(e){}location.reload()}}));
  tb.appendChild(btn('✕ বের হন',function(){if(confirm('সেভ না করা বদল হারিয়ে যাবে। বের হবেন?'))location.reload()},'x'));
  body.appendChild(tb);
  alert('এডিট মোড চালু! যেকোনো লেখায় ক্লিক করে বদলান। ছবিতে ক্লিক করলে নতুন ছবি দেওয়া যাবে। শেষে 💾 সেভ চাপুন।');
 }
})();
