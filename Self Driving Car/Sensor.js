class Sensor{
    constructor(car){
        this.car=car;
        this.nray=5;
        this.lray=200;
        this.sp=Math.PI/2
        this.rays=[];
        this.rd=[];
        this.#castRays();
    }
    update(rdbr,traffic){
        this.#castRays();
        this.rd=[];
        for(let i=0;i<this.rays.length;i++){
            this.rd.push(this.#getr(this.rays[i],rdbr,traffic));
        }
    }
    #getr(ray,rdbr,traffic){
        let t=[];
        for(let i=0;i<rdbr.length;i++){
            const cut=getIntersection(ray[0],ray[1],rdbr[i][0],rdbr[i][1]);
            if(cut)t.push(cut);
        }
        for(let i=0;i<traffic.length;i++){
            const p=traffic[i].poly;
            for(let j=0;j<p.length;j++){
                const cut=getIntersection(ray[0],ray[1],p[j],p[(j+1)%p.length]);
            if(cut)t.push(cut);
            }
        }
        if(t.length==0)return null;
        else{
            const offset=t.map(e=>e.offset);
            const min=Math.min(...offset)
            return t.find(e=>e.offset==min);
        }
    }
    #castRays(){
        this.rays=[];
        for(let i=0;i<this.nray;i++){
            const rang=this.car.ang+lerp(this.sp/2,-this.sp/2,i/(this.nray-1));
            const start={x:this.car.x,y:this.car.y};
            const end={
                x:this.car.x-Math.sin(rang)*this.lray,
                y:this.car.y-Math.cos(rang)*this.lray
            };
            this.rays.push([start,end]);
        }
    }
    draw(ctx){
        for(let i=0;i<this.nray;i++){
            let end=this.rays[i][1];
            if(this.rd[i])end=this.rd[i];
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.beginPath();
            ctx.moveTo(this.rays[i][0].x,this.rays[i][0].y);
            ctx.lineTo(end.x,end.y);
            ctx.stroke();

            ctx.lineWidth=2;
            ctx.strokeStyle="brown";
            ctx.beginPath();
            ctx.moveTo(end.x,end.y);
            ctx.lineTo(this.rays[i][1].x,this.rays[i][1].y);
            ctx.stroke();
        }
    }
};