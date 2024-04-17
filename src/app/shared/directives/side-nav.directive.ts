import { Directive, AfterViewChecked } from '@angular/core';
declare var $: any; // JQuery

@Directive({
    selector: '[sideNav]'
})
export class SideNavDirective implements AfterViewChecked {

    
    ngAfterViewChecked() {
        $('.side-nav .side-nav-inner .side-nav-menu:not(.ant-menu-inline-collapsed) li a').click(function(event) {
            if ($(this).parent().hasClass("open")) {

				$(this).parent().children('.dropdown-menu').slideUp(200, ()=> {
					$(this).parent().removeClass("open");
				});

			} else {
				$(this).parent().parent().children('li.open').children('.dropdown-menu').slideUp(100);
				$(this).parent().parent().children('li.open').children('a').removeClass('open');
				$(this).parent().parent().children('li.open').removeClass("open");
				$(this).parent().children('.dropdown-menu').slideDown(200, ()=> {
					$(this).parent().addClass("open");
				});
			}
        });
        
    }
}