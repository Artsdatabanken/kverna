const config = require("../../config")
const git = require("../../lib/git")

// Download "Natur i Norge" data kildedata
git.clone("https://github.com/Artsdatabanken/nin-data.git", "nin-data")