/**
 * Created by rcartier13 on 1/29/14.
 */

describe('Testing Feed Referendum Page', function() {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  describe('Referendum Page is able to be navigated to', function() {
    xit('Navigates to Referendum', function() {
      // expect to start out on the feed index page
      // click the first feed
      element('#date0 a').click();
      sleep(testGlobals.sleepTime);

      /*
       expect(element('#election-link').count()).toBe(1);

       // click the election link
       element('#election-link').click();
       sleep(testGlobals.sleepTime);
       */

      expect(element('#sidebar-contests').count()).toBe(1);

      // click the contests link
      element('#sidebar-contests').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed election page
      expect(element('#feed-contests-content').count()).toBe(1);

      element('#contests-id0 a').click();
      expect(element('#feed-contest-content').count()).toBe(1);

      element('#ballot-id a').click();
      expect(element('#feed-ballot-content').count()).toBe(1);

      element('#referendum-id0 a').click();

      // Make sure there is no error on the page
      expect(element('#pageHeader-alert')).not().toBeDefined();
      expect(element('#feed-referendum-content').count()).toBe(1);
    });

    xit('Has Content', function() {
      expect(element('#referendum-title').count()).toBe(1);
      expect(element('#response-id0').count()).toBe(1);
    });
  });

  describe('Error page link works', function() {
    xit('Error link works', function() {
      element('#referendum-errors').click();
      expect(element('#feeds-election-contests-ballot-referenda-errors-content').count()).toBe(1);
    })
  })

//  describe('Checks if errors are thrown', function() {
//    it('Navigates to Referendum', function() {
//      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/ballot/referenda/1referendum");
//      expect(element('#pageHeader-alert').html()).toBeDefined();
//    });
//  });

  describe('Logs Out', function() {
    it('Logs out', function() {
      e2eLogOut();
    });
  });
});


describe('Testing Feed Referenda Page', function() {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  describe('Referenda Page is able to be navigated to', function() {
    xit('Navigates to Referenda', function() {
      // expect to start out on the feed index page
      // click the first feed
      element('#date0 a').click();
      sleep(testGlobals.sleepTime);

      /*
       expect(element('#election-link').count()).toBe(1);

       // click the election link
       element('#election-link').click();
       sleep(testGlobals.sleepTime);
       */

      expect(element('#sidebar-contests').count()).toBe(1);

      // click the contests link
      element('#sidebar-contests').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed contests page
      expect(element('#feed-contests-content').count()).toBe(1);

      element('#contests-id0 a').click();
      expect(element('#feed-contest-content').count()).toBe(1);

      element('#ballot-id a').click();
      expect(element('#feed-ballot-content').count()).toBe(1);

      element('#referendum-id0 a').click();
      expect(element('#feed-referendum-content').count()).toBe(1);

      element('#pageHeader-breadcrumb5 a').click();

      // Make sure there is no error on the page
      expect(element('#pageHeader-alert')).not().toBeDefined();
      expect(element('#feed-referenda-content').count()).toBe(1);
      expect(element('#referenda-id0').count()).toBe(1);
    });
  });

//  describe('Checks if errors are thrown', function() {
//    it('Navigates to Referenda', function() {
//      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/ballot/referenda");
//      expect(element('#pageHeader-alert').html()).toBeDefined();
//    });
//  });

  describe('Logs Out', function() {
    it('Logs out', function() {
      e2eLogOut();
    });
  });
});
