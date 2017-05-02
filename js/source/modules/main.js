app.module("main", function(modules, name) {
    // grab modules
    var core = modules.core, utils = modules.utils, globals = modules.globals;
    // get needed functions/data
    var show_aboutme_section = core.show_aboutme_section,
        show_contact_nav = core.show_contact_nav,
        shortnames_2_emoticons = core.shortnames_2_emoticons;

    // show the about me section on loaded page
    show_aboutme_section();

    // check if the contact element button should be displayed this is dependant on the presence of the BODY's vertical scrollbar
    show_contact_nav();

    // convert the emoticon shortnames to images :)
    shortnames_2_emoticons();
});
