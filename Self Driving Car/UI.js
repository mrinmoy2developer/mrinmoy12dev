class UI{
    constructor(){
        this.y=0;
        this.s=5;
        this.ctrl=new Control();
    }
    update(){
        if(this.ctrl.f)this.y+=this.s;
        if(this.ctrl.b)this.y-=this.s;
    }
};