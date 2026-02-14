import _ from 'lodash';

import * as WebEid from '@web-eid/web-eid-library';

function component() {
  WebEid.status().then(status => {
    console.log(status);
  });

  const element = document.createElement("div");

  element.innerHTML = _.join(["Hello", "webpack"], " ");

  return element;
}

document.body.appendChild(component());

