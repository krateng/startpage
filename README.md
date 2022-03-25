## Startpage
*a startpage for your server and / or new tab page*

![screenshot](https://i.imgur.com/J4d7Q3D.png)

[More screenshots](https://imgur.com/a/FDVRIyw)

### Changes to Upstream

* Themes are dynamic, no boilerplate code to define them
* Use much more concise YAML for configuration
* No custom search providers, duckduckgo as default
* No hidden promotional / advertising content

### Install:

 - `git clone` this repository
 - `sh server.sh`
 - The page should be available at  `http://localhost:8000`

### Customization

#### Client Configuration
 - Click the options button on the left bottom to change theme

#### Server Configuration
Add your services by editing `services.yml`, your bookmarks in `bookmarks.yml` and custom color themes in `themes.yml`.

Find the names  of icons to use at [Material Design Icons](https://materialdesignicons.com/)
