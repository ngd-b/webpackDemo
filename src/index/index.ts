class ClassName {
    name:string="admin";
    constructor(name:string) {
        this.name = name;
    }
    print():void{
        console.log(this.name+"____hello");
    }
}
let user = new ClassName("test");
user.print();