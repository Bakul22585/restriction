import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as objectPath from 'object-path';
import * as $ from 'jquery';
import { MenuHorizontalOffcanvasDirective } from '../../../../core/directives/menu-horizontal-offcanvas.directive';
import { MenuHorizontalDirective } from '../../../../core/directives/menu-horizontal.directive';
import { MenuHorizontalService } from '../../../../core/services/layout/menu-horizontal.service';
import { MenuConfigService } from '../../../../core/services/menu-config.service';
import { ClassInitService } from '../../../../core/services/class-init.service';
import { LayoutUtilsUsersService } from '../../../../core/users/utils/layout-utils-users.service';
import { UsersService } from '../../../../core/users/services/users.service';

@Component({
	selector: 'm-menu-horizontal',
	templateUrl: './menu-horizontal.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuHorizontalComponent implements OnInit, AfterViewInit {
	@HostBinding('class') classes = '';
	@HostBinding('id') id = 'm_header_menu';

	@HostBinding('attr.mMenuHorizontalOffcanvas')
	mMenuHorOffcanvas: MenuHorizontalOffcanvasDirective;
	@HostBinding('attr.mMenuHorizontal')
	mMenuHorizontal: MenuHorizontalDirective;

	currentRouteUrl: any = '';
	activeItem: any;
	itemsWithAsides = [];
	Message = '';

	constructor(
		private el: ElementRef,
		public classInitService: ClassInitService,
		public menuHorService: MenuHorizontalService,
		private menuConfigService: MenuConfigService,
		private router: Router,
		private layoutUtilsService: LayoutUtilsUsersService,
		public userService: UsersService
	) {
		this.classes = this.menuHorService.menuClasses;
	}

	ngAfterViewInit(): void {
		Promise.resolve(null).then(() => {
			this.mMenuHorOffcanvas = new MenuHorizontalOffcanvasDirective(this.el);
			this.mMenuHorOffcanvas.ngAfterViewInit();

			this.mMenuHorizontal = new MenuHorizontalDirective(this.el);
			this.mMenuHorizontal.ngAfterViewInit();
		});
	}

	ngOnInit(): void {
		this.Message = '';
		this.currentRouteUrl = this.router.url;
		this.menuHorService.menuList$.subscribe(menuItems => this.fillAsides(menuItems));

		this.shouldOverrideAsides();

		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(event => {
				this.currentRouteUrl = this.router.url;
				this.shouldOverrideAsides();
			});
	}

	shouldOverrideAsides() {
		const aside = this.getActiveItemAside();
		if (aside) {
			// override aside menu as secondary menu of current header menu
			this.menuConfigService.configModel.config.aside = aside;
			this.menuConfigService.setModel(this.menuConfigService.configModel);
		}
	}

	fillAsides(menuItems) {
		for (const menuItem of menuItems) {
			if (menuItem.aside) {
				this.itemsWithAsides.push(menuItem);
			}

			if (menuItem.submenu && menuItem.submenu.items) {
				this.fillAsides(menuItem.submenu.items);
			}
		}
	}

	getActiveItemAside() {
		if (this.currentRouteUrl === '') {
			return null;
		}

		for (const item of this.itemsWithAsides) {
			if (item.page && item.page === this.currentRouteUrl) {
				return item.aside;
			}
		}
	}

	getItemCssClasses(item) {
		let cssClasses = 'm-menu__item';

		if (objectPath.get(item, 'submenu')) {
			cssClasses += ' m-menu__item--submenu';
		}

		if (objectPath.get(item, 'resizer')) {
			cssClasses += ' m-menu__item--resize';
		}

		if (
			(objectPath.get(item, 'root') &&
				objectPath.get(item, 'submenu.type') === 'classic') ||
			parseInt(objectPath.get(item, 'submenu.width'), 2) > 0
		) {
			cssClasses += ' m-menu__item--rel';
		}

		const customClass = objectPath.get(item, 'custom-class');
		if (customClass) {
			cssClasses += ' ' + customClass;
		}

		if (objectPath.get(item, 'icon-only')) {
			cssClasses += ' m-menu__item--icon-only';
		}

		if (item.submenu && this.isMenuItemIsActive(item)) {
			cssClasses += ' m-menu__item--active';
		}

		return cssClasses;
	}

	getItemAttrLinkRedirect(menuItem): any {
		if (objectPath.get(menuItem, 'redirect')) {
			return '1';
		}

		return null;
	}

	getItemAttrResizeDesktopBreakpoint(menuItem) {
		if (objectPath.get(menuItem, 'resizer')) {
			return objectPath.get(menuItem, 'resize-breakpoint');
		}

		return null;
	}

	getItemAttrSubmenuToggle(menuItem) {
		let attrSubmenuToggle = 'hover';
		if (objectPath.get(menuItem, 'toggle') === 'click') {
			attrSubmenuToggle = 'click';
		} else if (objectPath.get(menuItem, 'submenu.type') === 'tabs') {
			attrSubmenuToggle = 'tabs';
		} else {
			// submenu toggle default to 'hover'
		}

		return attrSubmenuToggle;
	}

	getItemAttrSubmenuMode(menuItem) {
		return null;
	}

	getItemMenuSubmenuClass(menuItem) {
		let subClass = '';

		const subAlignment = objectPath.get(menuItem, 'submenu.alignment');
		if (subAlignment) {
			subClass += ' m-menu__submenu--' + subAlignment;
		}

		if (objectPath.get(menuItem, 'submenu.type') === 'classic') {
			subClass += ' m-menu__submenu--classic';
		}

		if (objectPath.get(menuItem, 'submenu.type') === 'tabs') {
			subClass += ' m-menu__submenu--tabs';
		}

		if (objectPath.get(menuItem, 'submenu.type') === 'mega') {
			if (objectPath.get(menuItem, 'submenu.width')) {
				subClass += ' m-menu__submenu--fixed';
			}
		}

		if (objectPath.get(menuItem, 'submenu.pull')) {
			subClass += ' m-menu__submenu--pull';
		}

		return subClass;
	}

	isMenuItemIsActive(item): boolean {
		if (item.submenu) {
			return this.isMenuRootItemIsActive(item);
		}

		if (!item.page) {
			return false;
		}

		return item.page === this.currentRouteUrl;
	}

	isMenuRootItemIsActive(item): boolean {
		if (item.submenu.items) {
			for (const subItem of item.submenu.items) {
				if (this.isMenuItemIsActive(subItem)) {
					return true;
				}
			}
		}

		return false;
	}

	EmptyMessage() {
		this.Message = '';
	}

	SendMessage() {
		if (this.Message !== '') {
			const _title = 'Send messages to all user';
			const _description = 'Are you sure to confirm send messages to all users?';
			const _waitDesciption = 'Sending messages...';
			const dialogRef = this.layoutUtilsService.confirmElement(_title, _description, _waitDesciption);
			dialogRef.afterClosed().subscribe(confirm => {
				if (confirm === true) {
					$('body').css({ 'overflow': 'hidden' });
					$('#mainloader').removeAttr('style');
					this.userService.SendAllUserMessage(this.Message).subscribe(res => {
						this.layoutUtilsService.showActionNotification(res['message'], 0);
						$('#mainloader').css({ 'display': 'none' });
						$('body').removeAttr('style');
					});
				}
			});
		} else {
			this.layoutUtilsService.showActionNotification('Please enter message', 0);
		}
	}
}
