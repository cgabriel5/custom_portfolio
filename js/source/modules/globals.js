app.module("globals", function(modules, name) {
    // export to access in other modules
    this[name]["last_open_popup"] = null;
});
