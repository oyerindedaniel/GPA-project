module.exports.getyear = getyear;

function getyear() {
    var date = new Date();
    var year = date.getFullYear();
    return year;
}
