/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  Renderer,
  SimpleChanges,
} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';

export const LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];

/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
@Directive({selector: `
  [fxLayout],
  [fxLayout.xs],
  [fxLayout.gt-xs],
  [fxLayout.sm],
  [fxLayout.gt-sm],
  [fxLayout.md],
  [fxLayout.gt-md],
  [fxLayout.lg],
  [fxLayout.gt-lg],
  [fxLayout.xl]
`})
export class LayoutDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  /**
   * Create Observable for nested/child 'flex' directives. This allows
   * child flex directives to subscribe/listen for flexbox direction changes.
   */
  protected _announcer: BehaviorSubject<string>;

  /**
   * Publish observer to enabled nested, dependent directives to listen
   * to parent "layout" direction changes
   */
  public layout$: Observable<string>;

  @Input('fxLayout')       set layout(val)     { this._cacheInput("layout", val); };
  @Input('fxLayout.xs')    set layoutXs(val)   { this._cacheInput('layoutXs', val); };
  @Input('fxLayout.gt-xs') set layoutGtXs(val) { this._cacheInput('layoutGtXs', val); };
  @Input('fxLayout.sm')    set layoutSm(val)   { this._cacheInput('layoutSm', val); };
  @Input('fxLayout.gt-sm') set layoutGtSm(val) { this._cacheInput('layoutGtSm', val); };
  @Input('fxLayout.md')    set layoutMd(val)   { this._cacheInput('layoutMd', val); };
  @Input('fxLayout.gt-md') set layoutGtMd(val) { this._cacheInput('layoutGtMd', val); };
  @Input('fxLayout.lg')    set layoutLg(val)   { this._cacheInput('layoutLg', val); };
  @Input('fxLayout.gt-lg') set layoutGtLg(val) { this._cacheInput('layoutGtLg', val); };
  @Input('fxLayout.xl')    set layoutXl(val)   { this._cacheInput('layoutXl', val); };

  /**
   *
   */
  constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer) {
    super(monitor, elRef, renderer);
    this._announcer = new BehaviorSubject<string>("row");
    this.layout$ = this._announcer.asObservable();
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * On changes to any @Input properties...
   * Default to use the non-responsive Input value ('fxLayout')
   * Then conditionally override with the mq-activated Input's current value
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['layout'] != null || this._mqActivation) {
      this._updateWithDirection();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._listenForMediaQueryChanges('layout', 'row', (changes: MediaChange) => {
      this._updateWithDirection(changes.value);
    });
    this._updateWithDirection();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Validate the direction value and then update the host's inline flexbox styles
   */
  protected _updateWithDirection(value?: string) {
    value = value || this._queryInput("layout") || 'row';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }
    let [direction, wrap] = this._validateValue(value);

    // Update styles and announce to subscribers the *new* direction
    this._applyStyleToElement(this._buildCSS(direction, wrap));
    this._announcer.next(direction);
  }


  /**
   * Build the CSS that should be assigned to the element instance
   * BUG:
   *
   *   1) min-height on a column flex container won’t apply to its flex item children in IE 10-11.
   *      Use height instead if possible; height : <xxx>vh;
   *
   * @todo - update all child containers to have "box-sizing: border-box"
   *         This way any padding or border specified on the child elements are
   *         laid out and drawn inside that element's specified width and height.
   *
   */
  protected _buildCSS(direction, wrap = null) {
    return {
      'display': 'flex',
      'box-sizing': 'border-box',
      'flex-direction': direction,
      'flex-wrap': !!wrap ? wrap : null
    };
  }

  /**
   * Validate the value to be one of the acceptable value options
   * Use default fallback of "row"
   */
  protected _validateValue(value) {
    value = value ? value.toLowerCase() : '';
    let [ direction, wrap ] = value.split(" ");
    if (!LAYOUT_VALUES.find(x => x === direction)) {
      direction = LAYOUT_VALUES[0];
    }
    return [direction, this._validateWrapValue(wrap)];

  }

  /**
     * Convert layout-wrap="<value>" to expected flex-wrap style
     */
    protected _validateWrapValue(value) {
      if (!!value) {
        switch (value.toLowerCase()) {
          case 'reverse':
          case 'wrap-reverse':
          case 'reverse-wrap':
            value = 'wrap-reverse';
            break;

          case 'no':
          case 'none':
          case 'nowrap':
            value = 'nowrap';
            break;

          // All other values fallback to "wrap"
          default:
            value = 'wrap';
            break;
        }
      }
      return value;
    }
}
