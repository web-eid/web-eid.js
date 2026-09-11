import _ from "lodash";

import * as WebEid from "@web-eid/web-eid-library";

function component() {
  const element = document.createElement("div");
  element.innerHTML = _.join(["Web eID demo"], " ");

  WebEid.status().then(status => {
    element.innerHTML = _.join(
      ["Web eID status:", JSON.stringify(status)],
      " ",
    );
  });

  return element;
}

document.body.appendChild(component());
