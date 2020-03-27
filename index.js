const bigQueryComputeLogs = require("./includes/bigquery_compute_logs");

module.exports = (params) => {

 params = {
    logsSchema: "javascript", // schema that Segment writes tables into
    ...params
  };

  const {
    defaultConfig,
    logsSchema
  } = params;
  
  // Declare the source segment tables.
  const logsRaw = declare({
    ...defaultConfig,
    schema: logsSchema,
    name: "cloudaudit_googleapis_com_data_access_*"
  });

  // Publish and return datasets.
  return {
    logsRaw,
    bigQueryComputeLogs: bigQueryComputeLogs(params),
  }
}
