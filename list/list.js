var Data = /** @class */ (function () {
    function Data(url, name, version) {
        this.url = url;
        this.name = name;
        this.version = version;
    }
    return Data;
}());
var datas = [
    new Data("url1", "name1", "version1"),
    new Data("url2", "name2", "version2"),
    new Data("url3", "name3", "version3")
];
var items = new Array();
datas.forEach(function (value) {
    var item = JSON.stringify({
        url: value['url'],
        name: value['name'],
        version: value['version']
    });
    items.push(item);
});
console.log(JSON.stringify(items));
