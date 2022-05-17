class Car{
    constructor(x,y,w,h,remote,ms=3,color="blue"){
        this.d=false
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        
        this.s=0;
        this.a=0.2;
        this.ms=ms;
        this.fr=0.02;

        this.ang=0;

        this.auto=remote=="AI";
        if(remote!="FAKE"){
            this.sensor=new Sensor(this);
            this.brain=new DNN([this.sensor.nray,3,4]);
        }
        this.ctrl=new Control(remote);
        
        this.poly=this.#createPoly();
        this.img=new Image();
        this.img.src="Assets//car1.png"

        this.mask=document.createElement("canvas");
        this.mask.width=w;
        this.mask.height=h;
        const m_ctx=this.mask.getContext("2d");
        this.img.onload=()=>{
            m_ctx.fillStyle=color;
            m_ctx.rect(0,0,this.w,this.h);
            m_ctx.fill();

            m_ctx.globalCompositeOperation="destination-atop";
            m_ctx.drawImage(this.img,0,0,this.w,this.h);
            

        }
    }
    update(rdbr,traffic){
        if(!this.d){
            this.#move();
            this.poly=this.#createPoly();
            this.d=this.#checkD(rdbr,traffic);
        }
        if(this.sensor){
            this.sensor.update(rdbr,traffic);
            const offset=this.sensor.rd.map(s=>s==null?0:1-s.offset);
            const out=DNN.predict(offset,this.brain);
            // console.log(out);
            if(this.auto)[this.ctrl.f,this.ctrl.l,this.ctrl.r,this.ctrl.b]=out;
        }
    }
    #checkD(rdbr,traffic){
        for(let i=0;i<rdbr.length;i++)if(ployIntersection(this.poly,rdbr[i]))return true;
        for(let i=0;i<traffic.length;i++)if(ployIntersection(this.poly,traffic[i].poly))return true;
        return false;
    }
    #createPoly(){
        const pts=[];
        const rad=Math.hypot(this.w,this.h)/2;
        const alpha=Math.atan2(this.w,this.h);
        pts.push({
            x:this.x-Math.sin(this.ang-alpha)*rad,
            y:this.y-Math.cos(this.ang-alpha)*rad
        });
        pts.push({
            x:this.x-Math.sin(this.ang+alpha)*rad,
            y:this.y-Math.cos(this.ang+alpha)*rad
        });
        pts.push({
            x:this.x-Math.sin(Math.PI+this.ang-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.ang-alpha)*rad
        });
        pts.push({
            x:this.x-Math.sin(Math.PI+this.ang+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.ang+alpha)*rad
        });
        return pts;
    }
    #move(){
        if(this.ctrl.f)this.s+=this.a;
        if(this.ctrl.b)this.s-=this.a;
        if(this.s>this.ms)this.s=this.ms;
        if(this.s<-this.ms)this.s=-this.ms/2;
        if(this.s>0)this.s-=this.fr;
        if(this.s<0)this.s+=this.fr;
        if(Math.abs(this.s)<this.fr)this.s=0;
        
        if(this.s!=0){
            const flip=this.s>0?1:-1;
            if(this.ctrl.l)this.ang+=flip*0.03;
            if(this.ctrl.r)this.ang-=flip*0.03;
        }
        this.x-=Math.sin(this.ang)*this.s;
        this.y-=Math.cos(this.ang)*this.s;
    }
    draw(ctx,ds=0){
        // ctx.save();
        // ctx.translate(this.x,this.y);
        // ctx.rotate(-this.ang);
        // ctx.beginPath();
        // ctx.rect(-this.w/2,-this.h/2,this.w,this.h);
        // ctx.fill();
        // ctx.restore();

        // if(this.d)ctx.fillStyle="grey";
        // else ctx.fillStyle=color;
        // ctx.beginPath();
        // ctx.moveTo(this.poly[0].x,this.poly[0].y);
        // for(let i=1;i<this.poly.length;i++)ctx.lineTo(this.poly[i].x,this.poly[i].y);
        // ctx.fill();
        if(this.sensor&&ds)this.sensor.draw(ctx);
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.ang);
        if(!this.d){
            ctx.drawImage(this.mask,-this.w/2,-this.h/2,this.w,this.h);
            ctx.globalCompositeOperation="multiply";
        }
        ctx.drawImage(this.img,-this.w/2,-this.h/2,this.w,this.h);
        
        ctx.restore();
    }
}