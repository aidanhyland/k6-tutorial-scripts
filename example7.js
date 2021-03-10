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
    let res1 = http.get("https://jsonplaceholder.typicode.com/posts/1");
    check(res1, {
        "jsonplaceholder status was 200": (r) => r.status == 200,
        "jsonplaceholder response includes userId": (r) =>
            r.body.includes("userIduserId"),
    });

    sleep(1);
}

//k6 run example7.js
//k6 run --http-debug="full" example7.js