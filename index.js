const URL = require("url");
const find = require("puppeteer-find");


function install(Puppeteer = require('puppeteer-extensible')) {
  return Puppeteer.install(extensions);
}


const extensions = {
  Page: {
    prototype: {
      find: find.find,
      findWhere: find.findWhere,
      clickAndWait(...args) {
        return this.click(...args).then(() => this.waitForNavigation());
      },
      location() {
        return URL.parse(this.url());
      },
      gotoPath(path) {
        return this.goto(URL.resolve(this.url(), path));
      },
      $contentOf(selector) {
        return this.evaluate(selector => {
          let elem = document.querySelector(selector);
          return elem && elem.textContent;
        }, selector);
      }
    }
  },
  JSHandle: {
    prototype: {
      getPropertyValue(prop) {
        return this.getProperty(prop).then(handle => handle.jsonValue());
      }
    }
  },
  ElementHandle: {
    prototype: {
      find(...args) {
        return this.executionContext().find(this, ...args);
      },
      findWhere(...args) {
        return this.executionContext().findWhere(this, ...args);
      }
    }
  },
  ExecutionContext: {
    prototype: {
      find: find.find,
      findWhere: find.findWhere
    }
  }
}

extensions.Page.clickLink = extensions.Page.clickAndWait;


module.exports = { install, extensions };