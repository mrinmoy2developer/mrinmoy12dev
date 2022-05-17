function lerp(a,b,t){
    return a+(b-a)*t;
}

function dashedLine(x1,y1,x2,y2,dashArr){
    // get the normalised line vector from start to end
    var nx = x2 - x1;
    var ny = y2 - y1;
    const dist = Math.sqrt(nx * nx + ny * ny);  // get the line length
    nx /= dist;
    ny /= dist;
    var dashIdx = 0;  // the index into the dash array
    var i = 0;        // the current line position in pixels
    s_ctx.beginPath();  // start a path
    while(i < dist){   // do while less than line length
         // get the line seg dash length
         var dashLen = dashArr[(dashIdx ++) % dashArr.length];
         // draw the dash
         s_ctx.moveTo(x1 + nx * i, y1 + ny * i);
         i = Math.min(dist,i + dashLen);
         s_ctx.lineTo(x1 + nx * i, y1 + ny * i);
         // add the spacing
         i += dashArr[(dashIdx ++) % dashArr.length];
         if(i <= 0) { // something is wrong so exit rather than endless loop
              break;
         }
     }
     s_ctx.stroke();  // stroke
}
function getIntersection(a,b,c,d) {
    const n1=(d.x-c.x)*(a.y-c.y)-(d.y-c.y)*(a.x-c.x);
    const n2=(c.y-a.y)*(a.x-b.x)-(c.x-a.x)*(a.y-b.y);
    const dn=(d.y-c.y)*(b.x-a.x)-(d.x-c.x)*(b.y-a.y);

    if(dn!=0){
        const v1=n1/dn;
        const v2=n2/dn;
        if(v1>=0&&v1<=1&&v2>=0&&v2<=1){
            return{
                x:lerp(a.x,b.x,v1),
                y:lerp(a.y,b.y,v1),
                offset:v1
            }
        }
    }
    return null;
}
function ployIntersection(p1,p2){
    for(let i=0;i<p1.length;i++)for(let j=0;j<p2.length;j++){
            const cut=getIntersection(
                p1[i],p1[(i+1)%p1.length],
                p2[j],p2[(j+1)%p2.length]
            );
            if(cut)return true;
        }
    return false;
}
function getRGBA(value){
    const alpha=Math.abs(value);
    const R=value<0?0:255;
    const G=R;
    const B=value>0?0:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
}
function getColor(value){
    const hue=(280+Math.random()*280)%360;
    return "hsl("+hue+",100%,60%)";
}