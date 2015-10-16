//Load our required packages;
var Pageres = require('pageres');
var imageDiff = require('image-diff');
var fs = require('fs');


//Load our configs;
var SITES = require('./sites.json');
var SCREENSIZES = require('./screensizes.json');


//Options;
var CREATE_NEW_BASE_IMAGES = false;


//Load arguments;
process.argv.forEach(function (val, index, array) {
	//console.log(index + ': ' + val);
	if (val.toLowerCase() == '--new-base-images') {
	    CREATE_NEW_BASE_IMAGES = true;
	}
});


//Iterate through our declared sites;
SITES.forEach(function(site) {
    if (site.enabled) {
        //Lets get the images....
        var imageFolder = __dirname + '/images/' + site.name;

        //Iterate through our declared screensizes;
        SCREENSIZES.forEach(function(SCREENSIZE) {
			var BASEIMAGE = imageFolder + '/BASE/' + SCREENSIZE + '.png';
            var CURRENTIMAGE = imageFolder + '/' + SCREENSIZE + '.png';
            var DIFFIMAGE = imageFolder + '/' + SCREENSIZE + ' - DIFF.png';
            var displayName = '[' + site.name + ' / ' + SCREENSIZE + ']';

			var SITE_LOG = [];
			SITE_LOG.push('---');
            SITE_LOG.push(displayName + ' Grabbing images.');
            var pageres = new Pageres({
                    delay: 2
                })
                .src(site.url, [SCREENSIZE], {
                    filename: '<%= size %>'
                })
                .dest(imageFolder)
                .run(function(err) {
                    SITE_LOG.push(displayName + ' screenshot gathering finished.');

                    //Check if a base image for this site and screensize exist;
                    //if it doesn't, we'll attempt to use this image to create it;
                    fs.readFile(BASEIMAGE, 'utf8', function(err, data) {
                        if (err) {
                            SITE_LOG.push('No base image for ' + displayName + '. Creating it now.');
                            CREATE_NEW_BASE_IMAGES = true;
                        }
                        else {
                            //console.log('Base image for this exists.');
                        }
                    });


                    //If we did not have the base image OR were requested to create it, do so now.
					if(CREATE_NEW_BASE_IMAGES){
						fs.mkdir(imageFolder + '/BASE/', 0777, function(err) {
                            //Error handling would go here...
                            if (err) {
                                //console.log('[ERROR] Error creating folder for ' + imageFolder + '/BASE');
                            }
                        });
						SITE_LOG.push(displayName + ' Creating base image...');
                        fs.createReadStream(CURRENTIMAGE).pipe(fs.createWriteStream(BASEIMAGE));
                    }


					//And now let's do the comparisons;
                    SITE_LOG.push(displayName + ' comparing screenshots.');
                    imageDiff({
                            actualImage: CURRENTIMAGE,
                            expectedImage: BASEIMAGE,
                            diffImage: DIFFIMAGE
                        },
                        function(err, imagesAreSame) {
                        	if(!err){
	                            if (!imagesAreSame) {
	                            	SITE_LOG.push('');
	                                SITE_LOG.push('----- DIFFERENCE! --- ' + displayName + ' ---v');
	                                SITE_LOG.push(displayName + ' images are not the same!');
	                                SITE_LOG.push('View "' + DIFFIMAGE + '" to see the differences.');
	                    			SITE_LOG.push('----- DIFFERENCE! --- ' + displayName + ' ---^');
	                    			SITE_LOG.push('');
	                            } else {
	                                SITE_LOG.push(displayName + ' is valid.');
	                            }
	                        }
	                        else {
	                        	SITE_LOG.push('');
	                        	SITE_LOG.push('----- ERROR --- ' + displayName + ' ---v');
	                        	SITE_LOG.push('ERROR!');
	                        	SITE_LOG.push(err);
	                        	SITE_LOG.push('----- ERROR --- ' + displayName + ' ---^');
	                        	SITE_LOG.push('');
	                        }

	                        SITE_LOG.push('---');
	                        SITE_LOG.push('');
	                        console.log(SITE_LOG.join("\r\n"));
                        });
                });
        });
    }
});
