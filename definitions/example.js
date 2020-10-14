const bigQueryLogs = require("../");

const bigQueryLogsModels = bigQueryLogs({
  logsSchema: "stackdriver_logs",
  defaultConfig: {
    tags: ["bq_audit_logs"],
    type: "view"
  },
});

// Override the sessions and user table type to "table".
bigQueryLogsModels.bigQueryComputeLogs.type("table").config({
  bigquery: {
    partitionBy: "date(timestamp)"
  }
});