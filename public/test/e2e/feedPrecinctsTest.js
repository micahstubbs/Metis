describe('Feed Precincts Test', function () {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  /* ----------------------------------------
   Feed State page
   ------------------------------------------*/
  describe('Check Feed Precincts page', function () {

    xit('Should go to the Feed Precincts page after selecting a feed and then Election and then State and then a Locality and then a Precinct and then the 2nd to last breadcrumb', function () {

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

      // should have a link back to the election page in the breadcrumbs
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      element('#pageHeader-breadcrumb1').click();

      // should be on the feed election page

      // should have a state link
      expect(element('#state-id a').count()).toBe(1);

      // click the state link
      element('#state-id a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state page
      expect(element('#feed-state-content').count()).toBe(1);

      // should have a locality link
      expect(element('#locality-id0 a').count()).toBe(1);

      // click the locality link
      element('#locality-id0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed locality page
      expect(element('#feed-locality-content').count()).toBe(1);

      // should have a precinct link
      expect(element('#precinct-id0 a').count()).toBe(1);

      // click the precinct link
      element('#precinct-id0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed precinct page
      expect(element('#feed-precinct-content').count()).toBe(1);

      // click the precincts link
      expect(element('#pageHeader-breadcrumb5 a').html()).toBe("Precincts");
      element('#pageHeader-breadcrumb5 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed precincts page
      expect(element('#feed-precincts-content').count()).toBe(1);

    });

  });

  /* ----------------------------------------
   Feed Precincts data
   ------------------------------------------*/
  describe('Check Feed Precincts data', function () {

    xit('Should have Precincts data', function () {

      expect(element('#precinct0').count()).toBe(1);
      expect(element('#precinct-id0').count()).toBe(1);
    });
  });

  /* ----------------------------------------
   Log Out
   ------------------------------------------*/
  describe('Logging out', function () {
    // Signs out of the application
    it('Sign out of the app', function () {
      e2eLogOut();
    });
  });
});
