import {Component, OnInit, AfterViewInit, HostBinding, Input, ViewChild, ElementRef} from '@angular/core';
import {AnimationPlayer, AnimationBuilder, style, animate} from '@angular/animations';
import {Router, NavigationEnd, NavigationStart} from '@angular/router';

import {BehaviorSubject} from 'rxjs';
import * as objectPath from 'object-path';
import * as $ from 'jquery';

import {LayoutConfigService} from '../core/services/layout-config.service';
import {ClassInitService} from '../core/services/class-init.service';
import {LayoutRefService} from '../core/services/layout/layout-ref.service';
import {TranslationService} from '../core/services/translation.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {

  @HostBinding('class') classes = 'm-grid m-grid--hor m-grid--root m-page';
  @Input() selfLayout: any = 'blank';
  @Input() asideLeftDisplay: any;
  @Input() asideRightDisplay: any;
  @Input() asideLeftCloseClass: any;

  // @Input() Loader = false;
  Loader = false;

  public player: AnimationPlayer;

  // class for the header container
  pageBodyClass$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @ViewChild('mContentWrapper') contenWrapper: ElementRef;
  @ViewChild('mContent') mContent: ElementRef;

  constructor(
      private el: ElementRef,
      private configService: LayoutConfigService,
      public classInitService: ClassInitService,
      private router: Router,
      private layoutRefService: LayoutRefService,
      private animationBuilder: AnimationBuilder,
      private translationService: TranslationService,
  ) {
    this.configService.onLayoutConfigUpdated$.subscribe(model => {
      const config = model.config;

      let pageBodyClass = '';
      this.selfLayout = objectPath.get(config, 'self.layout');
      if (this.selfLayout === 'boxed' || this.selfLayout === 'wide') {
        pageBodyClass += ' m-container m-container--responsive m-container--xxl m-page__container';
      }
      this.pageBodyClass$.next(pageBodyClass);

      this.asideLeftDisplay = objectPath.get(config, 'aside.left.display');

      this.asideRightDisplay = objectPath.get(config, 'aside.right.display');
    });

    this.classInitService.onClassesUpdated$.subscribe((classes) => {
      this.asideLeftCloseClass = objectPath.get(classes, 'aside_left_close');
    });

    // animate page load
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.contenWrapper) {
          // hide content
          this.contenWrapper.nativeElement.style.display = 'none';
        }
      }
      if (event instanceof NavigationEnd) {
        if (this.contenWrapper) {
          // show content back
          this.contenWrapper.nativeElement.style.display = '';
          // animate the content
          this.animate(this.contenWrapper.nativeElement);
        }
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.mContent) {
        // keep content element in the service
        this.layoutRefService.addElement('content', this.mContent.nativeElement);
      }
    });
  }

  /**
   * Animate page load
   */
  animate(element) {
    this.player = this.animationBuilder
        .build([
          style({ opacity: 0, transform: 'translateY(15px)' }),
          animate('500ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
          style({ transform: 'none' }),
        ])
        .create(element);
    this.player.play();
  }

}
