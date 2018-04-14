class pagination{
    constructor(options){
        let defaults={
            el: '#app', 
            data: [],
            pageLength: [5, 10, 15, 20]
        }
        let obj=Object.assign({},defaults,options);
        let {el,data,pageLength,cb1,cb2}=obj;
        this.el = document.querySelector(el);
        this.data = data;
        this.pageLength = pageLength;
        this.cb1 = cb1;
        this.cb2 = cb2;
        this.init()
        this.click()
        this.liClick()
        this.subClick()
        this.addClick()
    }
    init(){  //页面的初次渲染
        let cont=document.createElement('table');
        cont.className='cont';
        let contStr=this.contInit(0,this.pageLength[0]);
        cont.innerHTML=contStr;
        this.el.appendChild(cont)
        let box=document.createElement('div');
        box.className ='pagination';
        this.el.appendChild(box)
        let span=document.createElement('span');
        span.innerHTML=`共${this.data.length}条`;
        box.appendChild(span);
        let select=document.createElement('select');
        select.className='select';
        let selStr='';
        for(var i=0;i<this.pageLength.length;i++){
            selStr += `<option value="">${this.pageLength[i]}条/页</option>`
        }
        select.innerHTML = selStr;
        box.appendChild(select);
        let num = this.data.length / this.pageLength[0];
        let list = document.createElement('ul');
        list.className = 'list';
        const listStr=this.listInit(num);
        list.innerHTML = listStr;
        box.appendChild(list);
        let input=document.createElement('p');
        input.innerHTML=`
            前往<input type="text" placeholder="1" class="text">页
        `;
        box.appendChild(input);
        this.change(num)
    }
    listInit(num){ //每次改变select时list改变innerHTML
        let listStr = `<li class="sub"><</li>`;
        for (var i = 0; i < num; i++) {
            if(i === 0){
                listStr += `<li class="show li">${i + 1}</li>`
            }
            else{
                listStr += `<li class="li">${i + 1}</li>`
            }
        }
        listStr += `<li class="add">></li>`;
        return listStr;
    }
    subClick(){//点击<时
        let list = document.querySelector('.list');
        let listLi = list.querySelectorAll('li');
        let sub=document.querySelector('.sub');
        let index=document.querySelector('.show').innerText;
        let that=this;
        sub.onclick=function () { 
            index--;
            if (index < 1) {
                index = listLi.length - 2;
            }
            if (index > listLi.length) {
                index = 1
            }
            that.changeLi(index)
        }
    }
    addClick(){   //点击>时
        let list = document.querySelector('.list');
        let listLi = list.querySelectorAll('li');
        let add = document.querySelector('.add');
        let index = document.querySelector('.show').innerText;
        let that = this;
        add.onclick = function () {
            index++;
            if (index < 1) {
                index = listLi.length - 2;
            }
            if (index > listLi.length-2) {
                index = 1
            }
            that.changeLi(index)
        }
    }
    changeLi(index){
        let val = this.selectVal();
        let cont = document.querySelector('.cont');
        this.changeLiColor(index)
        let contStr = this.contInit((index - 1) * val, index * val);
        cont.innerHTML = contStr;
    }
    contInit(start,end){
        let contStr = '';
        if(end>this.data.length){
            end=this.data.length;
        }
        for (var i = start; i < end; i++) {
            contStr += `<span>${this.data[i]}</span>`
        }
        this.cb1(contStr)
        return contStr;
    }
    click(){ //select点击时
        let select = document.querySelector('.select');
        let cont=document.querySelector('.cont');
        let list=document.querySelector('.list');
        let val=0;
        select.onchange=()=>{
            let val = this.selectVal();
            let num = Math.ceil(this.data.length / val);
            const listStr=this.listInit(num);
            list.innerHTML=listStr;
            this.cb2(num)
            this.change(num)
            let contStr = this.contInit(0,val);
            cont.innerHTML=contStr;
            this.liClick()
            this.addClick()
            this.subClick()
        }
    }
    change(num){  //input值改变时
        let text = document.querySelector('.text');
        let list = document.querySelector('.list');
        let cont = document.querySelector('.cont');
        let that=this;
        text.onchange=()=>{
            let val = text.value;
            if(val>num){
                val=1;
                alert('该页面不存在');
                return false;
            }
            else{
                this.changeLiColor(val)
            }
        }
        text.onkeydown=function () { 
            let val = text.value;
            if(event.keyCode===13){
                let index = that.selectVal();
                let contStr = that.contInit((val - 1) * index, index * val);
                cont.innerHTML = contStr;
                that.changeLiColor(val)
            }
        }
    }
    selectVal(){  
        let select = document.querySelector('.select');
        let index = select.selectedIndex;
        let val = parseInt(select.options[index].text);
        return val
    }
    liClick(){  //点击页数发生改变时
        let list = document.querySelector('.list');
        let listLi=list.querySelectorAll('.li');
        let that=this;
        for(var i=0;i<listLi.length;i++){
            listLi[i].onclick=function () { 
                let index=this.innerText*1;
                that.changeLi(index)
            }
        }
    }
    changeLiColor(index){
        let list = document.querySelector('.list');
        let listLi = list.querySelectorAll('li');
        for (var i = 1; i < listLi.length-1; i++) {
            listLi[i].className = 'li'
        }
        if(index!==0 && index!==listLi.length){
            listLi[index].className = 'show li'
        }
    }
}