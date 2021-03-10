import http from "k6/http";
import { sleep } from "k6";

export let options = {
    vus: 5,
    duration: "2s",
};

export default function() {
    http.get("http://test.k6.io");
    sleep(1);
}

// k6 run example2.js