/* global window document */
const loop = () => { };

export default class Spm {
  constructor(opts) {
    this.url = opts.url;

    this.params = opts.params;

    this.type = opts.type || 'GET';

    this.ok = opts.ok || loop();

    this.fail = opts.fail || loop();

    this.spmDom = []; // 埋点dom
  }

  init() {
    const metaa = document.querySelectorAll('meta[name=data-aspm]');

    const spama = metaa && metaa[0] && metaa[0].getAttribute('content');

    const spmb = document.body.getAttribute('data-spm');

    console.log(metaa, spama, spmb);

    this.spmDom = document.querySelectorAll('[data-spm-expc], [data-spm-click]');

    this.scroll();

    this.click();
  }

  click() {
    const self = this;
    this.spmDom.forEach((item) => {
      item.addEventListener('click', (e) => {
        if (e.target.getAttribute('data-spm-click') === '' || e.target.getAttribute('data-spm-click') === 'true') {
          const setData = {
            params: self.buildSpmParams(item.getAttribute('data-spm-params')),
          };
          this.fetch(setData);
        } else {
          return false;
        }
      });
    });
  }

  scroll() {
    const self = this;
    window.addEventListener('scroll', () => {
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

      const scrollBottom = scrollTop + window.innerHeight;

      self.spmDom.forEach((item) => {
        if (item.getAttribute('data-spm-expc')) {
          return false;
        }
        if (scrollTop < (item.offsetTop + item.clientHeight) && scrollBottom > item.offsetTop) {
          if (item.getAttribute('isspm') === 'true') {
            return false;
          }
          item.setAttribute('isspm', 'true');
          const setData = {
            params: self.buildSpmParams(item.getAttribute('data-spm-params')),
          };
          self.fetch(setData);
        }
      });
    });
  }

  buildSpmParams = (data) => {
    const obj = {};
    try {
      data.split('&').forEach((item) => {
        const pos = item.indexOf('=');
        if (pos === -1) {
          return false;
        }
        const key = item.substring(0, pos);
        const value = item.substring(pos + 1);
        obj[key] = value;
      });
    } catch (error) {
      console.log('data of null');
    }
    return obj;
  }

  fetch(opts) {
    const self = this;

    const params = Object.assign(opts, this.params);
    const xhr = new XMLHttpRequest();

    if (!this.url) {
      console.log('没有请求地址');
      return false;
    }

    try {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            self.ok(data);
          } else {
            self.fail(JSON.parse(xhr.responseText));
          }
        }
      };
    } catch (error) {
      console.log(error);
    }

    switch (this.type) {
      case 'GET':
      case 'get':
        console.log('get');
        break;
      case 'POST':
      case 'post':
        // const fromData = new fromData()
        // console.log(fromData)
        xhr.open('POST', this.url, false);
        xhr.send(JSON.stringify(params));
        break;

      default:
        console.log('get');
        break;
    }
  }
}
