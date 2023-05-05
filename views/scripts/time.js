function updateClock() {
    var now = new Date();
    var dy = now.getDay(),
        mth = now.getMonth(),
        dt = now.getDate(),
        yr = now.getFullYear(),
        hr = now.getHours(),
        min = now.getMinutes(),
        sec = now.getSeconds(),
        pd = "AM";
        
        if(hr == 0) {
            hr = 12;
        }
        if(hr > 12) {
            hr -= 12;
            pd = "PM";
        }

        Number.prototype.pad = function(digits) {
            for(var n = this.toString(); n.length < digits; n = 0 + n);
            return n;
        }

        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var ids = ["day", "month", "date", "year", "hour", "minute", "second", "period"];
        var values = [day[dy], month[mth], dt.pad(2), yr, hr.pad(2), min.pad(2), sec.pad(2), pd];
        for(var i = 0; i < ids.length; i++)
        document.getElementById(ids[i]).firstChild.nodeValue = values[i]
}

function initClock() {
    updateClock();
    window.setInterval("updateClock()", 1);
}