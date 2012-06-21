define([
       'jquery',
       'tapin/frontend/map',
       'tapin/frontend/map/pin',
       'tapin/frontend/map/pincollection',
       'tapin/frontend/sidebar',
       'tapin/frontend/timeslider',
       'tapin/frontend/modal',
       'tapin/frontend/filmstrip',
       'tapin/api',
       'tapin/util/async',
       'tapin/util/log',
       'tapin/config',
       'tapin/user'],
       function(JQuery, Map, Pin, PinCollection, Sidebar, TimeSlider, Modal, Filmstrip, Api, Async, Log, Config, User)
{
    return new (function(){
        var _this = this;

        this.mainMap = new Map(JQuery("#map"));
        this.api = null;
        this.sidebar = new Sidebar(JQuery("#sidebar"));
        this.timeslider = new TimeSlider(JQuery('#time-slider'));
        this.modal = new Modal(JQuery('#modal-page'));
        this.loader = new Filmstrip(JQuery("#map-loader"), 'assets/img/');

        var _modalPage = null;
        var _modalPageContent = null;

        var timescale = 10*60;
        var showLoaderRef;
        this.updateMap = function()
        {
            var bounds = _this.mainMap.getBounds();

            var since_time = Math.floor(((new Date()).getTime()/1000) - timescale);

            // Show the loader if the request takes too long
            showLoaderRef = Async.later(600, function(){
                _this.loader.show();
            });

            Api.get_streams_by_location(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1], since_time, 'now', function(streams){
                // Don't show the loader/remove the loader when we're done
                clearTimeout(showLoaderRef);
                _this.loader.hide();

                var new_pins = new PinCollection();
                for (var i in streams) {
                    var stream = streams[i];
                    var coords = streams[i][0]['coord'];
                    var pin = new Pin(coords[0], coords[1], i, {stream_id: i});
                    new_pins.addOrUpdatePin(pin);
                }

                _this.mainMap.Pins.replace(new_pins);
            }, function(){
                Log('warn', 'Could not update the map');
            })
        }

        this.updateNav = function(page)
        {
            var matchingPage = JQuery('ul.nav li a[href="' + page + '"]');
            if (matchingPage.length > 0) {
                JQuery('ul.nav li').each(function(){
                    $(this).removeClass('active');
                });
                matchingPage.parent().addClass('active');
            }
        }


        this.showVideo = function(stream_id)
        {
            Log('debug', 'Showing video for pin', stream_id);
            Api.get_stream_by_stream_id(stream_id, function(data){
                _this.sidebar.player.playStreamData(data);
            }, true);
        }

        var showVideoForPin = function(pin)
        {
            window.location.hash = 'video/' + pin.Data.stream_id + '/now';
        }

        // Used for debugging - sets the window mode to debug
        window.onStage = function() {
            Log('info', 'Switching API calls to stage.');
            Config['api']['base'] = 'http://stage.api.tapin.tv/web/';
        }

        this.constructor = function(){
            api = new Api();

            this.timeslider.selectTime('now');

            JQuery("html").append(_modalPage);


            $("a").live('click', function(event){
                var href = $(this).attr('href');
                if (href == '#') {
                    event.stopPropagation();
                    _this.modal.close();
                    _this.updateNav(href);
                    $(window).trigger('hashchange');
                    return false;
                } else if (href.substring(0, 6) == '#page/') {
                    event.stopPropagation();
                    JQuery.ajax({
                        cache: false,
                        url: 'assets/static/' + href.substring(6) + '?nocache=' + (new Date()).getTime(),
                        dataType: 'html',
                        success: function(html){
                            _this.showModalPage(html);
                            _this.updateNav(href);
                        }
                    });
                    $(window).trigger('hashchange');
                    return false;
                }
            });

            // Bind to time slider events
            this.timeslider.onTimeChange.register(function(new_time){
                timescale = new_time;
                _this.updateMap();
            });

            // Redraw pins on map move
            this.mainMap.onBoundsChange.register(_this.updateMap);

            // Show video when we click a pin
            this.mainMap.onPinClick.register(showVideoForPin);

            // Get an initial update
            Async.later(1000, _this.updateMap);

            // Fake live
            Async.every(2 * 1000, _this.updateMap);
        }

        this.constructor();
    });
});