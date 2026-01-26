import { http, HttpResponse } from "msw";

export default [
  http.post("/sign/prepare", () => {
    return HttpResponse.json({"hash":"JC9aeM9x+/KjVqCWhlx10LXreTRXg9jCU3V7obcMJz4=", "hashFunction":"SHA-256"});
  }),

  http.post("/sign/sign", () => {
    return HttpResponse.json({"name":"example-for-signing.asice", "contentType":"application/vnd.etsi.asic-e+zip", "contentBytes":null});
  }),
];
