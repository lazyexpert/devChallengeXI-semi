module.exports = function() {
  return function(html) {
    const re = /<a[^>]+href="([^"]+)"/gmi;
    const foundLinks = [];

    let match;

    while((match = re.exec(html)) !== null) {
      foundLinks.push(match[1]);
    }

    return foundLinks;
  };
};
