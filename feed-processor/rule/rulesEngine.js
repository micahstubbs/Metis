

var async = require('async');
var metisRuleHandler = require('./ruleHandler');
var ruleList = require('./rulelist');

var ruleHandler = new metisRuleHandler();
var rules = [];


function processRules(vipFeedId){
  console.log('initializing rules..');
  async.each(ruleList, loadRule, function(err){
    console.log(rules.length, 'Metis rules loaded and staged for analysis');
    applyRules(vipFeedId);
  });
}

var loadRule = function(ruleDef, next){
  console.log('loading rule..', ruleDef.title);
  if(isActiveRule(ruleDef))
    rules[rules.length] = ruleHandler.createRule(ruleDef);
  next();
}

var applyRules = function(vipFeedId){
  console.log(rules.length, 'Rules to apply');
  async.each(rules, function(rule){
    ruleHandler.applyRule(rule, vipFeedId, endSession);
  });
}

var endSession = function(){
  console.log("Data analysis complete. Rules processor shutting down");
  process.exit();
}


function isActiveRule(rule){
  var activeState = false
  try {
    activeState = JSON.parse(rule.isActive)
  }
  catch(err){ /* doNothing() */ }
  if(!activeState) console.log(rule.title, "is inactive");
  return activeState;
}

exports.processRules = processRules;
