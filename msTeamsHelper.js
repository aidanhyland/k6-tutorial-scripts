import http from "k6/http";

export const webhook =
    "https://fenergo.webhook.office.com/webhookb2/ee434341-fdaf-434b-870d-14edaebc2529@86eb5cdc-05d5-4952-b36d-bc110af1e2e5/TeamFoundationServer/585f1d085a954221aaaf7c8ad9ea7c6b/63275915-c43c-4c8d-bd3a-1b9cd232af41";

export const roundToTwo = (num) => {
    return Math.round(num * 100) / 100;
};

export const sendMetricsToMSTeams = (data) => {
    let dateNow = new Date().toISOString();
    console.log("Sending Data to Ms Teams...");
    const fails = data.metrics.checks.values.fails;
    const passes = data.metrics.checks.values.passes;
    const checkPassPercentage = `${100 - fails / passes}%`;
    const avg = data.metrics.http_req_duration.values.avg;
    const p90 = data.metrics.http_req_duration.values["p(90)"];
    const p95 = data.metrics.http_req_duration.values["p(95)"];

    const table =
        `<table style="width:100%">` +
        `<tr>` +
        `<th>Metric</th>` +
        `<th>Avg</th>` +
        `<th>P90</th>` +
        `<th>P95</th>` +
        `<th>Check Pass %</th>` +
        `</tr>` +
        `<tr>` +
        `<td>http_req_duration</td>` +
        `<td>${roundToTwo(avg)}</td>` +
        `<td>${roundToTwo(p90)}</td>` +
        `<td>${roundToTwo(p95)}</td>` +
        `<td>${checkPassPercentage}</td>` +
        `</tr>` +
        `</table>`;

    const card = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        themeColor: "0072C6",
        summary: "Summary description",
        sections: [{
            activityTitle: `Fenx Nebula Risk Performance Test Results ${dateNow}`,
            text: `${table}`,
        }, ],
    };

    const headers = {
        "content-type": "application/vnd.microsoft.teams.card.o365connector",
        "content-length": `${card.toString().length}`,
    };

    // Send the results to some remote server or trigger a hook
    let resp = http.post(webhook, JSON.stringify(card), { headers });
    if (resp.status != 200) {
        console.error("Could not send summary, got status " + resp.status);
    }
};