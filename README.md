This package creates a simple dataset to aid analysis of BigQuery usage logs.

To set up BigQuery audit data logging, follow the instructions [here](https://dataform.co/blog/exporting-bigquery-usage-logs).

## Supported warehouses

- BigQuery

## Installation

Add the package to your `package.json` file in your Dataform project. You can find the most up to package version on the [releases page](https://github.com/dataform-co/dataform-bq-audit-logs/releases).

## Configure the package

Create a new JS file in your `definitions/` folder and create the segment tables with the following example:

```js
const bigQueryLogs = require("dataform-bigquery-logs");

const bigQueryLogsModels = bigQueryLogs({
  logsSchema: "stackdriver_logs",
  defaultConfig: {
    tags: ["bq_audit_logs"],
    type: "view"
  },
});
```

For more advanced uses cases, see the [example.js](https://github.com/dataform-co/dataform-bq-audit-logs/blob/master/definitions/example.js).

## Data models

This output of this package is the following data model (configurable as tables or views).

### `bigquery_compute_logs`

One row for every query log sent from BigQuery to stackdriver. The schema of this table is significantly simplified as compared to the raw logs table!

<img src="https://assets.dataform.co/docs/packages/bq-audit-logs/bq-audit-logs-dag.png" />
