/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */

'use strict';
// This is a basic test file for use with testling.
// The test script language comes from tape.
const test = require('tape');

const webdriver = require('selenium-webdriver');
const seleniumHelpers = require('webrtc-utilities').seleniumLib;

test('PeerConnection pc1 sample', t => {
  const driver = seleniumHelpers.buildDriver();

  driver.get(`${process.env.BASEURL ? process.env.BASEURL :
    (`file://${process.cwd()}`)}/src/content/peerconnection/pc1/index.html`)
  .then(() => {
    t.pass('page loaded');
    return driver.findElement(webdriver.By.id('startButton')).click();
  })
  .then(() => {
    t.pass('got media');
    return driver.findElement(webdriver.By.id('callButton')).click();
  })
  .then(() => driver.wait(() => driver.executeScript(
      'return pc2 && pc2.iceConnectionState === \'connected\';'), 30 * 1000))
  .then(() => {
    t.pass('pc2 ICE connected');
    return driver.findElement(webdriver.By.id('hangupButton')).click();
  })
  .then(() => driver.wait(() => driver.executeScript('return pc1 === null'), 30 * 1000))
  .then(() => {
    t.pass('hangup');
    t.end();
  })
  .then(null, err => {
    t.fail(err);
    t.end();
  });
});
