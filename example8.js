import http from "k6/http";
import { check } from "k6";

export default function() {
    let requests = {
        "front page": "https://k6.io",
        "features page": {
            method: "GET",
            url: "https://k6.io/features",
            params: { headers: { "User-Agent": "k6" } },
        },
        "docs page": {
            method: "GET",
            url: "https://k6.io/docs/cloud",
            params: { headers: { "User-Agent": "k6" } },
        },
    };

    let responses = http.batch(requests);

    check(responses["front page"], {
        "front page status was 200": (res) => res.status === 200,
    });

    check(responses["features page"], {
        "features page status was 200": (res) => res.status === 200,
    });

    check(responses["docs page"], {
        "docs page status was 200": (res) => res.status === 200,
    });
}
//k6 run example8.js