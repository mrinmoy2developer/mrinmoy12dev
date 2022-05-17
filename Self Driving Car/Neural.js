class DNN{
    constructor(nl){
        this.level=[];
        for(let i=0;i<nl.length-1;i++)this.level.push(new Level(nl[i],nl[i+1]));
    }
    static predict(inp,dnn){
        let out=Level.predict(inp,dnn.level[0]);
        for(let i=1;i<dnn.length;i++)out=Level.predict(out,dnn[i]);
        return out;
    }
    static mutate(dnn,amount=1){
        dnn.level.forEach(l=>{
            for(let i=0;i<l.b.length;i++)
            l.b[i]=lerp(l.b[i],Math.random()*2-1,amount);
            for(let i=0;i<l.w.length;i++)
            for(let j=0;j<l.w[i].length;j++)
            l.w[i][j]=lerp(l.w[i][j],Math.random()*2-1,amount);
        });
    }
};
class Level{
    constructor(ninp,nout){
        this.inp=new Array(ninp);
        this.out=new Array(nout);
        this.b=new Array(nout);
        this.w=[];

        for(let i=0;i<ninp;i++)this.w[i]=new Array(nout);
        
        Level.#randomize(this);
    }
    static #randomize(level){
        for(let i=0;i<level.inp.length;i++)
        for(let j=0;j<level.out.length;j++)
        level.w[i][j]=Math.random()*2-1;
        for(let i=0;i<level.b.length;i++)
        level.b[i]=Math.random()*2-1;
    }
    static predict(inp,level){
        for(let i=0;i<level.inp.length;i++)level.inp[i]=inp[i];
        for(let i=0;i<level.out.length;i++){
            let s=0;
            for(let j=0;j<level.inp.length;j++)s+=level.inp[j]*level.w[j][i];
            level.out[i]=(s>level.b[i])?1:0;
        }
        return level.out;
    }
};