/**
 * Created by nboseman on 2/12/14.
 */

var mongoose = require('mongoose');
var ruleViolation = require('../ruleviolation');
var when = require('when');

var deferred = when.defer();
var errorCount = 0;
var constraints = null;
var rule = null;

var directionTypesList = ['n','s','e','w','nw','ne','sw','se','north','south','east','west','northeast','northwest','southeast','southwest'];

var evaluateAddressDirectionType = function(feedId, constraintSet, ruleDefinition){
  rule = ruleDefinition;
  constraints = constraintSet;
  var savePromises = [];
  var fieldStrings = [];

  for(var i=0; i< constraints.fields.length; i++){

    var field = constraints.fields[i];
    fieldStrings[i] = field.toString();

    errorList = null;
    Model = mongoose.model(constraintSet.entity[0]);
    upperCaseMap = directionTypesList.map(function(item, index){ return item.toUpperCase(); });
    mixedCaseDirections = upperCaseMap.concat(directionTypesList);

    var conditions = {};
    conditions['_feed'] = feedId;
    conditions[fieldStrings[i]] = { $exists: true, $nin: mixedCaseDirections };

    var fields = {};
    fields['_feed'] = 1;
    fields['elementId'] = 1;
    fields[fieldStrings[i]] = 1;

    savePromises.push(Model.find(conditions, fields).exec());

    //formatReturnFields(constraintSet[1])
    //savePromises.push(Model.find({ 'nonHouseAddress.addressDirection': { $exists: true, $nin: mixedCaseDirections }}, {'_feed':1, 'elementId':1, 'nonHouseAddress.addressDirection':1}).exec());
  }

  var errorPromises = [];

  when.all(savePromises).then(
    function(addressSegmentResult){

      addressSegmentResult.forEach(function(addressSegmentResultSetArray, index){

        addressSegmentResultSetArray.forEach(function(addressSegmentResultSet){

          var fieldPath = fieldStrings[index].split(".");
          var resultSet= addressSegmentResultSet;
          for(var i=0; i< fieldPath.length; i++){
            var path = (fieldPath[i]).toString();
            resultSet = resultSet[path];
          }

          errorPromises.push(createError(addressSegmentResultSet, fieldStrings[index] + " = " + resultSet));
        });

      });
      when.all(errorPromises).then( function(emptyPromises){  deferred.resolve({ promisedErrorCount: errorCount }) });
    }
  );
  return deferred.promise;
}

function createError(addressSegment, directionalError) {
  errorCount++;
  ruleErrors = new ruleViolation(constraints.entity[0], addressSegment.elementId, addressSegment._id, addressSegment._feed, directionalError, directionalError, rule);
  return ruleErrors.model().save();
}

var formatReturnFields = function (fields) {
  var queryFields = {};
  if(resultFields != null && resultFields.length > 0){
    for(i = 0; i < resultFields.length; i++)
      queryFields[resultFields[i]] = 1;
  }
  queryFields['elementId'] = 1;
  queryFields['_feed'] = 1;
  return queryFields;
}
exports.evaluate = evaluateAddressDirectionType;