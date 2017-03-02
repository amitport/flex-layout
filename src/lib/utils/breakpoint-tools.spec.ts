/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {TestBed, inject} from '@angular/core/testing';

import {BreakPoint} from '../media-query/breakpoints/break-point';
import {DEFAULT_BREAKPOINTS} from '../media-query/breakpoints/data/break-points';
import {BREAKPOINTS} from '../media-query/breakpoints/break-points-token';
import {BreakPointsProvider} from '../media-query/breakpoints/break-points-provider';
import {ORIENTATION_BREAKPOINTS} from '../media-query/breakpoints/data/orientation-break-points';
import {validateSuffixes, mergeByAlias} from './breakpoint-tools';

describe('breakpoint-tools', () => {

  describe('validation', () => {
    it('should not replace an existing suffix', () => {
      let validated = validateSuffixes([
        {alias: 'handset-portrait', suffix: 'Handset', mediaQuery: 'screen'}
      ]);
      expect(validated[0].suffix).toEqual('Handset');
    });
    it('should add valid suffixes to breakpoints', () => {
      let validated = validateSuffixes([
        {alias: 'xs', mediaQuery: 'screen and (max-width: 599px)'},
        {alias: 'gt-lg', mediaQuery: 'screen and (max-width: 599px)'},
        {alias: 'gt_md', mediaQuery: 'screen and (max-width: 599px)'},
        {alias: 'gt.xs', mediaQuery: 'screen and (max-width: 599px)'},
        {alias: 'handset-portrait', mediaQuery: 'screen and (max-width: 599px)'}
      ]);
      expect(validated[0].suffix).toEqual('Xs');
      expect(validated[1].suffix).toEqual('GtLg');
      expect(validated[2].suffix).toEqual('GtMd');
      expect(validated[3].suffix).toEqual('GtXs');
      expect(validated[4].suffix).toEqual('HandsetPortrait');
    });
    it('should auto-validate the DEFAULT_BREAKPOINTS', () => {
      let list: BreakPoint[] = validateSuffixes(DEFAULT_BREAKPOINTS);
      let xsBp: BreakPoint = list[0];
      let gtLgBp: BreakPoint = list[list.length - 2];
      let xlBp: BreakPoint = list[list.length - 1];

      expect(xsBp.alias).toEqual('xs');
      expect(xsBp.suffix).toEqual('Xs');

      expect(gtLgBp.alias).toEqual('gt-lg');
      expect(gtLgBp.suffix).toEqual('GtLg');

      expect(xlBp.alias).toEqual('xl');
      expect(xlBp.suffix).toEqual('Xl');
    });
  });

  describe('merges', () => {
    it('should add custom breakpoints with empty defaults', () => {
      let defaults = [], custom = [
        {alias: 'sm', mediaQuery: 'screen'},
        {alias: 'md', mediaQuery: 'screen'},
      ];
      let all = mergeByAlias(defaults, custom);

      expect(all.length).toEqual(2);
      expect(all[0].suffix).toEqual('Sm');
      expect(all[1].suffix).toEqual('Md');
    });
    it('should add custom breakpoints with unique aliases', () => {
      let defaults = [
        {alias: 'xs', mediaQuery: 'screen and (max-width: 599px)'}
      ], custom = [
        {alias: 'sm', mediaQuery: 'screen'},
        {alias: 'md', mediaQuery: 'screen'},
      ];
      let all = mergeByAlias(defaults, custom);

      expect(all.length).toEqual(3);
      expect(all[0].suffix).toEqual('Xs');
      expect(all[1].suffix).toEqual('Sm');
      expect(all[2].suffix).toEqual('Md');
    });
    it('should overwrite existing breakpoints with matching aliases', () => {
      let defaults = [{alias: 'xs', mediaQuery: 'screen and (max-width: 599px)'}];
      let custom = [{alias: 'xs', mediaQuery: 'screen and none'}];
      let all = mergeByAlias(defaults, custom);

      expect(all.length).toEqual(1);
      expect(all[0].suffix).toEqual('Xs');
      expect(all[0].mediaQuery).toEqual('screen and none');
    });
  });

  describe('with BreakPointsProvider', () => {
    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [
          BreakPointsProvider          // Supports developer overrides of list of known breakpoints
        ]
      });
    });

    it('should inject the BREAKPOINTS with auto-validate items', inject([BREAKPOINTS], (list) => {
      let offset = ORIENTATION_BREAKPOINTS.length;    // Since these are registered first
      let xsBp: BreakPoint = list[offset + 0];
      let gtLgBp: BreakPoint = list[offset + 7];
      let xlBp: BreakPoint = list[offset + 8];

      expect(xsBp.alias).toEqual('xs');
      expect(xsBp.suffix).toEqual('Xs');

      expect(gtLgBp.alias).toEqual('gt-lg');
      expect(gtLgBp.suffix).toEqual('GtLg');

      expect(xlBp.alias).toEqual('xl');
      expect(xlBp.suffix).toEqual('Xl');
    }));
  });

});
