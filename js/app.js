document.onreadystatechange = function() {

    "use strict";

    /* [functions.utils] */

    /**
     * @description [turns provided object into a true array.]
     * @param  {Array-Like-Object} array_like_object [the object to turn into an array]
     * @return {Array}                               [a true array]
     * @source (http://stackoverflow.com/questions/960866/how-can-i-convert-the-arguments-object-to-an-array-in-javascript)
     */
    function to_real_array(array_like_object) {
        return Array.prototype.slice.call(array_like_object);
    }

    /**
     * @description [determines which event the users...
     * ...browser supports and returns it.]
     * @return {String} [the browser dependant event to listen to]
     * @source (https://davidwalsh.name/css-animation-callback, From Modernizr)
     */
    function which_animation_event() {
        var t;
        var el = document.createElement("div");
        var transitions = {
            "animation": "animationend",
            "OAnimation": "oAnimationEnd",
            "MozAnimation": "animationend",
            "WebkitAnimation": "webkitAnimationEnd"
        };
        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    /**
     * @description [creates the path (target elements parents).]
     * @param  {EventObject} event   [the browsers EventObject]
     * @return {Array}       parents [the created path array containing...
     *                                ...the target elements parents elements]
     */
    function create_path(event) {
        // cache the target element
        var element = event.target;
        // there must be a target element...else return empty path
        if (!event.target) return [];
        // start building path
        var parents = [element];
        while (element) {
            element = element.parentNode;
            if (element) parents.push(element);
        }
        // remove the document from the array
        parents.pop();
        // finally return the path!
        return parents;
    }

    /* [functions.app] */

    /**
     * @description [checks whether the documents vertical scrollbar is visible.]
     * @return {Boolean}
     * @source (http://stackoverflow.com/questions/2146874/detect-if-a-page-has-a-vertical-scrollbar)
     */
    function is_vertical_scrollbar_visible() {
        return (document.body.clientHeight > window.innerHeight);
    }

    /**
     * @description [show the contact tab. depends on the...
     * ...is_vertical_scrollbar_visible() function.]
     * @return {None}
     */
    function show_contact_nav() {
        if (is_vertical_scrollbar_visible()) {
            nav_contact.classList.remove("hidden");
            nav_popup_contact.classList.remove("hidden");
        } else {
            nav_contact.classList.add("hidden");
            nav_popup_contact.classList.add("hidden");
        }
    }

    /**
     * @description [resets the main navigation tabs. it removes...
     * ...the nav-current class.]
     * @return {None}
     */
    function reset_navigation() {
        // reset active nav-item
        to_real_array(document.getElementsByClassName("nav-item"))
            .forEach(function(nav_item) {
                nav_item.classList.remove("nav-current");
            });
    }

    /**
     * @description [turns emoticons strings into emoticon image elements.]
     * @return {None}
     */
    function shortnames_2_emoticons() {
        // loop through each shortname_element...
        shortnames_elements.forEach(function(element) {
            // get the shortname, this is the elements text
            var shortname = element.textContent;
            // convert the shortname to an image
            var emoticon = emojione.shortnameToImage(shortname);
            // embed the image back into the element
            element.innerHTML = emoticon.replace("//cdn", "https://cdn");
        });
    }

    /**
     * @description [hides the currently/last opened popup.]
     * @return {None}
     */
    function hide_last_open_popup() {
        if (last_open_popup) last_open_popup.classList.add("hidden");
    }

    /**
     * @description [shows the about me section wile hides the works section.]
     * @return {None}
     */
    function show_aboutme_section() {
        // hide the about me section
        aboutme_section.classList.remove("hidden");
        // show the projects section
        works_section.classList.add("hidden");
    }

    /**
     * @description [shows the works wile hides the about me section.]
     * @return {None}
     */
    function show_works_section() {
        // hide the about me section
        aboutme_section.classList.add("hidden");
        // show the projects section
        works_section.classList.remove("hidden");
    }

    /**
     * @description [parse the provided delegation data...
     * ...and returns an object containing its actions and or bubbling.]
     * @param {EventTargetElement} target [browser provided clicked...
     * ...target element]
     * @return {Object}
     */
    function parse_delegation_data(target) {
        // get the delegatiob data
        var delegation_data = target.getAttribute("data-delegation");
        // if no delegation data is provided return default object
        if (!delegation_data) {
            return {
                "actions": [],
                "stop": false
            };
        }
        var parts = delegation_data.trim().split(";");
        var actions = parts[0].trim().split(",");
        var bubble = parts[1].trim();
        return {
            "actions": actions,
            "stop": (bubble ? true : false)
        };
    }

    /**
     * @description [adds the nav-current class to the clicked element tab]
     * @param  {HTMLElement} target_element [the target element that was clicked on]
     * @return {None}
     */
    function highlight_tab(target_element) {
        // highlight clicked nav-item
        document.getElementById(target_element.getAttribute("data-syncid"))
            .classList.add("nav-current");
    }

    // all resources have loaded
    if (document.readyState == "complete") {

        /* [cached.elements] */

        var shortnames_elements = to_real_array(document.getElementsByClassName("emoticon-shortname"));
        var nav_contact = document.getElementById("nav-contact");
        var nav_popup_contact = document.getElementById("nav-popup-contact");
        var footer = document.getElementsByClassName("footer-wrapper")[0];
        var aboutme_section = document.getElementById("section-aboutme-wrapper");
        var works_section = document.getElementById("section-works-wrapper");
        var menu_popup = document.getElementById("popup-menu-wrapper");
        var last_open_popup = null;

        /* [events.actions] */

        var delegation_actions = {
            /**
             * @description [resets the navigation tabs.]
             * @param  {EventTargetElement} target [browser provided clicked...
             * ...target element]
             * @return {None}
             */
            "nav_tab_reset": function(target) {
                // reset the navigation
                reset_navigation();
                // highlight clicked nav-item
                target.classList.add("nav-current");
                // show the contact element tab if need be
                show_contact_nav();
            },
            /**
             * @description [shows the about me section.]
             * @param  {EventTargetElement} target [browser provided clicked...
             * ...target element]
             * @return {None}
             */
            "nav_home": function(target) {
                show_aboutme_section();
            },
            /**
             * @description [shows the works section.]
             * @param  {EventTargetElement} target [browser provided clicked...
             * ...target element]
             * @return {None}
             */
            "nav_works": function(target) {
                show_works_section();
            },
            /**
             * @description [scrolls down to the footer and highlights it.]
             * @param  {EventTargetElement} target [browser provided clicked...
             * ...target element]
             * @return {None}
             */
            "nav_contact": function(target) {
                //remove the footer animated class
                footer.classList.remove("footer-animate");
                // [source::credit](http://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page)
                // [source::api](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
                footer.scrollIntoView({
                    "behavior": "smooth",
                    "block": "end"
                });
                footer.classList.add("footer-animate");
            },
            /**
             * @description [shows hamburger menu popup menu.]
             * @param  {EventTargetElement} target [browser provided clicked...
             * ...target element]
             * @return {None}
             */
            "hamburger_menu": function(target) {
                // cancel action if the original target is a popup-item
                // "this" refers to the original_target element
                if (this.classList.contains("popup-item")) return;
                // show the menu
                menu_popup.classList.remove("hidden");
            },
            /**
             * @description [stores the currently opened popup.]
             * @param  {EventTargetElement} target [browser provided clicked...
             * ...target element]
             * @return {None}
             */
            "cache_popup": function(target) {
                last_open_popup = menu_popup;
            },
            /**
             * @description [shows the about me section when the home...
             * ...nav-item is clicked. Hides the works section.]
             * @param  {EventTargetElement} target [browser provided clicked...
             * ...target element]
             * @return {None}
             */
            "nav_popup_home": function(target) {
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
             * @description [shows the works when the home...
             * ...nav-item is clicked. Hides the about me section.]
             * @param  {EventTargetElement} target [browser provided clicked...
             * ...target element]
             * @return {None}
             */
            "nav_popup_works": function(target) {
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
             * @description [scrolls down to the footer and highlights...
             * ...it. Invoked the "nav_contact" delegation action function.]
             * @param  {EventTargetElement} target [browser provided clicked...
             * ...target element]
             * @return {None}
             */
            "nav_popup_contact": function(target) {
                delegation_actions.nav_contact.apply(null, to_real_array(arguments));
            }
        };

        /* [events.listeners] */

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
                // check wether we need to stop bubbling
                if (delegation_data.stop) return;
            }
        });

        // when window loses focus hide any open popups
        window.addEventListener("blur", function(e) {
            // hide the last open popup
            hide_last_open_popup();
        });

        // show the contact tab when the BODY's vertical...
        // ...scrollbar is displayed
        window.addEventListener("resize", function(e) {
            show_contact_nav();
        });

        // listen to when the footer transition ends...
        // ...to remove the animation class
        document.addEventListener(which_animation_event(), function() {
            // remove the animation class
            footer.classList.remove("footer-animate");
        });

        /* [app.ini] */

        // show the about me section on loaded page
        show_aboutme_section();

        // check if the contact element button should be displayed...
        // ...this is dependant on the presence of the BODY's vertical...
        // ...scrollbar
        show_contact_nav();

        // convert the emoticon shortnames to images :)
        shortnames_2_emoticons();

    }

};
