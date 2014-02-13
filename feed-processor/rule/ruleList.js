
/*
 define rule using the below format:
 { name : '<rule_name>', condition : <rule_evaluation_function>, description: <rule_description> }
 */

var constraints = require('./dataconstraints');

var metisRuleList = [

  {
    title: 'validUrl',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    errorCode: 1,
    severityCode: 0,
    severityText: 'Metis url elements cannot be malformed',
    implementation: './impl/validUrlRule',
    dataConstraints: constraints['validUrl']
  },
  {
    title: 'localityTypes',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    errorCode: 2,
    severityCode: 0,
    severityText: 'Street Segments must be valid and cannot have overlap',
    implementation: './impl/streetSegmentRule',
    dataConstraints: constraints['uniqueStreetSegment']
  },
  {
    title: 'uniqueIdCheckToo',
    type: 'feedLevelRule',
    isFeedLevelRule: true,
    errorCode: 3,
    severityCode: 1,
    severityText: 'All top-level metis elements must have a unique ID value',
    implementation: './impl/uniqueIdToo',
    dataConstraints: constraints['uniqueIdCheck']
  },
  {
    title: 'uniqueStreetSegment',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    errorCode: 4,
    severityCode: 1,
    severityText: 'Street Segments must be valid and cannot have overlap',
    implementation: './impl/streetSegmentRule',
    dataConstraints: constraints['uniqueStreetSegment']
  },/*
  {
    title: 'localityTypeRuleToo',
    type: 'feedLevelRule',
    isFeedLevelRule: true,
    errorCode: 4,
    severityCode: 2,
    severityText: 'Invalid locality type',
    implementation: './impl/localityTypes',
    acceptableValues: [
      'county',
      'city',
      'town',
      'township',
      'borough',
      'parish',
      'village',
      'region'
    ],
    dataConstraints: constraints['localityType']
  }
  /*,
  {
    title: 'uniqueIdCheck',
    type: 'objectLevelRule',
    errorCode: 3,
    severityCode: 1,
    severityText: 'All top-level metis elements must have a unique ID value',
    implementation: './impl/uniqueId',
    dataConstraints: constraints['uniqueIdCheck']
  }*/
];

module.exports = metisRuleList;
