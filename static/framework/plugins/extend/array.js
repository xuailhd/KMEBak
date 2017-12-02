if (!Array.prototype.every) 
{
    Array.prototype.every = function(fun /*, thisp*/)
    {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in this &&
                !fun.call(thisp, this[i], i, this))
                return false;
        }
        return true;
    };
}


if (!Array.prototype.filter)
{
    Array.prototype.filter = function(fun /*, thisp*/)
    {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();
        var res = new Array();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in this)
            {
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, this))
                    res.push(val);
            }
        }
        return res;
    };
}

if (!Array.prototype.forEach)
{
    Array.prototype.forEach = function(fun /*, thisp*/)
    {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in this)
                fun.call(thisp, this[i], i, this);
        }
    };
}

if (!Array.prototype.map)
{
    Array.prototype.map = function(fun /*, thisp*/)
    {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();
        var res = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in this)
                res[i] = fun.call(thisp, this[i], i, this);
        }
        return res;
    };
}

if (!Array.prototype.some)
{
    Array.prototype.some = function(fun /*, thisp*/)
    {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in this &&
                fun.call(thisp, this[i], i, this))
                return true;
        }
        return false;
    };
}

if (!Array.prototype.sortNum)
Array.prototype.sortNum = function() {
    return this.sort( function (a,b) { return a-b; } );
}

if (!Array.prototype.find)
Array.prototype.find = function(searchStr) {
    var returnArray = false;
    for (i=0; i<this.length; i++) {
        if (typeof(searchStr) == 'function') {
            if (searchStr.test(this[i])) {
                if (!returnArray) { returnArray = [] }
                returnArray.push(i);
            }
        } else {
            if (this[i]===searchStr) {
                if (!returnArray) { returnArray = [] }
                returnArray.push(i);
            }
        }
    }
    return returnArray;
}

//随机改变数组的排序
if (!Array.prototype.shuffle)
Array.prototype.shuffle = function (){   
    for(var rnd, tmp, i=this.length; i; rnd=parseInt(Math.random()*i), tmp=this[--i], this[i]=this[rnd], this[rnd]=tmp);  
    return this;
}

if (!Array.prototype.compare)
Array.prototype.compare = function(testArr) {
    if (this.length != testArr.length) return false;
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) { 
            if (!this[i].compare(testArr[i])) return false;
        }
        if (this[i] !== testArr[i]) return false;
    }
    return true;
}

if (!Array.prototype.unique)
Array.prototype.unique = function() {
    var data = this || [];
    var a = {}; //声明一个对象，javascript的对象可以当哈希表用
    for (var i = 0; i < data.length; i++) {
        a[data[i]] = true;  //设置标记，把数组的值当下标，这样就可以去掉重复的值
    }
    data.length = 0; 

    for (var i in a) { //遍历对象，把已标记的还原成数组
        this[data.length] = i; 
    } 
    return data;
}

if (!Array.prototype.addAll)
Array.prototype.addAll = function($array)
{
    if($array == null || $array.length == 0)
        return;
    for(var $i=0; $i<$array.length; $i++)
        this.push($array[$i]);
}

if (!Array.prototype.contains)
Array.prototype.contains = function($value)
{
    for(var $i=0; $i<this.length; $i++)
    {
        var $element = this[$i];
        if($element == $value)
            return true;
    }
    return false;
}

if (!Array.prototype.indexOf)
Array.prototype.indexOf = function($value)
{
    for(var $i=0; $i<this.length; $i++)
    {
        if(this[$i] == $value)
            return $i;
    }
    return -1;
}

if (!Array.prototype.lastIndexOf)
{
    Array.prototype.lastIndexOf = function(elt /*, from*/)
    {
        var len = this.length;
        var from = Number(arguments[1]);
        if (isNaN(from))
        {
            from = len - 1;
        }
        else
        {
            from = (from < 0)
                 ? Math.ceil(from)
                 : Math.floor(from);
            if (from < 0)
                from += len;
            else if (from >= len)
                from = len - 1;
        }
        for (; from > -1; from--)
        {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}

if (!Array.prototype.insertAt)
Array.prototype.insertAt = function($value, $index)
{
    if($index < 0)
        this.unshift($value);
    else if($index >= this.length)
        this.push($value);
    else
        this.splice($index, 0, $value);
}

/** 
* 根据数组的下标来删除元素 
*/
if (!Array.prototype.removeByIndex)
Array.prototype.removeByIndex=function($n) {　  
    if($n<0){　//如果n<0，则不进行任何操作。  
        return this;  
    }else{  
        this.splice($n, 1);
    }  
}

if (!Array.prototype.remove)
Array.prototype.remove = function($value)
{
    var $index = this.indexOf($value);
    if($index != -1)
        this.splice($index, 1);
}

if (!Array.prototype.removeAll)
Array.prototype.removeAll = function()
{
    while(this.length > 0)
        this.pop();
}

if (!Array.prototype.replace)
Array.prototype.replace = function($oldValue, $newValue)
{
    for(var $i=0; $i<this.length; $i++)
    {
        if(this[$i] == $oldValue)
        {
            this[$i] = $newValue;
            return;
        }
    }
}

if (!Array.prototype.swap)
Array.prototype.swap = function($a, $b)
{
    if($a == $b)
        return;
    var $tmp = this[$a];
    this[$a] = this[$b];
    this[$b] = $tmp;
}

if (!Array.prototype.max)
Array.prototype.max = function() {  
    return Math.max.apply({}, this);  
}

if (!Array.prototype.min)
Array.prototype.min = function() {  
    return Math.min.apply({}, this);  
}

if (!Array.prototype.splice)
Array.prototype.splice = function(start, delLen, item){
    var len =this.length;
    start = start<0?0:start>len?len:start?start:0;
    delLen=delLen<0?0:delLen>len?len:delLen?delLen:len; 

    var arr =[],res=[];
    var iarr=0,ires=0,i=0;

    for(i=0;i<len;i++){
        if(i<start|| ires>=delLen) arr[iarr++]=this[i];
        else {
            res[ires++]=this[i];
            if(item&&ires==delLen){
                arr[iarr++]=item;
            }
        } 
    }
    if(item&&ires<delLen) arr[iarr]=item; 

    for(var i=0;i<arr.length;i++){
        this[i]=arr[i];
    }
    this.length=arr.length;
    return res;
}


if (!Array.prototype.concat)
Array.prototype.concat = function(){
    var i=0;
    while(i<arguments.length){
        if(typeof arguments[i] === 'object'&&typeof arguments[i].splice ==='function' &&!arguments[i].propertyIsEnumerable('length')){
            // NOT SHALLOW COPY BELOW
            // Array.prototype.concat.apply(this,arguments[i++]);
            var j=0;
            while(j<arguments[i].length) this.splice(this.length,0,arguments[i][j++]);
            i++;
        } else{
            this[this.length]=arguments[i++];
        }
    }
    return this;
}

if (!Array.prototype.join)
Array.prototype.join = function(separator){
    var i=0,str="";
    while(i<this.length) str+=this[i++]+separator;
    return str;
}

if (!Array.prototype.pop)
Array.prototype.pop = function () { return this.splice(this.length - 1, 1)[0]; }

if (!Array.prototype.push)
Array.prototype.push = function(){ 
    Array.prototype.splice.apply(this,
     [this.length,0].concat(Array.prototype.slice.apply(arguments))); //这里没有直接处理参数，而是复制了一下
    return this.length;
}

if (!Array.prototype.reverse)
Array.prototype.reverse = function(){
    for(var i=0;i<this.length/2;i++){
        var temp = this[i];
        this[i]= this[this.length-1-i];
        this[this.length-1-i] = temp;
    }
    return this;
}

if (!Array.prototype.slice)
Array.prototype.slice = function(start, end){
    var len =this.length;
    start=start<0?start+=len:start?start:0;
    end =end<0?end+=len:end>len?len:end?end:len;

    var i=start;
    var res = [];
    while(i<end){
        res.push(this[i++]);
    }
    return res; 
}

if (!Array.prototype.unshift)
Array.prototype.unshift =function(){
    Array.prototype.splice.apply(this,[0,0].concat(Array.prototype.slice.apply(this,arguments)));
}

if (!Array.prototype.shift)
Array.prototype.shift = function () { if (!this) return []; return this.splice(0, 1)[0]; }

