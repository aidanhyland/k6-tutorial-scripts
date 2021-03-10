import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
    stages: [
        { duration: "10s", target: 5 },
        { duration: "2s", target: 5 },
        { duration: "2s", target: 5 },
        { duration: "30s", target: 100 },
        { duration: "2s", target: 10 },
        { duration: "2s", target: 0 },
    ],
};

export default function() {
    let res = http.get("https://httpbin.org/");
    check(res, { "status was 200": (r) => r.status == 200 });
    sleep(1);
}

//k6 run example3.js