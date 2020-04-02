const bigQueryComputeLogs = require("./includes/bigquery_compute_logs");

module.exports = (params) => {

 params = {
    logsSchema: null, // schema that the audit logs are written into
    logsTableName: 'cloudaudit_googleapis_com_data_access*', // schema that the audit logs are written into
    ...params
  };

  const {
    defaultConfig,
    logsSchema,
    logsTableName
  } = params;
  
  // Declare the source table
  const logsRaw = declare({
    ...defaultConfig,
    schema: logsSchema,
    name: logsTableName
  });

  // Publish and return datasets.
  return {
    logsRaw,
    bigQueryComputeLogs: bigQueryComputeLogs(params),
  }
}
