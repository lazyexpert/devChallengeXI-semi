const diff = require('diff');
const sanitizer = require('sanitizer');

function sortPages(pageA, pageB) {
  if (pageA.createdAt < pageB.createdAt) {
    return {
      first: pageA,
      second: pageB
    };
  } else {
    return {
      first: pageB,
      second: pageA
    };
  }
}

module.exports = function() {
  return function(type, pageA, pageB) {
    const sorted = sortPages(pageA, pageB);
    const difference = diff.diffSentences(sorted.first.html, sorted.second.html);

    if (type === 'json') return difference;
    else {
      return difference.map(part => {
        const color = part.added ? 'green' :
                                    part.removed ? 'red' : 'grey';

        return `<span style='color:${color}'>${sanitizer.escape(part.value)}</span>`;
      }).join('<br />');
    }
  };
};