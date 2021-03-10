import http from "k6/http";
import { sleep } from "k6";

export default function() {
    http.get("http://test.k6.io");
    sleep(1);
}



// k6 run example1.js
// k6 run --vus 5 --duration 5s example1.js
// cat example1.js | docker run -i loadimpact/k6 run -