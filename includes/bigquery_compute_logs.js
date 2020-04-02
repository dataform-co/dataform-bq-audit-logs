module.exports = (params) => {
  return publish("bigquery_compute_logs", {
    description: "BigQuery compute usage logs data, from the BigQuery logs export. Documentation for the BigQueryAuditMetadata message is here: https://cloud.google.com/bigquery/docs/reference/auditlogs/rest/Shared.Types/BigQueryAuditMetadata",
    columns: {
      principal_email: "authentican email used to run query. Could be a service account.",
      statement_type: "What type of query was it. Enum: https://cloud.google.com/bigquery/docs/reference/auditlogs/rest/Shared.Types/QueryStatementType",
      destination_table: "Full path of destination table, e.g. projects/tada-analytics/datasets/dataform_data_sources/tables/sessionized_records",
      query: "Full query string",
      billed_bytes: "Processed bytes, adjusted by the job's CPU usage."
    },
    ...params.defaultConfig
  }).query(ctx => `

with raw_data as (
select
  timestamp,
  protopayload_auditlog.authenticationInfo.principalEmail as principal_email,
  json_extract_scalar(
    protopayload_auditlog.metadataJson,
    "$.jobChange.job.jobConfig.queryConfig.statementType"
  ) as statement_type,
  json_extract_scalar(
    protopayload_auditlog.metadataJson,
    "$.jobChange.job.jobConfig.queryConfig.destinationTable"
  ) as destination_table,
  json_extract_scalar(
    protopayload_auditlog.metadataJson,
    "$.jobChange.job.jobConfig.queryConfig.query"
  ) as query,
  1.0 * cast(
    json_extract_scalar(
      protopayload_auditlog.metadataJson,
      "$.jobChange.job.jobStats.queryStats.totalBilledBytes"
    ) as int64
  ) billed_bytes
from
  ${ctx.ref(params.logsSchema, params.logsTableName)}
where
  resource.type = 'bigquery_project' -- compute (vs. 'bigquery_dataset' = storage)
)

select
  timestamp,
  principal_email,
  statement_type,
  destination_table as destination_table_raw,
    case
    when statement_type = 'SELECT' then "INTERACTIVE"
    else concat(
           split(substr(destination_table, length(CONCAT("projects/","${session.config.defaultDatabase}", "/datasets/"))+1), "/tables/")[safe_offset(0)],
           ".",
           split(substr(destination_table, length(CONCAT("projects/","${session.config.defaultDatabase}", "/datasets/"))+1), "/tables/")[safe_offset(1)]
    )
  end as destination_table_full,
  case
    when statement_type = 'SELECT' then "INTERACTIVE"
    else split(substr(destination_table, length(CONCAT("projects/","${session.config.defaultDatabase}", "/datasets/"))+1), "/tables/")[safe_offset(0)]
  end as destination_schema,
        case
    when statement_type = 'SELECT' then "INTERACTIVE"
    else split(substr(destination_table, length(CONCAT("projects/","${session.config.defaultDatabase}", "/datasets/"))+1), "/tables/")[safe_offset(1)]
  end as destination_table,
  query,
  billed_bytes,
  billed_bytes/1e12 as billed_terabytes,
  5.0*billed_bytes/1e12 as cost_usd
from
  raw_data

`)
}
