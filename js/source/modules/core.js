app.module("core", function(modules, name) {
    // grab module(s)
    var $$ = modules.$$, utils = modules.utils, globals = modules.globals;
    // get needed functions/data
    var nav_contact = $$.nav_contact,
        nav_popup_contact = $$.nav_popup_contact,
        shortnames_elements = $$.shortnames_elements,
        aboutme_section = $$.aboutme_section,
        works_section = $$.works_section,
        projects_wrapper = $$.projects_wrapper,
        attribution = $$["emojione-attribution-wrapper"],
        is_vertical_scrollbar_visible = utils.is_vertical_scrollbar_visible,
        to_real_array = utils.to_real_array,
        format = utils.format;

    /**
     * @description [Shows the contact tab. Depends on the is_vertical_scrollbar_visible() function.]
     * @return {Undefined}  [Nothing is returned.]
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
     * @description [Resets the main navigation tabs. It removes the nav-current class.]
     * @return {Undefined}  [Nothing is returned.]
     */
    function reset_navigation() {
        // reset active nav-item
        to_real_array(
            document.getElementsByClassName("nav-item")
        ).forEach(function(nav_item) {
            nav_item.classList.remove("nav-current");
        });
    }

    /**
     * @description [Turns emoticons strings into emoticon image elements.]
     * @return {Undefined}  [Nothing is returned.]
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
     * @description [Hides the currently/last opened popup.]
     * @return {Undefined}  [Nothing is returned.]
     */
    function hide_last_open_popup() {
        var last_open_popup = modules.globals.last_open_popup;
        if (last_open_popup) last_open_popup.classList.add("hidden");
    }

    /**
     * @description [Shows the about me section wile hides the works section.]
     * @return {Undefined}  [Nothing is returned.]
     */
    function show_aboutme_section() {
        // hide the about me section
        aboutme_section.classList.remove("hidden");
        // show the projects section
        works_section.classList.add("hidden");
    }

    /**
     * @description [Shows the works wile hides the about me section.]
     * @return {Undefined}  [Nothing is returned.]
     */
    function show_works_section() {
        // hide the about me section
        aboutme_section.classList.add("hidden");
        // show the projects section
        works_section.classList.remove("hidden");
    }

    /**
     * @description [Open a new tab linking to the resume page.]
     * @return {Undefined}  [Nothing is returned.]
     */
    function show_resume() {
        // open a new tab to the resume page
        window.open("https://cgabriel5.github.io/resume/");
    }

    /**
     * @description [Show the emoji attribution.]
     * @return {Undefined} [Nothing is returned.]
     */
    function show_attribution() {
        // hide the element.
        attribution.classList.add("hidden");
        // show the element.
        setTimeout(function() {
            attribution.classList.remove("hidden");
        }, 0);
    }

    /**
     * @description [Parse provided delegation data.]
     * @param {EventTargetElement} target [Browser provided clicked target element.]
     * @return {Object}  [Returns an object containing its actions and or bubbling.]
     */
    function parse_delegation_data(target) {
        // get the delegation data
        var delegation_data = target.getAttribute("data-delegation");
        // if no delegation data is provided return default object
        if (!delegation_data) {
            return {
                actions: [],
                stop: false,
                preventDefault: false
            };
        }
        var parts = delegation_data.trim().split(";");
        var actions = parts[0].trim().split(",");
        // remove the actions
        parts.shift();
        return {
            actions: actions,
            stop: Boolean(-~parts.indexOf("stop")),
            preventDefault: Boolean(-~parts.indexOf("pd"))
        };
    }

    /**
     * @description [Adds the nav-current class to the clicked element tab.]
     * @param  {HTMLElement} target_element [The target element that was clicked on.]
     * @return {Undefined}  [Nothing is returned.]
     */
    function highlight_tab(target_element) {
        // highlight clicked nav-item
        document
            .getElementById(target_element.getAttribute("data-syncid"))
            .classList.add("nav-current");
    }

    /**
     * @description [Builds the HTML languages for each project.]
     * @param  {Array} langs [The list of languages used for the project.]
     * @return {String}       [The created HTML string.]
     */
    function build_lang_html(langs) {
        // grab template + colors
        var template = globals.templates.language, colors = globals.colors;
        // define vars
        var parts = [], lang, color;
        // loop over all the langs
        for (var i = 0, l = langs.length; i < l; i++) {
            // cache the current language
            lang = langs[i];
            // lookup the lang info
            color = colors[lang];
            // create the HTML string + add the HTML string to the parts array
            parts.push(format(template, { color: color, lang: lang }));
        }
        return parts.join("");
    }

    /**
     * @description [Builds the projects using the globals.projects array and then injects them into the page.]
     * @return {Undefined}  [Nothing is returned.]
     */
    function build_projects() {
        // get the projects
        var projects = globals.projects, template = globals.templates.project;
        var parts = [], project, langs, lang_html;
        // loop over each project
        for (var i = 0, l = projects.length; i < l; i++) {
            // cache the current project
            project = projects[i];
            // get the project languages
            langs = project.langs;
            // build the language HTML
            lang_html = build_lang_html(langs);
            // add the HTML to the project object, overriding the langs prop
            project.langs = lang_html;
            // create the HTML string + add the string to the parts array
            parts.push(format(template, project));
        }
        // inject the fragment into the DOM
        projects_wrapper.innerHTML = parts.join("");
    }

    // export to access in other modules
    this[name].show_contact_nav = show_contact_nav;
    this[name].reset_navigation = reset_navigation;
    this[name].shortnames_2_emoticons = shortnames_2_emoticons;
    this[name].hide_last_open_popup = hide_last_open_popup;
    this[name].show_aboutme_section = show_aboutme_section;
    this[name].show_works_section = show_works_section;
    this[name].show_resume = show_resume;
    this[name].show_attribution = show_attribution;
    this[name].parse_delegation_data = parse_delegation_data;
    this[name].highlight_tab = highlight_tab;
    this[name].build_projects = build_projects;
});
