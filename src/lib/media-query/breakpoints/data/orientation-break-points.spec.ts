/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {TestBed, inject, async} from '@angular/core/testing';

import {BreakPoint} from '../break-point';
import {DEFAULT_BREAKPOINTS} from './break-points';
import {ORIENTATION_BREAKPOINTS} from './orientation-break-points';
import {BREAKPOINTS} from '../break-points-token';
import {BreakPointsProvider, provideCustomBreakPoints} from '../break-points-provider';

describe('break-point-provider', () => {
  let breakPoints: BreakPoint[ ];

  describe('with default breakpoints only', () => {
    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [BreakPointsProvider]
      });
    });
    beforeEach(async(inject([BREAKPOINTS], (_breakPoints_) => {
      breakPoints = _breakPoints_;
    })));

    it('has the both standard default breakpoints + internal custom breakpoints', () => {
      const total = ORIENTATION_BREAKPOINTS.length + DEFAULT_BREAKPOINTS.length;
      const offset = ORIENTATION_BREAKPOINTS.length;  // since these are registered first
      expect(breakPoints.length).toEqual(total);
      expect(breakPoints[offset + 0].alias).toEqual('xs');
      expect(breakPoints[offset - 1].alias).toEqual('web.portrait');
    });
  });

  describe('with merged custom breakpoints', () => {
    let bpList;
    const EXTRAS: BreakPoint[] = [
      {alias: 'lt-ab', mediaQuery: '(max-width: 297px)'},
      {alias: 'cd', mediaQuery: '(min-width: 298px) and (max-width:414px)'}
    ];

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [provideCustomBreakPoints(EXTRAS)]
      });
    });
    // tslint:disable-next-line:no-shadowed-variable
    beforeEach(async(inject([BREAKPOINTS], (breakPoints) => {
      bpList = breakPoints;
    })));

    it('has the custom breakpoints', () => {
      const total = ORIENTATION_BREAKPOINTS.length + DEFAULT_BREAKPOINTS.length + EXTRAS.length;

      expect(bpList.length).toEqual(total);
      expect(bpList[total - 2].alias).toEqual('lt-ab');
      expect(bpList[total - 2].suffix).toEqual('LtAb');
      expect(bpList[total - 1].alias).toEqual('cd');
      expect(bpList[total - 1].suffix).toEqual('Cd');
    });
  });

  describe('with custom breakpoint overrides', () => {
    const gtXsMediaQuery = 'screen and (max-width:20px) and (orientation: landscape)';
    const mdMediaQuery = 'print and (min-width:10000px)';
    const gtXsIndex = ORIENTATION_BREAKPOINTS.length + 1;   // offset to the gt-xs breakpoint
    const mdIndex = ORIENTATION_BREAKPOINTS.length + 4;     // offset to the md breakpoint
    const EXTRAS: BreakPoint[] = [
      {alias: 'md', mediaQuery: mdMediaQuery},
      {alias: 'gt-xs', mediaQuery: gtXsMediaQuery},
      {alias: 'lt-ab', mediaQuery: '(max-width: 297px)'},
      {alias: 'cd', mediaQuery: '(min-width: 298px) and (max-width:414px)'}
    ];
    const NUM_EXTRAS = 2;   // since md and gt-xs will not be added but merged
    let bpList;

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [provideCustomBreakPoints(EXTRAS)]
      });
    });
    // tslint:disable-next-line:no-shadowed-variable
    beforeEach(async(inject([BREAKPOINTS], (breakPoints) => {
      bpList = breakPoints;
    })));

    it('has merged the custom breakpoints as overrides to existing defaults', () => {
      const total = ORIENTATION_BREAKPOINTS.length + DEFAULT_BREAKPOINTS.length + NUM_EXTRAS;

      expect(bpList.length).toEqual(total);
      expect(bpList[gtXsIndex].alias).toEqual('gt-xs');
      expect(bpList[gtXsIndex].mediaQuery).toEqual(gtXsMediaQuery);

      expect(bpList[mdIndex].alias).toEqual('md');
      expect(bpList[mdIndex].mediaQuery).toEqual(mdMediaQuery);
    });

    it('can extend existing default breakpoints with custom settings', () => {
      const total = ORIENTATION_BREAKPOINTS.length + DEFAULT_BREAKPOINTS.length + NUM_EXTRAS;

      expect(bpList.length).toEqual(total);
      expect(bpList[total - 2].alias).toEqual('lt-ab');
      expect(bpList[total - 2].suffix).toEqual('LtAb');
      expect(bpList[total - 1].alias).toEqual('cd');
      expect(bpList[total - 1].suffix).toEqual('Cd');
    });
  });

  describe('with exclusive custom breakpoints', () => {
    let bpList;
    const EXTRAS: BreakPoint[] = [
      {alias: 'lt-ab', mediaQuery: '(max-width: 297px)'},
      {alias: 'cd', mediaQuery: '(min-width: 298px) and (max-width:414px)'}
    ];

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [provideCustomBreakPoints(EXTRAS, true)]
      });
    });
    // tslint:disable-next-line:no-shadowed-variable
    beforeEach(async(inject([BREAKPOINTS], (breakPoints) => {
      bpList = breakPoints;
    })));

    it('has the only the registered custom breakpoints; defaults are excluded.', () => {
      const total = EXTRAS.length;

      expect(bpList.length).toEqual(total);
      expect(bpList[total - 1].alias).toEqual('cd');
      expect(bpList[total - 1].suffix).toEqual('Cd');
      expect(bpList[total - 2].alias).toEqual('lt-ab');
      expect(bpList[total - 2].suffix).toEqual('LtAb');
    });
  });

});
