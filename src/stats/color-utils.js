'use strict'
class ColorUtils {
  static djb2(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash;
  }

  static hashStringToColor(str, a) {
    var hash = this.djb2(str);
    var r = (hash & 0xFF0000) >> 16;
    var g = (hash & 0x00FF00) >> 8;
    var b = hash & 0x0000FF;
    return "#" + ("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).
    substr(-2) + ("0" + b.toString(16)).substr(-2) + a.toString(16);
  }
}
export default ColorUtils;
