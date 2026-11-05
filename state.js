(function(root){
  'use strict';
  const dateRE=/^\d{4}-\d{2}-\d{2}$/;
  function validDate(s){if(!dateRE.test(s||''))return false;const d=new Date(s+'T12:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===s;}
  function selectRange(range,date){if(!validDate(date))throw Error('Invalid date');if(!range.start||range.end||date<range.start)return {start:date,end:null};return {start:range.start,end:date};}
  function days(range){return range.start&&range.end?Math.round((Date.parse(range.end+'T12:00:00Z')-Date.parse(range.start+'T12:00:00Z'))/86400000)+1:0;}
  function shiftMonth(month,delta){const d=new Date(month+'-01T12:00:00Z');d.setUTCMonth(d.getUTCMonth()+delta);return d.toISOString().slice(0,7);}
  function shiftDate(date,delta){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+delta);return d.toISOString().slice(0,10);}
  function monthDays(month){const [y,m]=month.split('-').map(Number);const count=new Date(Date.UTC(y,m,0)).getUTCDate();return Array.from({length:count},(_,i)=>month+'-'+String(i+1).padStart(2,'0'));}
  function jstToday(now=new Date()){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
  function pretty(date){if(!validDate(date))return '';const [y,m,d]=date.split('-').map(Number);return y+'年'+m+'月'+d+'日';}
  function rangeLabel(r){return !r.start?'日程を選んでください':!r.end?pretty(r.start)+'〜 終了日を選んでください':pretty(r.start)+'〜'+pretty(r.end)+'（'+days(r)+'日間）';}
  function compactRangeLabel(r){if(!r.end)return rangeLabel(r);const a=r.start.split('-').map(Number),b=r.end.split('-').map(Number);return a[0]===b[0]?(a[1]+'月'+a[2]+'日〜'+(a[1]===b[1]?'':b[1]+'月')+b[2]+'日（'+days(r)+'日間）'):rangeLabel(r);}
  function requestMessage(s){const f=s.draft;return ['貸切バスの手配について相談します。','利用期間：'+rangeLabel(s.range),'乗車地：'+(s.boarding||'未定')+'（'+(f.boardingDetail||'詳細未定')+'）','最終降車地：'+s.alighting+'（'+(f.alightingDetail||'詳細未定')+'）','希望：'+s.vehicleType+' '+s.vehicleCount+'台','最初の乗車時刻：'+(f.startTime||'未定'),'最後の降車時刻：'+(f.endTime||'未定'),'人数：'+(f.passengers?f.passengers+'名':'未定'),'会社名：'+(f.company||'未入力'),'担当者名：'+(f.contact||'未入力'),'返信先：'+(f.email||'未入力'),'立寄り先・日別行程：'+(f.itinerary||'未定'),'荷物・設備・その他：'+(f.notes||'未確認'),'行程と時刻を含め、対応可否の確認を希望します。'].join('\n');}
  function acceptSnapshot(state,reply){return reply&&reply.revision===state.revision&&reply.month===state.month&&reply.conditionKey===conditionKey(state);}
  function conditionKey(s){return JSON.stringify([s.boarding,s.alighting,s.vehicleType,String(s.vehicleCount)]);}
  const api={validDate,selectRange,days,shiftMonth,shiftDate,monthDays,jstToday,pretty,rangeLabel,compactRangeLabel,requestMessage,acceptSnapshot,conditionKey};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.AgencyState=api;
})(typeof globalThis!=='undefined'?globalThis:this);
