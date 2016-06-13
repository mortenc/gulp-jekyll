# gulp-jekyll

##What's this?
This is my boilerplate workflow for using Gulp and Jekyll to easily build static sites. Feel free to clone and reuse as you please!

##Prerequisites:

* [Jekyll](https://jekyllrb.com/) – Jekyll is the static site generator powering the site
* [Gulp](http://gulpjs.com/) – Task manager and automation. Gulp is responsible for running all the small tasks like compiling and automatically reloading browsers.

###Quick-start
So you got the prerequisites installed, and you're ready to get started? Great! Just follow the simple steps below

1. Clone the project and navigate to the project folder.

2. Install all the required packages with Node Package Manager:  
    
    ```
    $ npm install
    ``` 
3. Use these commands:  
    
    ```
    **$ gulp sass (--production)**
    Compile and minify sass files + generate generate sourceemaps + place compiled css in both '/assets/' and '_site/assets/' for reloading. Passing --production flag disables sourcemaps.
    ```
    ```
    **$ gulp scripts (--production)**
    Lint, concat and uglify scripts and place file into both '/assets/' and '_site/assets/' for reloading. Passing --production flag disables sourcemaps.
    ```
    ```
    **$ gulp browser-sync**
    Start a BrowserSync server and automatically launch browser tab
    ```
    ```
    **$ gulp jekyll**
    Build Jekyll Site with an incremental build
    ```
    ```
    **$ gulp serve**
    Serve site, watch for changes and run tasks as needed
    ```