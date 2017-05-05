app.module("events", function(modules, name) {
    // grab module(s)
    var $$ = modules.$$,
        core = modules.core,
        utils = modules.utils,
        globals = modules.globals;
    // get needed functions/data
    var last_open_popup = globals.last_open_popup;
    var which_animation_event = utils.which_animation_event,
        to_real_array = utils.to_real_array,
        create_path = utils.create_path;
    var footer = $$.footer, menu_popup = $$.menu_popup;
    var hide_last_open_popup = core.hide_last_open_popup,
        show_contact_nav = core.show_contact_nav,
        parse_delegation_data = core.parse_delegation_data,
        reset_navigation = core.reset_navigation,
        show_aboutme_section = core.show_aboutme_section,
        show_works_section = core.show_works_section,
        show_resume = core.show_resume,
        highlight_tab = core.highlight_tab;

    // local module vars
    var delegation_actions = {
        /**
         * @description [Resets the navigation tabs.]
         * @param  {EventTargetElement} target [Browser provided clicked target element.]
         * @return {Undefined}  [Nothing is returned.]
         */
        nav_tab_reset: function(target) {
            // reset the navigation
            reset_navigation();
            // highlight clicked nav-item
            target.classList.add("nav-current");
            // show the contact element tab if need be
            show_contact_nav();
        },
        /**
         * @description [Shows the about me section.]
         * @param  {EventTargetElement} target [Browser provided clicked target element.]
         * @return {Undefined}  [Nothing is returned.]
         */
        nav_home: function(target) {
            show_aboutme_section();
        },
        /**
         * @description [Shows the works section.]
         * @param  {EventTargetElement} target [Browser provided clicked target element.]
         * @return {Undefined}  [Nothing is returned.]
         */
        nav_works: function(target) {
            show_works_section();
        },
        /**
         * @description [Shows the works section.]
         * @param  {EventTargetElement} target [Browser provided clicked target element.]
         * @return {Undefined}  [Nothing is returned.]
         */
        nav_resume: function(target) {
            show_resume();
        },
        /**
         * @description [Scrolls down to the footer and highlights it.]
         * @param  {EventTargetElement} target [Browser provided clicked target element.]
         * @return {Undefined}  [Nothing is returned.]
         */
        nav_contact: function(target) {
            //remove the footer animated class
            footer.classList.remove("footer-animate");
            // [source::credit](http://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page)
            // [source::api](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
            footer.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
            footer.classList.add("footer-animate");
        },
        /**
         * @description [Shows hamburger menu popup menu.]
         * @param  {EventTargetElement} target [Browser provided clicked target element.]
         * @return {Undefined}  [Nothing is returned.]
         */
        hamburger_menu: function(target) {
            // cancel action if the original target is a popup-item
            // "this" refers to the original_target element
            if (this.classList.contains("popup-item")) return;
            // show the menu
            menu_popup.classList.remove("hidden");
        },
        /**
         * @description [Stores the currently opened popup.]
         * @param  {EventTargetElement} target [Browser provided clicked target element.]
         * @return {Undefined}  [Nothing is returned.]
         */
        cache_popup: function(target) {
            // set the menu popup as the last popup
            modules["globals"]["last_open_popup"] = menu_popup;
        },
        /**
         * @description [Shows the about me section when the home nav-item is clicked. Hides the works section.]
         * @param  {EventTargetElement} target [Browser provided clicked target element.]
         * @return {Undefined}  [Nothing is returned.]
         */
        nav_popup_home: function(target) {
            show_aboutme_section();
            // reset the navigation
            reset_navigation();
            // highlight the current tab
            highlight_tab(this);
            // show the contact element tab if need be
            show_contact_nav();
            hide_last_open_popup();
        },
        /**
         * @description [Shows the works when the home nav-item is clicked. Hides the about me section.]
         * @param  {EventTargetElement} target [Browser provided clicked target element.]
         * @return {Undefined}  [Nothing is returned.]
         */
        nav_popup_works: function(target) {
            show_works_section();
            // reset the navigation
            reset_navigation();
            // highlight the current tab
            highlight_tab(this);
            // show the contact element tab if need be
            show_contact_nav();
            hide_last_open_popup();
        },
        /**
         * @description [Scrolls down to the footer and highlights it. Invoking the "nav_contact" delegation action function.]
         * @param  {EventTargetElement} target [Browser provided clicked target element.]
         * @return {Undefined}  [Nothing is returned.]
         */
        nav_popup_contact: function(target) {
            delegation_actions.nav_contact.apply(
                null,
                to_real_array(arguments)
            );
        }
    };

    // Single app click event handler. (Uses delegation.)
    document.addEventListener("click", function(e) {
        // hide the last open popup
        hide_last_open_popup();
        // get the original target
        var original_target = e.target;
        // get the target path
        var element_path = create_path(e);
        // **NOTE: use raw loops to break out if needed
        // loop through the element path (target element parents)...
        for (var i = 0, l = element_path.length; i < l; i++) {
            // cache the current target element
            var target = element_path[i];
            // get the delegation data
            var delegation_data = parse_delegation_data(target),
                actions = delegation_data.actions;
            // loop through + runs actions if povided
            for (var j = 0, ll = actions.length; j < ll; j++) {
                // cache the current action call
                var action = delegation_actions[actions[j].trim()];
                // if the action call exists invoke it
                if (action) action.call(original_target, target);
            }
            // check whether to prevent browser's default action
            if (delegation_data.preventDefault) e.preventDefault();
            // check wether we need to stop bubbling
            if (delegation_data.stop) return;
        }
    });

    // // when window loses focus hide any open popups
    // window.addEventListener("blur", function(e) {
    //     // hide the last open popup
    //     hide_last_open_popup();
    // });

    // show the contact tab when the BODY's vertical scrollbar is displayed
    window.addEventListener("resize", function(e) {
        show_contact_nav();
        // hide_last_open_popup();
    });

    // // hide the popup menu when the orientation changes
    // window.addEventListener("orientationchange", function(e) {
    //     // hide the last open popup
    //     hide_last_open_popup();
    // });

    // listen to when the footer transition ends to remove the animation class
    document.addEventListener(which_animation_event(), function() {
        // remove the animation class
        footer.classList.remove("footer-animate");
    });
});
