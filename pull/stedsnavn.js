const { git } = require("lastejobb")

// Download typer for kategorier av stedsnavn
git.clone("https://github.com/Artsdatabanken/stedsnavn", "data/stedsnavn")
