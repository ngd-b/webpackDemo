export function printMe(){
    // throw new Error("something error about");
    import("./index/text.js").then(text=>{
        console.log(text.default());
    })
    console.log("I comes from print.js");
}

export function printHello(){
    console.log("hello，you will");
}