const fs = require("fs");
let json = require("../summary.json");

const forEach = (obj, callback) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (callback(key, obj[key])) {
                break;
            }
        }
    }
};

const replacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
};

const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, function(char) {
        return replacements[char];
    });
};

const generateJUnitXML = (data, options) => {
    var failures = 0;
    var cases = [];

    forEach(data.metrics, function(metricName, metric) {
        if (!metric.thresholds) {
            return;
        }
        forEach(metric.thresholds, function(thresholdName, threshold) {
            if (threshold.ok) {
                cases.push(
                    '<testcase name="' +
                    escapeHTML(metricName) +
                    " - " +
                    escapeHTML(thresholdName) +
                    '" />'
                );
            } else {
                failures++;
                cases.push(
                    '<testcase name="' +
                    escapeHTML(metricName) +
                    " - " +
                    escapeHTML(thresholdName) +
                    '"><failure message="failed" /></testcase>'
                );
            }
        });
    });

    let name =
        options && options.name ? escapeHTML(options.name) : "k6 thresholds";

    return (
        '<?xml version="1.0"?>\n<testsuites tests="' +
        cases.length +
        '" failures="' +
        failures +
        '">\n' +
        '<testsuite name="' +
        name +
        '" tests="' +
        cases.length +
        '" failures="' +
        failures +
        '">' +
        cases.join("\n") +
        "\n</testsuite >\n</testsuites >"
    );
};

const writeJunitFile = (data) => {
    console.log("Creating Junit file..");
    fs.writeFile("../junit1.xml", data, (err) => {
        if (err) throw err;
        console.log("Creating Junit file.. done!");
    });
};

const data = generateJUnitXML(json);
writeJunitFile(data);