class Data {
    url: string
    name: string
    version: string

    constructor(url: string, name: string, version: string){
        this.url = url;
        this.name = name;
        this.version = version;
    }
}

type Datas = Array<Data>;

var datas: Datas = [
    new Data("url1", "name1", "version1"),
    new Data("url2", "name2", "version2"),
    new Data("url3", "name3", "version3")
]

let items = new Array();
datas.forEach ( function (value) {
    const item = JSON.stringify({
        url: value['url'],
        name: value['name'],
        version: value['version']
    })
    items.push(item);
});

console.log(JSON.stringify(items))
