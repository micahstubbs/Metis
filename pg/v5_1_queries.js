var conn = require('./conn.js');
var queries = require('./queries.js');
var resp = require('./response.js');
var util = require('./util.js');

var overviewQuery = "select r.id, \
                     xtv_state.value as state_name, \
                     xtv_type.value as election_type, \
                     xtv_date.value as election_date \
                     from results r \
                     left join xml_tree_values xtv_state on xtv_state.results_id = r.id \
                                           and xtv_state.simple_path = 'VipObject.State.Name' \
                     left join xml_tree_values xtv_type on xtv_type.results_id = r.id \
                                           and xtv_type.path ~ 'VipObject.*.Election.*.ElectionType.*.Text.0' \
                     left join xml_tree_values xtv_date on xtv_date.results_id = r.id \
                                           and xtv_date.simple_path = 'VipObject.Election.Date' \
                     where r.public_id = $1;";

var totalErrorsQuery = "select (select count(v.*) \
                                from xml_tree_validations v \
                                where r.id = v.results_id \
                                  and v.severity in ('fatal', 'critical', 'errors')) as total_errors, \
                               (select count(v.*) \
                                from xml_tree_validations v \
                                where r.id = v.results_id \
                                  and v.severity = 'warnings') as total_warnings \
                        from results r where r.public_id = $1;"

var errorSummary = "SELECT DISTINCT ON (v.severity, v.scope, v.error_type) \
                    COUNT(1), v.severity, v.scope, v.error_type, (array_agg(v.path))[1] AS path, (array_agg(v.error_data))[1] AS error_data \
                    FROM xml_tree_validations v \
                    INNER JOIN results r ON r.id = v.results_id \
                    WHERE r.public_id = $1 \
                    GROUP BY v.severity, v.scope, v.error_type;"

var errorResponder = function(query, params) {
  return util.simpleQueryResponder(query, util.paramExtractor(params));
};

var overallErrorQuery = function(scope) {
    return buildErrorQuery("", "subpath(xtv.path, 2, 1) = '" + scope  +"'");
};

var buildErrorQuery = function(joins, wheres) {
  var wherePart = "";
  if (wheres) {
    wherePart = "AND " + wheres;
  }

  return "SELECT DISTINCT ON (xtv.severity, xtv.scope, xtv.error_type) \
                 COUNT(1), xtv.severity, xtv.scope, xtv.error_type, \
                 (array_agg(xtv.path))[1] AS path, \
                 (array_agg(xtv.error_data))[1] AS error_data \
          FROM xml_tree_validations xtv \
          INNER JOIN results r ON r.id = xtv.results_id " +
         joins +
         " WHERE r.public_id = $1 " + wherePart +
         " GROUP BY xtv.severity, xtv.scope, xtv.error_type";
};


var overviewTableRow = function(row, type, dbTable, link) {
  return {element_type: type,
          count: row[dbTable + '_count'],
          complete_pct: row[dbTable + '_completion'],
          error_count: row[dbTable + '_errors'],
          link: link};
};

var getFeedOverviewSummaryData = function(req, res) {
  var feedid = req.params.feedid;
  conn.query(function(client) {
    client.query("SELECT s.* FROM v5_statistics s \
                  INNER JOIN results r ON s.results_id = r.id \
                  WHERE r.public_id=$1",
                 [decodeURIComponent(feedid)],
                 function(err, result) {
                     var row = result.rows[0];
                     if (row !== undefined){
                         var summaries = {
                           pollingLocations: [
                             overviewTableRow(row, 'Street Segments', 'street_segment', '#/5.1/feeds/' + feedid + '/overview/street_segments/errors'),
                             overviewTableRow(row, 'State', 'state', '#/5.1/feeds/' + feedid + '/overview/state/errors'),
                             overviewTableRow(row, 'Precincts', 'precinct', '#/5.1/feeds/' + feedid + '/overview/precincts/errors'),
                             overviewTableRow(row, 'Polling Location', 'polling_location', '#/5.1/feeds/' + feedid + '/overview/polling_locations/errors'),
                             overviewTableRow(row, 'Localities', 'locality', '#/5.1/feeds/' + feedid + '/overview/localities/errors'),
                             overviewTableRow(row, 'Hours Open', 'hours_open', '#/5.1/feeds/' + feedid + '/overview/hours_open/errors')
                           ],
                           voterResources: [
                             overviewTableRow(row, 'Election Administration', 'election_administration', '#/5.1/feeds/' + feedid + '/overview/election_administeations/errors'),
                             overviewTableRow(row, 'Departments', 'department', '#/5.1/feeds/' + feedid + '/overview/departments/errors'),
                             overviewTableRow(row, 'Voter Services', 'voter_service', '#/5.1/feeds/' + feedid + '/overview/voter_service/errors'),
                           ],
                           contests: [
                             overviewTableRow(row, 'Candidate Contests', 'candidate_contest', '#/5.1/feeds/' + feedid + '/overview/candidate_contests/errors'),
                             overviewTableRow(row, 'Candidate Selections', 'candidate_selection', '#/5.1/feeds/' + feedid + '/overview/candidate_selection/errors'),
                             overviewTableRow(row, 'Ballot Measure Contests', 'ballot_measure_contest', '#/5.1/feeds/' + feedid + '/overview/ballot_measure_contests/errors'),
                             overviewTableRow(row, 'Ballot Selections', 'ballot_selection', '#/5.1/feeds/' + feedid + '/overview/ballot_selections/errors'),
                             overviewTableRow(row, 'Retention Contests', 'retention_contest', '#/5.1/feeds/' + feedid + '/overview/retention_contests/errors'),
                             overviewTableRow(row, 'Party Contests', 'party_contest', '#/5.1/feeds/' + feedid + '/overview/party_contests/errors'),
                             overviewTableRow(row, 'Electoral Districts', 'electoral_district', '#/5.1/feeds/' + feedid + '/overview/electoral_districts/errors'),
                             overviewTableRow(row, 'Candidates', 'candidate', '#/5.1/feeds/' + feedid + '/overview/candidates/errors'),
                             overviewTableRow(row, 'Offices', 'office', '#/5.1/feeds/' + feedid + '/overview/offices/errors'),
                           ],
                           sourceElection: [
                             overviewTableRow(row, 'Source', 'source', '#/5.1/feeds/' + feedid + '/overview/source/errors'),
                             overviewTableRow(row, 'Election', 'election', '#/5.1/feeds/' + feedid + '/overview/election/errors'),
                           ]
                         };
                       resp.writeResponse(summaries, res);
                     }
                 });
  });
};

module.exports = {
  errorSummary: util.simpleQueryResponder(errorSummary, util.paramExtractor()),
  feedOverview: util.simpleQueryResponder(overviewQuery, util.paramExtractor()),
  feedOverviewSummaryData: getFeedOverviewSummaryData,
  totalErrors: util.simpleQueryResponder(totalErrorsQuery, util.paramExtractor()),
  overviewErrors: function(scope) { return errorResponder(overallErrorQuery(scope)); }
}