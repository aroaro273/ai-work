import {syncToday} from './today-plan';
import {defaultPlan,defaultSettings,kinds,dateKey,type Day,type Settings,type RecordDay} from './model';
const KEY='daily-move-public-v1';
export type LocalState={version:1;plan:Day[];settings:Settings;records:RecordDay[]};
export function freshState():LocalState{return {version:1,plan:JSON.parse(JSON.stringify(defaultPlan)),settings:JSON.parse(JSON.stringify(defaultSettings)),records:[]}}
function validItem(x:any){return x&&typeof x.id==='string'&&kinds.includes(x.kind)&&typeof x.name==='string'&&['minutes','reps','sets'].every(k=>Number.isFinite(x[k])&&x[k]>=0)}
export function validState(x:any):x is LocalState{return x?.version===1&&Array.isArray(x.plan)&&x.plan.length===7&&x.plan.every((d:any)=>typeof d.rest==='boolean'&&Array.isArray(d.items)&&d.items.every(validItem))&&x.settings&&['sound','confetti','enabled'].every(k=>typeof x.settings[k]==='boolean')&&/^([01]\d|2[0-3]):00$/.test(x.settings.time)&&Array.isArray(x.settings.weekdays)&&x.settings.weekdays.every((d:any)=>Number.isInteger(d)&&d>=0&&d<7)&&Array.isArray(x.records)&&x.records.every((r:any)=>/^\d{4}-\d{2}-\d{2}$/.test(r.date)&&Array.isArray(r.items)&&r.items.every(validItem)&&Array.isArray(r.done)&&r.done.every((id:any)=>r.items.some((i:any)=>i.id===id))&&typeof r.rest==='boolean'&&typeof r.finished==='boolean')}
export function readState():LocalState{try{const raw=localStorage.getItem(KEY);if(!raw)return freshState();const state=JSON.parse(raw);if(!validState(state))throw Error();return state}catch{throw new Error('이 브라우저의 기록을 불러오지 못했어요. 저장 공간과 개인정보 보호 설정을 확인해 주세요.')}}
export function writeState(state:LocalState){if(!validState(state))throw new Error('저장할 기록을 확인해 주세요.');try{localStorage.setItem(KEY,JSON.stringify(state))}catch{throw new Error('기록을 저장하지 못했어요. 브라우저 저장 공간과 개인정보 보호 설정을 확인해 주세요.')}}
export function writeProfile(plan:Day[],settings:Settings,today=dateKey()){const old=readState();const next={...old,plan,settings,records:syncToday(old.records,plan,today)};writeState(next);return next}
export function writeRecord(record:RecordDay){const old=readState();writeState({...old,records:[...old.records.filter(r=>r.date!==record.date),record]})}
