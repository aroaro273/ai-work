'use client';
import {useEffect,useRef} from 'react';
type Particle={x:number;y:number;vx:number;vy:number;life:number;age:number;size:number;color:string;kind:'spark'|'paper'|'streamer';rotation:number;spin:number};
export default function CelebrationFireworks(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const g=canvas.getContext('2d');if(!g)return;
  let width=0,height=0,particles:Particle[]=[],frame=0;
  const colors=['#ED3500','#093FB4','#F3E6D5','#ED3500','#093FB4'];
  function resize(){if(!canvas||!g)return;width=canvas.clientWidth;height=canvas.clientHeight;const d=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*d);canvas.height=Math.round(height*d);g.setTransform(d,0,0,d,0,0)}
  resize();const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);
  const start=performance.now();let last=start;
  const cues=[{time:0,x:.18,y:.2,count:85,scale:1},{time:.35,x:.82,y:.18,count:85,scale:1},{time:1.05,x:.5,y:.16,count:110,scale:1.25},{time:1.9,x:.13,y:.34,count:70,scale:.9},{time:2.2,x:.87,y:.32,count:70,scale:.9},{time:3.1,x:.5,y:.13,count:130,scale:1.3},{time:3.65,x:.22,y:.24,count:70,scale:1},{time:3.9,x:.78,y:.24,count:70,scale:1}];
  function burst(x:number,y:number,count:number,scale:number){const unit=Math.min(width,height)/450;for(let i=0;i<count;i++){const angle=Math.PI*2*i/count+Math.random()*.035,speed=(70+Math.random()*160)*scale*unit;particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1.15+Math.random()*.65,age:0,size:1.5+Math.random()*2,color:colors[i%colors.length],kind:'spark',rotation:0,spin:0})}}
  for(let i=0;i<190;i++){const side=i%2;particles.push({x:side?width:0,y:height*.9,vx:(side?-1:1)*(80+Math.random()*width*.42),vy:-(height*.5+Math.random()*height*.65),life:3.8+Math.random()*2,age:0,size:4+Math.random()*5,color:colors[i%colors.length],rotation:Math.random()*6,spin:(Math.random()-.5)*7,kind:i%4?'paper':'streamer'})}
  function animate(now:number){if(!g)return;const t=(now-start)/1000,dt=Math.min(.04,(now-last)/1000);last=now;
   while(cues.length&&cues[0].time<=t){const c=cues.shift()!;burst(width*c.x,height*c.y,c.count,c.scale)}
   g.clearRect(0,0,width,height);particles=particles.filter(p=>p.age<p.life);
   for(const p of particles){p.age+=dt;p.vx*=Math.pow(p.kind==='spark'?.985:.998,dt*60);p.vy+=(p.kind==='spark'?34:height*.25)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;g.globalAlpha=Math.min(1,Math.max(0,(p.life-p.age)/.7));g.fillStyle=p.color;g.strokeStyle=p.color;
    if(p.kind==='spark'){g.lineWidth=p.size;g.beginPath();g.moveTo(p.x-p.vx*.025,p.y-p.vy*.025);g.lineTo(p.x,p.y);g.stroke();g.beginPath();g.arc(p.x,p.y,p.size*.6,0,Math.PI*2);g.fill()}else{p.rotation+=p.spin*dt;g.save();g.translate(p.x,p.y);g.rotate(p.rotation);if(p.kind==='streamer'){g.lineWidth=2.5;g.beginPath();g.moveTo(-3,-p.size*2);g.quadraticCurveTo(7,-p.size,0,0);g.quadraticCurveTo(-7,p.size,3,p.size*2);g.stroke()}else{g.scale(Math.cos(p.age*5),1);g.fillRect(-p.size*.5,-p.size*.7,p.size,p.size*1.4)}g.restore()}}
   g.globalAlpha=1;if(t<6)frame=requestAnimationFrame(animate);else g.clearRect(0,0,width,height);
  }
  frame=requestAnimationFrame(animate);return()=>{cancelAnimationFrame(frame);resizeObserver.disconnect();g.clearRect(0,0,width,height)};
 },[]);
 return <canvas ref={ref} className="celebration-fireworks" aria-hidden="true"/>;
}
