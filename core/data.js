var Task = require("./task.js").Task;

module.exports.getHistogramData = function(results, options) {
  options = options || {};
  var i, j;
  var normalizedData = [];
  for (i = 0; i < results.length; i++) {
    var r = results[i].result;
    if (results.Error) {
      continue;
    }
    var times = r.timesPerPage;
    var baseline = r.baseline;
    if (!times) {
      continue;
    }
    for (j = 0; j < times.length; j++) {
      var t = times[j];
      if (typeof t == "number") {
        normalizedData.push(t / baseline);
      }
    };
  };

  normalizedData.sort();

  var numberOfBuckets = options.numberOfBuckets || 40;
  var maxValue = options.maxValue || 8;
  var step = maxValue / numberOfBuckets;

  var buckets = [];
  var data = [];
  j = 0;
  for (i = 0; i < numberOfBuckets; i++) {
    var count = 0;
    var smallerThan = (i + 1) * step;
    while (normalizedData[j] < smallerThan) {
      count++;
      j++;
    }
    buckets.push(smallerThan.toFixed(2));
    data.push(count);
  };
  buckets.push("'Larger'");
  data.push(normalizedData.length - j);

  return {
    "buckets": buckets,
    "data": data,
    "totalPages": normalizedData.length };
}
