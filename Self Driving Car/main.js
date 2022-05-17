const street=document.getElementById('Street');
street.width=300;

const graphs=document.getElementById('Graphs');
graphs.width=window.innerWidth/2;

const s_ctx=street.getContext('2d');
const g_ctx=graphs.getContext('2d');

const road=new Road(street.width/2,0.9*street.width,4)
// const car=new Car(road.getlane([1]),100,30,50,"AI");
const N=500;
const M=50;

const cars=getCar(N);
// car.draw(s_ctx);
if(localStorage.getItem("Hero")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(localStorage.getItem("Hero"));
        if(i!=0)DNN.mutate(cars[i].brain,0.2);
    }
}
let hero=cars[0];

const traffic=[
    new Car(road.getlane(1),-100,30,50,"FAKE",2,getColor()),
    new Car(road.getlane(0),-300,30,50,"FAKE",2,getColor()),
    new Car(road.getlane(2),-300,30,50,"FAKE",2,getColor())

];
// const traffic=[];
// for(let i=0;i<M;i++)
// traffic.push(new Car(road.getlane(Math.random()*road.nlane),-Math.random()*20000,30,50,"FAKE",Math.random()*6-3,getColor()));

ui=new UI;

animate();

function save(){
    console.log("saving");
    localStorage.setItem("Hero",JSON.stringify(hero.brain));
}
function discard(){
    console.log("deleting");
    localStorage.removeItem("Hero");
}
function getCar(n){
    const cars=[];
    for(let i=0;i<n;i++)cars.push(new Car(road.getlane(Math.random()*road.nlane),100,30,50,"AI"));
    return cars;
}
function animate(time) {
    ui.update();
    // console.log(ui.y);

    for(let i=0;i<traffic.length;i++)traffic[i].update(road.br,[]);
    for(let i=0;i<cars.length;i++)cars[i].update(road.br,traffic);

    hero=cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)));

    street.height=window.innerHeight;
    graphs.height=window.innerHeight;

    s_ctx.save();
    s_ctx.translate(0,street.height*0.7-hero.y+ui.y);
    
    road.draw(s_ctx);
    for(let i=0;i<traffic.length;i++)traffic[i].draw(s_ctx);
    s_ctx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++)cars[i].draw(s_ctx);
    s_ctx.globalAlpha=1;
    hero.draw(s_ctx,1);
    s_ctx.restore();
    g_ctx.lineDashOffset=-time/50;
    Visualizer.showDNN(g_ctx,hero.brain);

    requestAnimationFrame(animate);

}
street.addEventListener("click",(e)=>{
    const x=e.offsetX;
    const y=hero.y+e.offsetY-street.height*0.7;
    console.log("New Car added to traffic at ("+x+","+y+")");
    console.log("Hero is at ("+hero.x+","+hero.y+")");
    // console.log("Hero gap is ("+(hero.x-x)+","+(hero.y-y)+")");

    traffic.push(new Car(x,y,30,50,"FAKE",2,getColor()),);
});