import instance from '$PROJECT/${PAGE_PATH}';
import store from "$PROJECT/src/store/index.js";
let limitedVersion =  '${VERSION}';

const filter = require('$PROJECT/src/filter')["default"] || [];
let promise;
filter.forEach(e => {
  if (typeof e === 'function') {
    if (promise instanceof Promise) {
      promise = promise.then((value) => e.call(this, [value]))
    } else {
      promise = e.call(this, [promise])
    }
  }
})
Vue.prototype.$router = {
  history: {
    index: 0
  }
}
if (promise instanceof Promise) {
  promise.then(() => {
    initV();

  });
} else {
  initV();
}

function initV() {
  if(weex && weex.config.env.appVersionCode < limitedVersion){
    let page = weex.requireModule('PageApiModule');
    page.startPage('fs://app/upgrade',{title_name:'Upgrade'});
    page.finish();
    return;
  }
  instance.el = '#root';
  instance.store = store;
  new Vue(instance);
}
