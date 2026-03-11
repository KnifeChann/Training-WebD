let age = 88;

if (age >= 18) {
    console.log("ADULT");
}
else if (age > 13 && age < 18) {
    console.log("TEEN");
}
else {
    console.log("MINOR");
}


for(let  i=1 ;i<11; i++){
    console.log("5 X "+ i  +" = " + 5*i);
}



for(let  i=1 ;i<11; i++){
    console.log(i);
}

for(let  i=10 ;i>0; i--){
    console.log(i);
}



let n = 99;
for(let  i=1 ;i<=n; i++){
    console.log(i);
}




let b =5;
for(let a=1;a<=b;a++ ){
    console.log(a);
}



let x = 10;
for(let i = 0;i<x;i++){
    if(i%2==0){
        console.log(i);
    }
    else{
        console.log(i);
    }
}



let z =3;
let mul = 1;
for(let i= 1; i<=z;i++){
    mul*=i;
}
console.log(mul);



let num = 121;
let orgininal = num;
let rev=0;
while(num>0){
    let  l = num%10; 
    rev = rev*10+l;
    num=Math.floor(num / 10)
}
console.log(rev);
if(orgininal === rev){
    console.log("Palindrome");
}
else{
    console.log("not Palindrome");
} 

