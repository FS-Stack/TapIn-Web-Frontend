/**
 * Represents a user object
 */
define([], function(){
    return function(data) {
        this.username = null;
        this.firstname = null;
        this.lastname = null;
        this.gender = null;
        this.bio = null;
        this.background = null;
        this.bgcreditname = null;
        this.bgcrediturl = null;
        this.points = null;
        this.titles = [];
        this.badges = [];
        this.streams = [];
        this.title = null;
        this.nexttitle = null;
        this.email = null;
        this.level = null;
        this.last = null;
        this.next = null;
        this.points = null;
        this.followers = null;
        this.following = null;
        this.emailhash = null;

        /**
         * Returns the display name of the user
         * @return string The display name of the user, one of: [first name] [last name], [first name] "[username]", or [username]
         */
        this.getName = function() {
            var name = "";
            if (this.firstname !== null && this.firstname != '') {
                name += this.firstname;
                if (this.lastname !== null && this.lastname != '') {
                    name += ' ' + this.lastname;
                } else {
                    name += ' "' + this.username + '"';
                }
            } else {
                name = this.username;
            }

            return name;
        }

        this.getAvatar = function(size) {
            return 'http://www.gravatar.com/avatar/' + this.emailhash + '?r=pg&s=' + size + '&d=http%3A%2F%2Fwww.tapin.tv%2Fassets%2Fimg%2Ficon-noavatar-' + size + '.png';
        }

        this.getAvatar50 = function()
        {
            return this.getAvatar(50);
        }

        this.getAvatar35 = function()
        {
            return this.getAvatar(35);
        }

        /**
         * Returns the level percent of the user
         * @return float Percent to the next level
         */
        this.getLevelPercent = function() {
            return (100 * (this.points - this.last))/(this.next - this.last);
        }

        /**
         * Returns the width of the level bar (1.5x the percent)
         * @return float Width of the level bar, with 150 max
         */
        this.getLevelBarWidth = function() {
            var r = Math.floor(1.5 * this.getLevelPercent())
            return (r<0)?0:r;
        }

        /**
         * Returns the background URL
         * @return string URL of the background
         */
        this.getBackgroundUrl = function() {
            if (this.background === null || this.background == '' || this.background.substring(0, 7) == 'http://') {
                return this.background;
            } else {
                return 'assets/img/backgrounds/' + this.background;
            }
        }

        /**
         * Returns a scaled version of the background URL if possible, otherwise the full background URL
         * @return string URL of the background
         */
        this.getSmallBackgroundUrl = function() {
            if (this.background === null || this.background == '' || this.background.substring(0, 7) == 'http://') {
                return this.background;
            } else {
                return 'assets/img/backgrounds/small/' + this.background;
            }
        }

        /**
         * Populates the object with userdata
         * @param  object   data Key-value pair of user data
         */
        this.constructor = function(data)
        {
            for (var key in data) {
                if (key in this) {
                    this[key] = data[key];
                }
            }
        }
        this.constructor(data);
    }
})