var _ = require('underscore');

const params =
    [
        {
            "pid":"1000",
            "type":"fetus",
            "data_available":"brain_volume",
            "scan":"01",
            "time":"28.5"
        },
        {
            "pid":"1000",
            "type":"fetus",
            "data_available":"brain_volume",
            "scan":"02",
            "time":"35"
        },
        {
            "pid":"1000",
            "type":"neonatal",
            "data_available":"brain_volume",
            "scan":"02",
            "time":"18"
        },
        {
            "pid":"1001",
            "type":"fetus",
            "data_available":"brain_volume",
            "scan":"01",
            "time":"28.5"
        },
        {
            "pid":"1001",
            "type":"fetus",
            "data_available":"brain_volume",
            "scan":"02",
            "time":"35"
        },
        {
            "pid":"1001",
            "type":"neonatal",
            "data_available":"brain_volume",
            "scan":"02",
            "time":"18"
        }
        ]
export default params;

var reducedArray = _.chain(params).map(function(item) { return item.pid }).uniq().value();

reducedArray.map((item) => {
    var encounters = (_.filter(params, (res) => {
        return res.pid === item
    }))

})