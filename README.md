# url-image-diff
Automation of screenshot capture and image difference to existing baseline images.


## Introduction

Script runs through the `sites.json` file, grabbing screenshots and comparing them, using `image-diff`, to that site's baseline screenshots. Ideal for visual comparison of site changes.

Script outputs images for the current round of screenshots, as well as the current round of differences.

### Notes:
* Screenshot sizes are defined in `screensizes.json`;
* Baseline screenshots are stored in the `images` folder as such: `images/<SITE.NAME>/BASE/*`;
* New baseline screenshots will be created if none exist
* New baseline screenshots can also be created with the `--new-base-images` argument:
    * `node app.js --new-base-images`
    * *WARNING*: existing base images will be deleted / overwritten

## Dependencies
`url-image-diff` relies on [ImageMagick](http://www.imagemagick.org/) and [Node.js](https://nodejs.org).

Please ensure that both are installed before continuing.



## Installation
Steps to install:
* Install [ImageMagick](http://www.imagemagick.org/)
* Install [Node.js](https://nodejs.org)
* Clone repo / download source
* Change directory to project folder
* `npm install`


## Getting Started

Edit the following files to match your requirements:
* `sites.json` - contains sites you wish to grab screenshots of
	* Should be an array of objects, with objects taking the following properties:
		* `name` : string - User defined name of site
		* `url` : string - URL to grab
		* `enabled` : boolean - whether or not site is ran
* `screensizes.json` - contains various sizes of screenshots
	* Should be an array of strings representing screensizes. Example: '430x700'


Run (from project folder):
* `node app.js`


## Future improvements
* Scheduler
* Alerts of changes
* ???