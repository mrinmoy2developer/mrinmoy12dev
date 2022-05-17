class Road{
    constructor(x,w,nlane=3){
        this.x=x
        this.w=w;
        this.nlane=nlane
        
        this.l=x-w/2;
        this.r=x+w/2;

        const inf=1e6;
        this.t=-inf;
        this.b=inf;

        const tl={x:this.l,y:this.t};
        const tr={x:this.r,y:this.t};
        const bl={x:this.l,y:this.b};
        const br={x:this.r,y:this.b};

        this.br=[[tl,bl],[tr,br]];
    }
    getlane(lid){
        const lw=this.w/this.nlane;
        return this.l+lw/2+
        Math.min(lid,this.nlane-1)*lw;
    }
    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        for(let i=1;i<this.nlane;i++){
            const x=lerp(this.l,this.r,i/this.nlane);
            // if(i>0&&i<this.nlane)ctx.setLineDash([20,20]);
            // else ctx.setLineDash([]);
            ctx.beginPath();
            ctx.setLineDash([20,20]);
            ctx.moveTo(x,this.t);
            ctx.lineTo(x,this.b);
            ctx.stroke();
            // dashedLine(x,this.t,x,this.b,[20,20]);
        }
        ctx.setLineDash([]);
        this.br.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y)
            ctx.lineTo(border[1].x,border[1].y)
            ctx.stroke();
        });

    }
};
