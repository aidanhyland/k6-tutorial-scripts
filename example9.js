import { check, sleep } from "k6";
import { sendMetricsToMSTeams } from "./msTeamsHelper.js";
import http from "k6/http";
import {
    jUnit,
    textSummary,
} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const SETUP = "In setup Code";

export let options = {
    stages: [
        { duration: "1s", target: 20 },
        { duration: "1s", target: 10 },
        { duration: "1s", target: 0 },
    ],
    thresholds: {
        // 90% of requests must finish within 800ms, 95% within 9600, and 99.9% within 1000ms.
        http_req_duration: ["p(90) < 800", "p(95) < 960", "p(99.9) < 1000"],
        ContentSize: ["value<4000"],
        Errors: ["count<100"],
        checks: ["rate>0.9"],
    },
};

export const getStatusCode = () => {
    return 200;
};

export function setup() {
    let res = http.get("https://httpbin.org/get");
    console.log(SETUP);
    return { data: res.json() };
}

export default function(data) {
    let res = http.get("https://httpbin.org/");
    check(res, { "status was 200": (r) => r.status == getStatusCode() });
    sleep(1);

    console.log("In Test UV Code", JSON.stringify(data));
}

export function teardown(data) {
    console.log("In TearDown Code", JSON.stringify(data));
}

export function handleSummary(data) {
    console.log("Preparing the end-of-test summary...");
    // Send the results to some remote server or trigger a hook
    sendMetricsToMSTeams(data);
    return {
        stdout: textSummary(data, { indent: " ", enableColors: true }),
        "junit.xml": jUnit(data),
        "summary.json": JSON.stringify(data),
    };
}

// k6 run example9.js