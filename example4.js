import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
    stages: [
        { duration: "2s", target: 20 },
        { duration: "2s", target: 10 },
        { duration: "2s", target: 0 },
    ],
};

export default function() {
    let res1 = http.get("https://httpbin.org/");
    check(res1, { "status was 200": (r) => r.status == 200 });
    sleep(1);

    let res2 = http.get("http://test.k6.io");
    check(res2, { "status was 200": (r) => r.status == 200 });
    sleep(1);
}

//k6 run example4.js