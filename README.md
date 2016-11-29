## Crowdhelpr project

#### Requirements

    git
    nodejs > 0.10.x
    npm > 1.4.x

#### Step by Step

Clone this project and install dependencies
```bash
git clone https://github.com/crowdhelpr-phonegap-ionic.git
npm install -g bower gulp
npm install
bower install
```

Next, send the API key to ionic.io:

```bash
ionic push --google-api-key your-google-api-key
```

Hooking up ionic.io
```bash
ionic config set gcm_key <your-gcm-project-number>
```

to build app.
```bash
gulp -b
ionic platform add android
ionic platform add ios
ionic build android
ionic build ios
```

to start up the build job and file watchers.
```bash
gulp
```

## Structure

The source code lives inside the `app` folder.

| Source Files  | Location |
| ------------- | ------------- |
| Javascript    | `app/js`  |
| Styles (scss) | `app/styles`  |
| Templates     | `app/templates`  |
| Images        | `app/img`  |
| Fonts         | `app/fonts`  |
| Icons         | `app/icons`  |

A lot of starter kits and tutorials encourage you to work directly inside the `www` folder, but I chose `app` instead, as it conforms better with most Angular.js projects. Note that `www` is gitignored and will be created dynamically during our build process.

All 3rd party Javascript sources have to be manually added into `.vendor.json` and will be concatenated into a single `vendor.js` file.
I know there is [wiredep](https://github.com/taptapship/wiredep) but I prefer to explicitly control which files get injected and also wiredep ends up adding lots of `<script>` tags in your index.html instead of building a single `vendor.js` file.


In order to compile Sass, you need to have ruby and the sass ruby gem installed: `gem install sass`.

## Workflow

This doc assumes you have `gulp` globally installed (`npm install -g gulp`).
If you do not have / want gulp globally installed, you can run `npm run gulp` instead.

#### Development mode

By running just `gulp`, we start our development build process, consisting of:

- compiling, concatenating, auto-prefixing of all `.scss` files required by `app/styles/main.scss`
- creating `vendor.js` file from external sources defined in `./vendor.json`
- linting all `*.js` files `app/scripts`, see `.jshintrc` for ruleset
- automatically inject sources into `index.html` so we don't have to add / remove sources manually
- build everything into `.tmp` folder (also gitignored)
- start local development server and serve from `.tmp`
- start watchers to automatically lint javascript source files, compile scss and reload browser on changes


#### Build mode

By running just `gulp --build` or short `gulp -b`, we start gulp in build mode

- concat all `.js` sources into single `app.js` file
- version `main.css` and `app.js`
- build everything into `www`
- remove debugs messages such as `console.log` or `alert` with passing `--release`


#### Emulate

By running `gulp -e <platform>`, we can run our app in the simulator

- <platform> can be either `ios` or `android`, defaults to `ios`
- make sure to have iOS Simulator installed in XCode, as well as `ios-sim` package globally installed (`npm install -g ios-sim`)
- for Android, [Ripple](http://ripple.incubator.apache.org/) or [Genymotion](https://www.genymotion.com/) seem to be the emulators of choice
- It will run the `gulp --build` before, so we have a fresh version to test
- In iOS, it will livereload any code changes in iOS simulator

#### Emulate a specific iOS device

By running `gulp select` you will see a prompt where you can choose which ios device to emulate. This works only when you have the `gulp -e` task running in one terminal window and run `gulp select` in another terminal window.


#### Ripple Emulator

Run `gulp ripple` to open your app in a browser using ripple. This is useful for emuating a bunch of different Android devices and settings, such as geolocation, battery status, globalization and more. Note that ripple is still in beta and will show weird debug messages from time to time.


#### Run

By running `gulp -r <platform>`, we can run our app on a connected device

- <platform> can be either `ios` or `android`, defaults to `ios`
- It will run the `gulp --build` before, so we have a fresh version to test

### splash screens and icons

Replace `splash.png` and `icon.png` inside `/resources`. Then run `ionic resources`. If you only want to regenerate icons or splashs, you can run `gulp icon` or `gulp splash` shorthand.

### customizin themes

Just override any Ionic variables in `app/styles/ionic-styles.scss`.
