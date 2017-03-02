/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {OpaqueToken} from '@angular/core';  // tslint:disable-line:no-unused-variable
import {mergeByAlias, validateSuffixes} from '../../utils/breakpoint-tools';

import {BreakPoint} from './break-point';
import {BREAKPOINTS} from './break-points-token';
import {DEFAULT_BREAKPOINTS} from './data/break-points';
import {ORIENTATION_BREAKPOINTS} from './data/orientation-break-points';


/**
 * Add new custom items to the default list or override existing default with custom overrides
 */
export function _mergedBreakPointFactory(_custom?: BreakPoint[], excludeDefaults = false) {
  return () => {
    // Order so the defaults are loaded last; so ObservableMedia will report these last!
    let defaults = ORIENTATION_BREAKPOINTS.concat(DEFAULT_BREAKPOINTS);
    return excludeDefaults ? mergeByAlias(_custom) : mergeByAlias(defaults, _custom || []);
  };
}

/**
 * Build and validate all default breakpoints
 */
export function _mergedDefaults() {
  let defaults = ORIENTATION_BREAKPOINTS.concat(DEFAULT_BREAKPOINTS);
  return validateSuffixes(defaults);
}

/**
 * Default Provider that does not support external customization
 * but includes BOTH the defaults and the extended "handset", "tablet", and "web"
 * breakpoints.
 *
 *  NOTE: !! breakpoints are considered to have unique 'alias' properties,
 *        custom breakpoints matching existing breakpoints will override the properties
 *        of the existing (and not be added as an extra breakpoint entry).
 *        [xs, gt-xs, sm, gt-sm, md, gt-md, lg, gt-lg, xl]
 */
export const BreakPointsProvider = { // tslint:disable-line:variable-name
  provide: BREAKPOINTS,
  useFactory: _mergedDefaults
};
/**
 * Use with FlexLayoutModule.provideCustomBreakPoints!
 */
export function provideCustomBreakPoints(_custom?: BreakPoint[], excludeDefaults = false) {
  return {
    provide: BREAKPOINTS,
    useFactory: _mergedBreakPointFactory(_custom, excludeDefaults)
  };
}
