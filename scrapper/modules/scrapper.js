const request = require('request-promise');
const url = require('url');
const urlRegex = require('url-regex');

const sleep = require('../../common_modules/sleep')();

/**
 * Get links from url
 */
async function getLinks(href, parser) {
  const html = await request.get(href);
  const resultLinks = parser(html);
  return resultLinks
    .filter(link => !/mailto:/.test(link) && !/javascript:/.test(link) && !/\.xml$/.test(link));
}

module.exports = function(config, parser, databaseClient) {
  const { urls, delay, limit } = config;

  return async function() {
    try {
      for (let currentUrl of urls) {
        const linkList = [ currentUrl ];
        const parsed = url.parse(currentUrl);
        const rootUrl = `${parsed.protocol}//${parsed.host}`;
        const hostRe = new RegExp(parsed.host.replace(/^www./, ''), 'i');

        // Loop until face limit or no more links to visit
        for (let i = 0; linkList.length < limit; i++) {

          const urlToVisit = linkList[i];
          if (!urlToVisit) break;

          await sleep(delay);
          const newLinks = await getLinks(urlToVisit, parser);

          for (let link of newLinks) {
            const parsedLink = url.parse(link);
            let res;

            // Relative link
            if (!parsedLink.host || parsedLink.host === 'blank') {
              res = `${rootUrl}${link[0] === '/' ? link : '/' + link}`;
            } else if(hostRe.test(link)) {
              res = link;
            }

            // Get rid of hashes
            if (res) res = res.replace(parsedLink.hash,'');

            if (res && linkList.indexOf(res) === -1 && urlRegex({exact: true}).test(res)) {
              linkList.push(res);
              await databaseClient.queuePush(encodeURIComponent(res));
            }

            if (linkList.length > limit) break;
          }
        }
      }
    } catch(e) {
      console.error(e);
    }
  };
};