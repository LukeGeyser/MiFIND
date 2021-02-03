const pad = num => (num > 9 ? "" : "0") + num;
const generator = (time, index) => {
  if (!time) return "access.log";

  var month = time.getFullYear() + "" + pad(time.getMonth() + 1);
  var day = pad(time.getDate());
  var hour = pad(time.getHours());
  var minute = pad(time.getMinutes());

  return `${month}/${month}${day}-${hour}${minute}-${index}-access.log`;
};

module.exports = {
    generator
};