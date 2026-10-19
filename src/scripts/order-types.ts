// @ts-nocheck
// order-types.ts – logic của mockup "Order types" (phần Outcome, case study Trading).
// Port từ order-types-mockup.html: giữ nguyên hành vi, chỉ đổi cách tìm phần tử (theo data-ot / class trong
// khối gốc `root`) để nhiều khối chạy cùng trang và không gắn gì vào window.
// Biểu đồ nến được dựng sẵn trong OrderTypesMockup.astro (src/lib/order-types/chart.ts), không dựng ở đây.

export function initOrderTypes(root) {
var ASK=68565.12,BID=68549.12,LAST=68565.12,FEE=0.001,AV_USDT=12450,AV_BTC=0.25;

var $=function(s,r){return (r||root).querySelector(s)};
var $$=function(s,r){return [].slice.call((r||root).querySelectorAll(s))};
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- helpers ---------- */
function fmt(n,dp){var s=Math.abs(n).toFixed(dp).split('.');s[0]=s[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');return (n<0?'-':'')+s.join('.')}
function fmt2(n){return fmt(n,2)}
function parse(s){var v=parseFloat(String(s).replace(/,/g,''));return isNaN(v)?0:v}
function clean(s){return String(s).replace(/[^0-9.,]/g,'')}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}
var CHEV='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
var SWAP='<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>';
var PLUS='<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>';
var CHECK='<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

/* ---------- state ---------- */
var S={side:'buy',type:'market',kind:'limit',tif:'GTC'};
var store={};
function key(){return S.type==='stop'?'stop-'+S.kind:S.type}
function D(){var k=key()+':'+S.side;return store[k]||(store[k]=defaults(key(),S.side))}
function sidePx(){return S.side==='buy'?ASK:BID}
function qtyStr(q){return q.toFixed(4)}
function defaults(k,side){
  var b=side==='buy',o={qty:0,unit:'BTC',pct:50,fig:{},off:{},price:'',trig:'',limit:'',h:'1',m:'30',chk:false,xmode:'limit',xpx:'',expMin:null,expTxt:''};
  if(k==='market'){o.qty=b?0.0907:0.125;o.fig={total:b?'≈ 6,218.86 USDT':'≈ 8,568.64 USDT',fee:b?'≈ 6.22 USDT':'≈ 8.57 USDT'}}
  else if(k==='limit'){o.price=fmt2(b?ASK:BID);o.qty=0.091;o.fig={total:b?'6,239.43 USDT':'≈ 8,568.64 USDT',fee:b?'≈ 6.24 USDT':'≈ 8.57 USDT'}}
  else if(k==='twap'){o.qty=b?0.0903:0.125;o.fig=b?{sub:'180 × 0.0005017 BTC',cost:'≈ 6,218.86 USDT',costX:'6,222.39 USDT',fee:'≈ 6.22 USDT'}:{sub:'180 × 0.0006944 BTC',cost:'≈ 8,568.64 USDT',costX:'8,525.80 USDT',fee:'≈ 8.57 USDT'}}
  else if(k==='stop-limit'){o.trig=fmt2(b?69000:66000);o.limit=fmt2(b?69100:65900);o.qty=b?0.09:0.125;o.fig=b?{total:'6,219.00 USDT',fee:'≈ 6.22 USDT'}:{total:'8,237.50 USDT',fee:'≈ 8.24 USDT'}}
  else{o.trig=fmt2(b?69000:66000);o.qty=b?0.09:0.125;o.fig=b?{total:'≈ 6,210.00 USDT',fee:'≈ 6.21 USDT'}:{total:'≈ 8,250.00 USDT',fee:'≈ 8.25 USDT'}}
  o.pre=(o.fig.total||o.fig.cost||'').indexOf('≈')===0?'≈ ':'';
  o.amt=qtyStr(o.qty);
  if(k==='limit')o.off.price=bpOf(parse(o.price),b?ASK:BID);
  if(k.indexOf('stop')===0)o.off.trig=bpOf(parse(o.trig),LAST);
  o.off.xpx=b?50:-50;o.xpx=fmt2(Math.round((b?ASK:BID)*(10000+o.off.xpx)/10000*100)/100);
  return o;
}
function bpOf(v,base){return v&&base?Math.round((v/base-1)*1e4):0}
function xLimit(d){return S.type==='twap'&&d.chk&&d.xmode==='limit'}
function execPx(d,k){
  if(k==='twap'&&xLimit(d))return parse(d.xpx);
  if(k==='limit')return parse(d.price);
  if(k==='stop-limit')return parse(d.limit);
  if(k==='stop-market')return parse(d.trig);
  return sidePx();
}
function amtStr(d,k){return (k==='market'&&d.unit==='USDT')?fmt2(d.qty*execPx(d,k)):qtyStr(d.qty)}
function totalMin(d){return (parseInt(d.h,10)||0)*60+(parseInt(d.m,10)||0)}
/* GTD: fixed "now" (10 Oct 2026, 23:10) so 7d gives 17/10/2026, 23:10 as in Figma */
var NOW=Date.UTC(2026,9,10,23,10),MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function p2(x){return (x<10?'0':'')+x}
function expInput(min){var t=new Date(NOW+min*60000);return p2(t.getUTCDate())+'/'+p2(t.getUTCMonth()+1)+'/'+t.getUTCFullYear()+', '+p2(t.getUTCHours())+':'+p2(t.getUTCMinutes())}
function inTxt(min){if(min<60)return min+(min===1?' minute':' minutes');if(min<1440){var h=Math.round(min/60);return h+(h===1?' hour':' hours')}var d=Math.round(min/1440);return d+(d===1?' day':' days')}
function expSummary(min){var t=new Date(NOW+min*60000);return t.getUTCDate()+' '+MON[t.getUTCMonth()]+' '+t.getUTCFullYear()+', '+p2(t.getUTCHours())+':'+p2(t.getUTCMinutes())+' (in '+inTxt(min)+')'}
function parseExp(s){var m=/^\s*(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})\s*$/.exec(s);if(!m)return null;
  var t=Date.UTC(+m[3],+m[2]-1,+m[1],+m[4],+m[5]),d=new Date(t);if(d.getUTCDate()!==+m[1]||d.getUTCMonth()!==+m[2]-1)return null;
  var min=Math.round((t-NOW)/60000);return (min>=5&&min<=129600)?min:null}

/* ---------- templates ---------- */
function field(id,label,val,right){
  return '<div class="field" data-f="'+id+'"><span class="lbl">'+label+'</span><span class="rv"><input data-in="'+id+'" inputmode="decimal" autocomplete="off" spellcheck="false" aria-label="'+label+'" value="'+esc(val)+'">'+right+'</span></div>';
}
function unit(t){return '<span class="unit">'+t+'</span>'}
function sumRow(k,id,v){return '<div class="sum"><span class="k">'+k+'</span><span class="v" data-o="'+id+'">'+(v||'')+'</span></div>'}
function chips(list,t){return list.map(function(c){return '<button type="button" class="qchip" data-chip="'+c+'" data-t="'+t+'">'+(c>0?'+':'-')+Math.abs(c)+'%</button>'}).join('')}
function group(id,label,val,list){
  return '<div class="group">'+field(id,label,val,unit('USDT'))+'<div class="helpers"><span class="off" data-o="off"></span><div class="quick">'+chips(list,id)+'</div></div></div>';
}
function headHTML(){
  function tb(id,l){return '<button type="button" class="tb" data-type="'+id+'" aria-pressed="false">'+l+'</button>'}
  return '<div class="side" role="radiogroup" aria-label="Order side">'+
   '<button type="button" class="sd buy" role="radio" aria-checked="false" data-side="buy"><b>Buy</b><span>68,565.12</span></button>'+
   '<button type="button" class="sd sell" role="radio" aria-checked="false" data-side="sell"><span>68,549.12</span><b>Sell</b></button></div>'+
   '<div class="types"><div class="tl">'+tb('market','Market')+tb('limit','Limit')+tb('twap','TWAP')+
   '<button type="button" class="tb" data-type="stop" aria-haspopup="dialog" aria-pressed="false"><span data-stoplbl>Stop</span>'+CHEV+'</button></div>'+
   '<button type="button" class="tif" data-tif aria-haspopup="dialog"><span data-tiflbl>GTC</span>'+CHEV+'</button></div>';
}
function tifOn(){return S.type==='limit'||(S.type==='stop'&&S.kind==='limit')}
function syncHead(){
  $$('[data-side]',fh).forEach(function(el){var on=el.getAttribute('data-side')===S.side;el.classList.toggle('on',on);el.setAttribute('aria-checked',on)});
  $$('[data-type]',fh).forEach(function(el){var on=el.getAttribute('data-type')===S.type;el.classList.toggle('on',on);el.setAttribute('aria-pressed',on)});
  setLbl('[data-stoplbl]',S.type==='stop'?(S.kind==='limit'?'Stop-limit':'Stop-market'):'Stop');
  var on=tifOn(),t=$('[data-tif]',fh),shown=on?S.tif:'GTC';
  setLbl('[data-tiflbl]',shown);t.disabled=!on;t.setAttribute('aria-label','Time in force '+shown);
}
function setLbl(sel,v){var e=$(sel,fh);if(e&&e.textContent!==v)e.textContent=v}
function availHTML(){
  var b=S.side==='buy';
  return '<div class="alloc"><div class="slider" role="slider" tabindex="0" aria-label="Share of available balance" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="50%">'+
   '<div class="track"></div><div class="fill"></div>'+
   [0,25,50,75,100].map(function(p){return '<span class="stop" style="--p:'+(p/100)+'" data-stop="'+p+'"></span><span class="pl'+(p===0?' first':p===100?' last':'')+'" style="--p:'+(p/100)+'">'+p+'%</span>'}).join('')+
   '<span class="knob"></span></div>'+
   '<div class="sum"><span class="k">Available</span><span class="v">'+(b?'12,450.00 USDT':'0.2500 BTC')+'</span><span class="plus">'+PLUS+'</span></div></div>';
}
function btnHTML(){
  var b=S.side==='buy',tw=S.type==='twap';
  return '<button type="button" class="tbtn '+(b?'buy':'sell')+'" data-o="btn">'+(b?'Buy':'Sell')+' BTC'+(tw?' · TWAP':'')+'</button>';
}
function expiresRow(){return sumRow('Expires','exp')}
var CAL='<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>';
function expiryHTML(){
  var pr=[['8h',480],['1D',1440],['3D',4320],['7d',10080],['30d',43200],['90d',129600]].map(function(p){return '<button type="button" class="qchip" data-exp="'+p[1]+'">'+p[0]+'</button>'}).join('');
  return '<div class="group"><div class="field" data-f="exp"><span class="lbl">Expires</span><span class="rv"><input data-in="exp" autocomplete="off" spellcheck="false" aria-label="Expires" placeholder="dd/mm/yyyy, hh:mm" value=""><span class="cal">'+CAL+'</span></span></div>'+
   '<div class="presets">'+pr+'</div>'+
   '<p class="helper">Cancels automatically at this time if not fully filled. Choose 5 minutes to 90 days from now.</p></div>';
}
function bodyHTML(){
  var k=key(),b=S.side==='buy',d=D(),h='',gtd=S.tif==='GTD';
  if(k==='market'){
    h+='<p class="helper">Fills immediately at the best available price.</p>'+
      field('amt','Amount','', '<button type="button" class="unitb" data-unit aria-label="Switch unit"><span data-o="unit">BTC</span>'+SWAP+'</button>')+
      availHTML()+'<div class="order"><div class="divider"></div>'+sumRow('Total','total')+sumRow('Est. fee (0.1%)','fee')+'</div>';
  }else if(k==='limit'){
    h+=group('price','Price','',b?[-1,-2,-5]:[1,2,5])+field('amt','Amount','',unit('BTC'))+availHTML()+(gtd?expiryHTML():'')+
      '<div class="order"><div class="divider"></div>'+sumRow('Total','total')+sumRow('Est. fee (0.1%)','fee')+expiresRow()+'</div>';
  }else if(k==='twap'){
    var pres=[['30m',30],['1h',60],['4h',240],['8h',480],['1d',1440],['3d',4320]].map(function(p){return '<button type="button" class="qchip" data-preset="'+p[1]+'">'+p[0]+'</button>'}).join('');
    var xl=xLimit(d);
    h+=field('amt','Total quantity','',unit('BTC'))+availHTML()+
      '<div class="rt"><h4>Running time</h4><div class="duo">'+field('h','Hours','',unit('h'))+field('m','Minutes','',unit('m'))+'</div><div class="presets">'+pres+'</div></div>'+
      '<button type="button" class="cbrow" role="checkbox" aria-checked="'+d.chk+'" data-cb><span class="cbx">'+CHECK+'</span>Optional execution price</button>';
    if(d.chk){
      h+='<div class="seg" role="radiogroup" aria-label="Execution price type"><button type="button" role="radio" aria-checked="'+xl+'" class="'+(xl?'on':'')+'" data-xm="limit">Limit</button><button type="button" role="radio" aria-checked="'+!xl+'" class="'+(!xl?'on':'')+'" data-xm="market">Market</button></div>';
      if(xl)h+=group('xpx',b?'Max price':'Min price','',b?[0.5,1,2]:[-0.5,-1,-2]);
      h+='<p class="helper">'+(xl?'Sub-orders only fill at or '+(b?'below your max':'above your min')+' price. Parts that can’t fill in an interval are skipped.':'Each sub-order fills at the best available price. Fast-moving markets may cause slippage.')+'</p>';
    }
    h+='<div class="order"><div class="divider"></div>'+sumRow('Sub-orders','sub')+sumRow('Interval','int','Every 30s')+sumRow('Ends','ends')+sumRow(xl?(b?'Max cost':'Min receive'):(b?'Est. cost':'Est. receive'),'cost')+sumRow('Est. fee (0.1%)','fee')+'</div>';
  }else if(k==='stop-limit'){
    h+=group('trig','Trigger price','',b?[1,2,5]:[-1,-2,-5])+field('limit','Limit price','',unit('USDT'))+field('amt','Amount','',unit('BTC'))+availHTML()+(gtd?expiryHTML():'')+
      '<div class="order"><div class="divider"></div>'+sumRow('Total','total')+sumRow('Est. fee (0.1%)','fee')+expiresRow()+'</div>';
  }else{
    h+=group('trig','Trigger price','',b?[1,2,5]:[-1,-2,-5])+field('amt','Amount','',unit('BTC'))+availHTML()+
      '<div class="order"><div class="divider"></div>'+sumRow('Est. total','total')+sumRow('Est. fee (0.1%)','fee')+'</div>';
  }
  return h+btnHTML();
}

/* ---------- refresh: write state into the DOM ---------- */
var form=$('[data-ot="form"]'),fh=$('[data-ot="fh"]'),fb=$('[data-ot="fb"]'),scroll=$('[data-ot="scroll"]'),screen=$('[data-ot="screen"]');
function setText(id,v){var e=$('[data-o="'+id+'"]',form);if(e&&e.textContent!==v)e.textContent=v}
function refresh(){
  var d=D(),k=key(),b=S.side==='buy',px=execPx(d,k),total=d.qty*px,f=d.fig||{};
  var vals={amt:d.amt,price:d.price,trig:d.trig,limit:d.limit,h:d.h,m:d.m,xpx:d.xpx,exp:d.expTxt};
  $$('[data-in]',form).forEach(function(i){if(document.activeElement!==i)i.value=vals[i.getAttribute('data-in')]}); 
  setText('unit',d.unit);
  /* slider */
  var sl=$('.slider',form);
  if(sl){sl.style.setProperty('--pct',d.pct/100);sl.setAttribute('aria-valuenow',Math.round(d.pct));sl.setAttribute('aria-valuetext',Math.round(d.pct)+'%');
    $$('.stop',sl).forEach(function(s){s.classList.toggle('on',+s.getAttribute('data-stop')<=d.pct+1e-9)})}
  /* helper % under the price groups, and chip highlight */
  var xl=xLimit(d);
  if(k==='limit'||k.indexOf('stop')===0||xl){
    var ref,bs,lb;
    if(xl){ref=parse(d.xpx);bs=sidePx();lb='current'}
    else if(k==='limit'){ref=parse(d.price);bs=sidePx();lb='current'}
    else{ref=parse(d.trig);bs=LAST;lb='last'}
    var pc=ref?(ref/bs-1)*100:0;
    if(Math.abs(pc)<0.005)pc=0;
    setText('off',(pc<0?'−':'+')+Math.abs(pc).toFixed(2)+'% vs '+lb+' price');
  }
  $$('[data-exp]',form).forEach(function(c){var on=d.expMin===+c.getAttribute('data-exp');c.classList.toggle('on',on);c.setAttribute('aria-pressed',on)});
  var usd=function(n){return fmt2(n)+' USDT'};
  if(k==='twap'){
    var tm=totalMin(d),n=Math.floor(tm*60/30);
    var ends=new Date(Date.UTC(2025,9,10,12,37)+tm*60000),M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var pad=function(x){return (x<10?'0':'')+x};
    setText('sub',f.sub||(n>0&&d.qty>0?n+' × '+(d.qty/n).toFixed(7)+' BTC':'—'));
    setText('ends',tm>0?ends.getUTCDate()+' '+M[ends.getUTCMonth()]+', '+pad(ends.getUTCHours())+':'+pad(ends.getUTCMinutes()):'—');
    setText('cost',xl?(f.costX||usd(total)):(f.cost||d.pre+usd(total)));
    setText('fee',f.fee||'≈ '+usd(total*FEE));
    $$('[data-preset]',form).forEach(function(c){var on=tm===+c.getAttribute('data-preset');c.classList.toggle('on',on);c.setAttribute('aria-pressed',on)});
    
  }else{
    setText('total',f.total||d.pre+usd(total));
    setText('fee',f.fee||'≈ '+usd(total*FEE));
  }
  setText('exp',S.tif==='GTD'?(d.expMin!=null?expSummary(d.expMin):'—'):'Until cancelled');
  var btn=$('[data-o="btn"]',form);
  if(btn)btn.disabled=!(d.qty>0)||(k==='twap'&&totalMin(d)<1);
}

/* The Buy/Sell selector and the order type bar (#fh) are built once and only updated in place.
   Only the content below them (#fb) is re-rendered, so nothing above it flickers. */
function renderBody(animate,focusSel){
  fb.innerHTML=bodyHTML();
  refresh();
  if(animate&&!RM&&fb.animate)fb.animate([{opacity:0},{opacity:1}],{duration:140,easing:'ease-out'});
  if(focusSel){var f=$(focusSel,form);if(f)f.focus({preventScroll:true})}
}
function fullRender(animate){syncHead();renderBody(animate)}

/* ---------- slider ---------- */
function applyPct(p){
  var d=D(),k=key(),px=execPx(d,k);
  [0,25,50,75,100].forEach(function(s){if(Math.abs(p-s)<2)p=s});
  p=Math.max(0,Math.min(100,p));d.pct=p;
  var q=S.side==='buy'?(px>0?AV_USDT*p/100/px:0):AV_BTC*p/100;
  d.qty=Math.floor(q*1e4+1e-7)/1e4;d.amt=amtStr(d,k);d.fig=null;
  refresh();
}
function pctFromQty(d,k){
  var px=execPx(d,k),v=S.side==='buy'?(px>0?d.qty*px/AV_USDT:0):d.qty/AV_BTC;
  d.pct=Math.max(0,Math.min(100,v*100));
}
var drag=false;
form.addEventListener('pointerdown',function(e){
  var sl=e.target.closest('.slider');if(!sl)return;
  drag=true;try{sl.setPointerCapture(e.pointerId)}catch(_){}
  sl.focus({preventScroll:true});moveTo(e,sl);e.preventDefault();
});
form.addEventListener('pointermove',function(e){if(drag){var sl=$('.slider',form);if(sl)moveTo(e,sl)}});
function end(){drag=false}
form.addEventListener('pointerup',end);form.addEventListener('pointercancel',end);
function moveTo(e,sl){
  var r=sl.getBoundingClientRect(),W=362,x=((e.clientX-r.left)/r.width)*W;
  applyPct(Math.round((x-3)/(W-6)*100));
}
form.addEventListener('keydown',function(e){
  var sl=e.target.closest&&e.target.closest('.slider');if(!sl)return;
  var d=D(),step={ArrowRight:1,ArrowUp:1,ArrowLeft:-1,ArrowDown:-1,PageUp:25,PageDown:-25}[e.key];
  if(e.key==='Home'){applyPct(0);e.preventDefault();return}
  if(e.key==='End'){applyPct(100);e.preventDefault();return}
  if(step){applyPct(Math.round(d.pct)+step);e.preventDefault()}
});

/* ---------- inputs ---------- */
form.addEventListener('input',function(e){
  var i=e.target.closest('[data-in]');if(!i)return;
  var id=i.getAttribute('data-in'),d=D(),k=key();
  if(id==='exp'){d.expTxt=i.value;d.expMin=parseExp(i.value);refresh();return}
  var v=clean(i.value);
  if(id==='h'||id==='m'){v=v.replace(/[^0-9]/g,'').slice(0,3);d[id]=v;i.value=v;d.fig=null;refresh();return}
  if(i.value!==v)i.value=v;
  d.fig=null;
  if(id==='amt'){d.amt=v;var n=parse(v);d.qty=(k==='market'&&d.unit==='USDT')?(execPx(d,k)?n/execPx(d,k):0):n;pctFromQty(d,k)}
  else{
    d[id]=v;
    if(id==='price'||id==='xpx'){d.off[id]=bpOf(parse(v),sidePx())}
    if(id==='trig'){d.off.trig=bpOf(parse(v),LAST)}
    if(id==='limit'||id==='trig'||id==='price'||id==='xpx'){pctFromQty(d,k)}
  }
  refresh();
});
form.addEventListener('focusout',function(e){
  var i=e.target.closest&&e.target.closest('[data-in]');if(!i)return;
  var id=i.getAttribute('data-in'),d=D(),k=key();
  if(id==='price'||id==='trig'||id==='limit'||id==='xpx'){var n=parse(d[id]);if(n>0)d[id]=fmt2(n)}
  else if(id==='exp'){d.expTxt=d.expMin!=null?expInput(d.expMin):''}
  else if(id==='amt'){d.amt=amtStr(d,k)}
  else if(id==='h'||id==='m'){
    var mm=totalMin(d);d.h=String(Math.floor(mm/60));d.m=String(mm%60);
  }
  refresh();
});
form.addEventListener('click',function(e){
  var t=e.target,el;
  if((el=t.closest('[data-side]'))){var s=el.getAttribute('data-side');if(s!==S.side){S.side=s;fullRender(true)}return}
  if((el=t.closest('[data-type]'))){
    var ty=el.getAttribute('data-type');
    if(ty==='stop'){openSheet('stop',el);return}
    if(ty!==S.type){S.type=ty;fullRender(true)}return}
  if((el=t.closest('[data-tif]'))){openSheet('tif',el);return}
  if((el=t.closest('[data-unit]'))){
    var d=D(),k=key();d.unit=d.unit==='BTC'?'USDT':'BTC';d.amt=amtStr(d,k);d.fig=null;refresh();return}
  if((el=t.closest('[data-chip]'))){
    var d2=D(),tg=el.getAttribute('data-t'),c=+el.getAttribute('data-chip'),base=tg==='trig'?LAST:sidePx();
    d2.off[tg]=(d2.off[tg]||0)+Math.round(c*100);
    d2[tg]=fmt2(Math.round(base*(10000+d2.off[tg])/10000*100)/100);
    d2.fig=null;pctFromQty(d2,key());refresh();flash($('[data-f="'+tg+'"] input',form));return}
  if((el=t.closest('[data-exp]'))){
    var d5=D();d5.expMin=+el.getAttribute('data-exp');d5.expTxt=expInput(d5.expMin);refresh();flash($('[data-f="exp"] input',form));return}
  if((el=t.closest('[data-xm]'))){var d6=D(),xm=el.getAttribute('data-xm');if(d6.xmode!==xm){d6.xmode=xm;renderBody(false,'[data-xm="'+xm+'"]')}return}
  if((el=t.closest('[data-preset]'))){
    var d3=D(),mn=+el.getAttribute('data-preset');d3.h=String(Math.floor(mn/60));d3.m=String(mn%60);d3.fig=null;refresh();return}
  if((el=t.closest('[data-cb]'))){var d4=D();d4.chk=!d4.chk;renderBody(false,'[data-cb]');return}
  if((el=t.closest('.field'))){var inp=$('input',el);if(inp&&t!==inp&&!t.closest('button'))inp.focus()}
});
function flash(input){
  if(!input||RM||!input.animate)return;
  input.animate([{opacity:.35},{opacity:1}],{duration:260,easing:'ease-out'});
}

/* ---------- bottom sheets ---------- */
var sheet=$('[data-ot="sheet"]'),scrim=$('[data-ot="scrim"]'),shT=$('[data-ot="shT"]'),opts=$('[data-ot="opts"]'),sheetKind=null,lastFocus=null;
var SHEETS={
  tif:{title:'Time in force',cur:function(){return S.tif},opts:[
    ['GTC','Good till cancelled (GTC)','Your order stays active until it’s fully filled or you cancel it manually.'],
    ['GTD','Good till date (GTD)','Your order expires automatically on the date and time you set.']]},
  stop:{title:'Order type',cur:function(){return S.type==='stop'?S.kind:null},opts:[
    ['limit','Stop-limit','Places a limit order at your price once the trigger price is reached. You control the price, but it may not fill.'],
    ['market','Stop-market','Places a market order once the trigger price is reached. Fills fast, but the price may slip.']]}
};
function openSheet(kind,from){
  sheetKind=kind;lastFocus=from;var c=SHEETS[kind];shT.textContent=c.title;
  opts.innerHTML=c.opts.map(function(o){var on=c.cur()===o[0];
    return '<button type="button" class="opt'+(on?' on':'')+'" role="radio" aria-checked="'+on+'" data-v="'+o[0]+'"><span class="rad"></span><span><b>'+o[1]+'</b><small>'+o[2]+'</small></span></button>'}).join('');
  setInert(true);screen.classList.add('sh');
  setTimeout(function(){var f=$('.opt.on',opts)||$('.opt',opts);if(f)f.focus({preventScroll:true})},RM?0:30);
}
function closeSheet(){
  if(!sheetKind)return;sheetKind=null;screen.classList.remove('sh');setInert(false);
  var f=lastFocus&&document.body.contains(lastFocus)?lastFocus:null;
  if(!f){f=S.type==='stop'?$('[data-type="stop"]',form):$('[data-tif]',form)}
  if(f)f.focus({preventScroll:true});
}
function setInert(on){[scroll].forEach(function(n){if(on)n.setAttribute('inert','');else n.removeAttribute('inert')})}
opts.addEventListener('click',function(e){
  var o=e.target.closest('.opt');if(!o)return;
  var v=o.getAttribute('data-v'),kind=sheetKind;
  if(kind==='tif'){S.tif=v}
  else{S.type='stop';S.kind=v;lastFocus=null}
  closeSheet();fullRender(kind==='stop');
  if(kind==='tif'){var tb=$('[data-tif]',form);if(tb)tb.focus({preventScroll:true})}else{var st=$('[data-type="stop"]',form);if(st)st.focus({preventScroll:true})}
});
scrim.addEventListener('click',closeSheet);
document.addEventListener('keydown',function(e){
  if(!sheetKind)return;
  if(e.key==='Escape'){closeSheet();e.preventDefault();return}
  if(e.key==='Tab'){var f=$$('.opt',opts),i=f.indexOf(document.activeElement);
    if(e.shiftKey&&i<=0){f[f.length-1].focus();e.preventDefault()}else if(!e.shiftKey&&i===f.length-1){f[0].focus();e.preventDefault()}}
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){var f2=$$('.opt',opts),j=f2.indexOf(document.activeElement);
    if(j>=0){f2[(j+(e.key==='ArrowDown'?1:-1)+f2.length)%f2.length].focus();e.preventDefault()}}
});

/* ---------- fit the 422px phone to its container ---------- */
var stage=$('[data-ot="stage"]'),phone=$('[data-ot="phone"]');
function fit(){var w=stage.clientWidth,s=Math.min(1,w/422);phone.style.transform='scale('+s+')';stage.style.height=Math.round(894*s)+'px'}
fit();
if(window.ResizeObserver)new ResizeObserver(fit).observe(stage);else window.addEventListener('resize',fit);

fh.innerHTML=headHTML();
fullRender(false);
}
