/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {ModuleWithProviders, NgModule} from '@angular/core';
import {MediaMonitor} from '../media-query/media-monitor';
import {MediaQueriesModule} from '../media-query/_module';

import {BreakPoint} from '../media-query/breakpoints/break-point';
import {
  provideCustomBreakPoints,
  BreakPointsProvider
} from '../media-query/breakpoints/break-points-provider';

import {FlexDirective} from './api/flex';
import {LayoutDirective} from './api/layout';
import {ShowHideDirective} from './api/show-hide';
import {FlexAlignDirective} from './api/flex-align';
import {FlexFillDirective} from './api/flex-fill';
import {FlexOffsetDirective} from './api/flex-offset';
import {FlexOrderDirective} from './api/flex-order';
import {LayoutAlignDirective} from './api/layout-align';
import {LayoutWrapDirective} from './api/layout-wrap';
import {LayoutGapDirective} from './api/layout-gap';
import {ClassDirective} from './api/class';
import {StyleDirective} from './api/style';

/**
 * Since the equivalent results are easily achieved with a css class attached to each
 * layout child, these have been deprecated and removed from the API.
 *
 *  import {LayoutPaddingDirective} from './api/layout-padding';
 *  import {LayoutMarginDirective} from './api/layout-margin';
 */

const ALL_DIRECTIVES = [
  LayoutDirective,
  LayoutWrapDirective,
  LayoutGapDirective,
  LayoutAlignDirective,
  FlexDirective,
  FlexOrderDirective,
  FlexOffsetDirective,
  FlexFillDirective,
  FlexAlignDirective,
  ShowHideDirective,
  ClassDirective,
  StyleDirective,
];

/**
 * @deprecated, use FlexLayoutModule.provideLayout instead!
 */
export function provideBreakPoints(_custom: BreakPoint[], excludeDefaults = false): any[] {
  return [
    MediaMonitor,
    provideCustomBreakPoints(_custom, excludeDefaults)
  ];
}

/**
 *
 */
@NgModule({
  declarations: ALL_DIRECTIVES,
  imports: [MediaQueriesModule],
  exports: [MediaQueriesModule, ...ALL_DIRECTIVES],
  providers: [
    MediaMonitor,
    BreakPointsProvider   // Extend defaults with internal custom breakpoints
  ]
})
export class FlexLayoutModule {
  /** External uses can easily add custom breakpoints */
  static provideBreakPoints(breakpoints: BreakPoint[],
                            excludeDefaults = false): ModuleWithProviders {
    return {
      ngModule: FlexLayoutModule,
      providers: provideBreakPoints(breakpoints, excludeDefaults)
    };
  }
}
