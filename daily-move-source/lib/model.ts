export const kinds=['하체','상체','몸통','걷기','스트레칭','기타'];
export const days=['월','화','수','목','금','토','일'];
export type Exercise={id:string;kind:string;name:string;minutes:number;reps:number;sets:number};
export type Day={rest:boolean;items:Exercise[]};
export type Settings={time:string;weekdays:number[];enabled:boolean;sound:boolean;confetti:boolean};
export type RecordDay={date:string;items:Exercise[];done:string[];rest:boolean;finished:boolean};
export const defaultPlan:Day[]=days.map(()=>({rest:false,items:[]}));
export const defaultSettings:Settings={time:'21:00',weekdays:[0,1,2,3,4,5,6],enabled:false,sound:true,confetti:true};
export function dateKey(d=new Date()){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}
export function dayIndex(key:string){return (new Date(key+'T12:00:00+09:00').getDay()+6)%7;}
