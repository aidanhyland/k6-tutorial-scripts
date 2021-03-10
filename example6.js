import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Gauge } from "k6/metrics";

export let CounterErrors = new Counter("errors");
// export let GaugeContentSize = new Gauge("contentSize");

export let options = {
    stages: [
        { duration: "2s", target: 10 },
        { duration: "2s", target: 10 },
        { duration: "2s", target: 0 },
    ],
    thresholds: {
        // 90% of requests must finish within 500ms, 95% within 500, and 99.9% within 190ms.
        http_req_duration: ["p(90) < 500", "p(95) < 550", "p(99.9) < 1000"],
        // ContentSize: ["value<4000"],
        Errors: ["count<100"],
        checks: ["rate>0.9"],
    },
};

export default function() {
    let res = http.get("https://jsonplaceholder.typicode.com/posts/1");
    let contentOK = check(res, {
        "jsonplaceholder status was 200": (r) => r.status == 200,
        "jsonplaceholder response includes userId": (r) =>
            r.body.includes("userI"),
    });

    // GaugeContentSize.add(res.body.length);
    CounterErrors.add(!contentOK);

    sleep(1);
}

//k6 run example6.js