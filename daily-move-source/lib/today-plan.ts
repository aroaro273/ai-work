import {dayIndex,type Day,type RecordDay} from './model';
// Today's planned work can change while completed exercise snapshots stay intact.
export function reconcileToday(record:RecordDay,day:Day):RecordDay{
 const completed=new Map(record.items.filter(x=>record.done.includes(x.id)).map(x=>[x.id,x]));
 const items=day.items.map(x=>completed.get(x.id)||x);
 for(const item of completed.values())if(!items.some(x=>x.id===item.id))items.push(item);
 const done=items.filter(x=>completed.has(x.id)).map(x=>x.id);
 const rest=day.rest&&done.length===0;
 const unchanged=record.rest===rest&&JSON.stringify(record.items)===JSON.stringify(items);
 return {...record,items,done,rest,finished:record.finished&&(unchanged||rest||items.length>0&&done.length===items.length)};
}
export function syncToday(records:RecordDay[],plan:Day[],today:string):RecordDay[]{
 return records.map(record=>record.date===today?reconcileToday(record,plan[dayIndex(today)]):record);
}
