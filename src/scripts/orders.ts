// @ts-nocheck
// orders.ts – logic của mockup "Open orders & Order history" (case study Trading).
// Port từ open-orders-mockup.html: giữ nguyên hành vi, chỉ đổi cách tìm phần tử (theo data-oo trong khối gốc `root`)
// để nhiều mockup chạy cùng trang và không gắn gì vào window. Dữ liệu OPEN0 / HIST ở đầu file (chuỗi lấy từ Figma;
// các card đánh dấu * là "tạm", chưa có trong Figma).

export function initOrders(root) {
var uid=root.getAttribute('data-uid');
var $=function(s,r){return (r||root).querySelector(s)};
var $$=function(s,r){return [].slice.call((r||root).querySelectorAll(s))};
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var CHEV='<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

/* ---------- data (strings come from Figma; orders marked * are not in Figma) ---------- */
var OPEN0=[
 {id:'o1',kind:'limit',side:'sell',label:'Limit Sell',time:'10 Oct, 11:37',fill:34,
  rows:[['Price','68,700.00 USDT'],['Filled / Amount','0.0450 / 0.1250 BTC'],['Total','8,587.50 USDT'],['Expires','17 Oct 2026, 09:15']],
  body:'Limit Sell · BTC/USDT. The unfilled 0.0800 BTC will be released back to your balance. Filled parts are not affected.',
  sum:[['Price','68,700.00 USDT'],['Filled / Amount','0.0450 / 0.1250 BTC'],['Remaining','0.0800 BTC']]},
 {id:'o2',kind:'twap',side:'buy',label:'TWAP Buy · Limit',time:'10 Oct, 12:37',fill:38,
  rows:[['Avg. price','68,512.40 USDT'],['Filled / Total','0.0343 / 0.0903 BTC'],['Sub-orders','68 / 180'],['Ends','10 Oct, 14:07']],
  body:'TWAP Buy · Limit · BTC/USDT. The remaining 112 sub-orders will be cancelled and the unused balance released back to your balance. Filled sub-orders stay filled.',
  sum:[['Filled / Total','0.0343 / 0.0903 BTC'],['Sub-orders','68 / 180'],['Remaining','0.0560 BTC']]},
 {id:'o3',kind:'stop',side:'buy',label:'Stop-limit Buy',time:'10 Oct, 13:02',wait:'Waiting for trigger',
  rows:[['Trigger','≥ 69,000.00 USDT'],['Limit price','69,100.00 USDT'],['Amount','0.0900 BTC'],['Expires','Until cancelled']],
  body:'Stop-limit Buy · BTC/USDT. The order has not triggered yet. The reserved balance will be released back to your balance.',
  sum:[['Trigger','≥ 69,000.00 USDT'],['Limit price','69,100.00 USDT'],['Amount','0.0900 BTC']]},
 {id:'o4',kind:'limit',side:'buy',label:'Limit Buy',time:'10 Oct, 12:37',fill:0,
  rows:[['Price','68,400.00 USDT'],['Filled / Amount','0.0000 / 0.0900 BTC'],['Total','6,156.00 USDT'],['Expires','Until cancelled']],
  body:'Limit Buy · BTC/USDT. The unfilled 6,156.00 USDT will be released back to your balance. Filled parts are not affected.',
  sum:[['Price','68,400.00 USDT'],['Filled / Amount','0.0000 / 0.0900 BTC'],['Remaining','0.0900 BTC']]},
 {id:'o5',kind:'stop',side:'sell',label:'Stop-market Sell',time:'10 Oct, 13:20',wait:'Waiting for trigger',
  rows:[['Trigger','≤ 66,000.00 USDT'],['Amount','0.1250 BTC']],
  body:'Stop-market Sell · BTC/USDT. The order has not triggered yet. The reserved balance will be released back to your balance.',
  sum:[['Trigger','≤ 66,000.00 USDT'],['Amount','0.1250 BTC'],['Status','Waiting for trigger']]}
];
var HIST=[
 {side:'buy',label:'Market Buy',time:'10 Oct, 14:21',st:['Filled','ok'],rows:[['Avg. price','68,566.80 USDT'],['Filled','0.0900 BTC'],['Total spent','6,171.01 USDT'],['Fee','6.17 USDT']]},
 {side:'buy',label:'TWAP Buy',time:'10 Oct, 13:05',st:['Filled','ok'],rows:[['Avg. price','68,498.12 USDT'],['Filled','0.0903 BTC'],['Sub-orders','180 / 180'],['Fee','6.19 USDT']]},
 {side:'sell',label:'Limit Sell',time:'10 Oct, 09:42',st:['Expired','warn'],rows:[['Price','69,234.61 USDT'],['Filled / Amount','0.0000 / 0.1250 BTC']]},
 {side:'buy',label:'Limit Buy · GTC',time:'10 Oct, 08:42',st:['Cancelled','neu'],rows:[['Price','67,879.47 USDT'],['Filled / Amount','0.0300 / 0.0900 BTC'],['Total','2,036.38 USDT'],['Fee','2.04 USDT']]},
 {side:'sell',label:'Stop-market Sell',time:'9 Oct, 22:10',st:['Failed','err'],rows:[['Trigger','≤ 66,000.00 USDT'],['Reason','Insufficient balance at trigger']]},
 {side:'buy',label:'Stop-limit Buy',time:'9 Oct, 18:30',st:['Filled','ok'],rows:[['Trigger','≥ 69,000.00 USDT'],['Avg. price','69,012.40 USDT'],['Filled','0.0900 BTC'],['Fee','6.21 USDT']]} /* * not in Figma */
];

/* ---------- state ---------- */
var open=OPEN0.slice(),tab='open',F='all',pending=null,lastFocus=null;
var screen=$('[data-oo="screen"]'),list=$('[data-oo="list"]'),fil=$('[data-oo="fil"]'),sheet=$('[data-oo="sheet"]');

function rowsHTML(rows){return rows.map(function(r){return '<div class="r"><span class="k">'+r[0]+'</span><span class="v">'+r[1]+'</span></div>'}).join('')}
function count(k){return open.filter(function(o){return k==='all'||o.kind===k}).length}
function openCard(o){
  var up=o.side==='buy',fl;
  if(o.wait)fl='<span>'+o.wait+'</span>';
  else fl='<div class="bar '+(up?'up':'down')+'" style="--w:'+(Math.round(o.fill/10)*10)+'%"><i></i></div><span>'+o.fill+'% filled</span>';
  return '<article class="card" data-id="'+o.id+'"><div class="ch"><b>BTC/USDT</b><span>'+o.time+'</span></div>'+
   '<div class="ctr"><span class="ty '+(up?'up':'down')+'">'+o.label+'</span><div class="fl">'+fl+'</div></div>'+
   '<div class="cd">'+rowsHTML(o.rows)+'</div>'+
   '<div class="ca"><button type="button" class="cb" data-cancel="'+o.id+'" aria-label="Cancel '+o.label+'">Cancel</button></div></article>';
}
function histCard(h){
  return '<article class="card h"><div class="ch"><b>BTC/USDT</b><span>'+h.time+'</span></div>'+
   '<div class="ctr"><span class="ty '+(h.side==='buy'?'up':'down')+'">'+h.label+'</span><span class="badge b-'+h.st[1]+'">'+h.st[0]+'</span></div>'+
   '<div class="cd">'+rowsHTML(h.rows)+'</div></article>';
}
function render(){
  var isOpen=tab==='open';
  $('[data-o="openlbl"]').textContent='Open orders ('+open.length+')';
  $$('.otb').forEach(function(t){var on=t.getAttribute('data-tab')===tab;t.classList.toggle('on',on);t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1});
  list.setAttribute('aria-labelledby',uid+(isOpen?'-t-open':'-t-hist'));
  if(isOpen){
    fil.style.height='52px';
    fil.innerHTML='<div class="ofl">'+[['all','All'],['limit','Limit'],['stop','Stop'],['twap','TWAP']].map(function(c){
      return '<button type="button" class="fc'+(F===c[0]?' on':'')+'" data-f="'+c[0]+'" aria-pressed="'+(F===c[0])+'">'+c[1]+' ('+count(c[0])+')</button>'}).join('')+'</div><span class="fall">Cancel all</span>';
    list.innerHTML=open.filter(function(o){return F==='all'||o.kind===F}).map(openCard).join('');
  }else{
    fil.style.height='48px';
    fil.innerHTML='<div class="ofl" inert><span class="hf">Type'+CHEV+'</span><span class="hf">Side'+CHEV+'</span><span class="hf">Last 7 days'+CHEV+'</span></div>';
    list.innerHTML=HIST.map(histCard).join('');
  }
  $('[data-oo="reset"]').hidden=open.length===OPEN0.length;
}
function setTab(t){tab=t;list.scrollTop=0;render()}
$('[data-oo="tabs"]').addEventListener('click',function(e){var b=e.target.closest('[data-tab]');if(b&&b.getAttribute('data-tab')!==tab)setTab(b.getAttribute('data-tab'))});
$('[data-oo="tabs"]').addEventListener('keydown',function(e){
  if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;
  var t=tab==='open'?'hist':'open';setTab(t);$('[data-tab="'+t+'"]').focus();e.preventDefault();
});
fil.addEventListener('click',function(e){var b=e.target.closest('[data-f]');if(!b)return;F=b.getAttribute('data-f');render();var n=$('[data-f="'+F+'"]',fil);if(n)n.focus({preventScroll:true})});
list.addEventListener('click',function(e){var b=e.target.closest('[data-cancel]');if(b)openSheet(b.getAttribute('data-cancel'),b)});
$('[data-oo="reset"]').addEventListener('click',function(){open=OPEN0.slice();F='all';tab='open';render()});

/* ---------- cancel sheet ---------- */
function setInert(on){[$('[data-oo="tabs"]'),fil,list].forEach(function(n){if(on)n.setAttribute('inert','');else n.removeAttribute('inert')})}
function openSheet(id,from){
  var o=open.filter(function(x){return x.id===id})[0];if(!o)return;
  pending=id;lastFocus=from;
  $('[data-oo="shB"]').textContent=o.body;$('[data-oo="shS"]').innerHTML=rowsHTML(o.sum);
  setInert(true);screen.classList.add('sh');
  setTimeout(function(){$('[data-oo="shNo"]').focus({preventScroll:true})},RM?0:30);
}
function closeSheet(){
  if(!pending)return;pending=null;screen.classList.remove('sh');setInert(false);
  var f=lastFocus&&document.body.contains(lastFocus)?lastFocus:$('[data-tab="open"]');if(f)f.focus({preventScroll:true});
}
$('[data-oo="shNo"]').addEventListener('click',closeSheet);
$('[data-oo="scrim"]').addEventListener('click',closeSheet);
$('[data-oo="shOk"]').addEventListener('click',function(){
  var id=pending;closeSheet();
  var el=$('[data-id="'+id+'"]',list);
  var done=function(){open=open.filter(function(o){return o.id!==id});render();var n=$('[data-tab="open"]');if(n)n.focus({preventScroll:true})};
  if(el&&!RM){el.classList.add('out');setTimeout(done,170)}else done();
});
document.addEventListener('keydown',function(e){
  if(!pending)return;
  if(e.key==='Escape'){closeSheet();e.preventDefault();return}
  if(e.key==='Tab'){var f=[$('[data-oo="shOk"]'),$('[data-oo="shNo"]')],i=f.indexOf(document.activeElement);
    if(e.shiftKey&&i<=0){f[1].focus();e.preventDefault()}else if(!e.shiftKey&&i===1){f[0].focus();e.preventDefault()}}
});

/* ---------- fit the 422px phone to its container ---------- */
var stage=$('[data-oo="stage"]'),phone=$('[data-oo="phone"]');
function fit(){var w=stage.clientWidth,s=Math.min(1,w/422);phone.style.transform='scale('+s+')';stage.style.height=Math.round(894*s)+'px'}
fit();
if(window.ResizeObserver)new ResizeObserver(fit).observe(stage);else window.addEventListener('resize',fit);
render();
}
