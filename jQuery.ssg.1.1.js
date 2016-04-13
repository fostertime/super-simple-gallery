/* -----------------------------------------
 * <><><> SSG||SuperSimpleGallery v1.1 <><><>
 * -----------------------------------------
 * Copyright (c) Chris Foster & Ten Cities Media, LLC (tencitiesmedia.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */	
 ;(function($, doc, win)
 {
	"use strict";
	
	var name  				= 'ssg-tcm';

	var i;
	var sTimer 				= null;
	var cWidth 				= 0;

	function tcmSSG(el, opts)
	{
		this.$el			= $(el);
		this.opts			= opts;
		this.defaults		=
		{
			autostart: false,
			href: null,
			classname: name,
			heightFix: false,
			markup: false,
			controlCenter: true,
			duration: 5000
		};

		this.opts			= $.extend(this.defaults, opts);
		this.slidesIndex	= this.$el.children().length;
		var holder			= this.$el.children().detach();
		var dots 			= '<span class="active"></span>\n';

		this.$el.append( this.SSGLayout() );
		this.$el.find('.slides').append(holder);
		
		for( i=1; i < this.slidesIndex; i++ )
		{
			dots += '<span></span>\n';
		}
		this.$el.find('.dots').append(dots);
		
		this.$slides    	= this.$el.find('.slides');
		this.$dots      	= this.$el.find('.dots');
		this.$dot	    	= this.$el.find('.dots').children('span');
		this.$singleDot 	= this.$el.find('.dots span:first-child');
		this.$arrows		= this.$el.find('span.arrows');
		this.$SSGSlide  	= this.$el.find('.slides').children();
		
		this.$slides.children(':first').fadeIn(1000).addClass('active');
		
		if ( this.opts.autostart && this.slidesIndex > 1 )
		{
			var self = this;
			
			self.sTimer = setInterval( function()
			{
				self.autoCycle(self.opts.autostart,$('span.next'));
			}, this.opts.duration );
		}
		
		if ( this.opts.heightFix )
		{
			var newHeight = this.$slides.children(':first').height();
			$(this.$el.find('figure.'+this.opts.classname)).css('height', newHeight);
		}
		
		// Set the width of the dots if controlCenter is true
		if ( this.opts.controlCenter )
		{
			cWidth = $(this.$singleDot).outerWidth(true) * this.slidesIndex;
			$(this.$dots).css('width', cWidth);
		}
		
		this.init();
	}
	
	tcmSSG.prototype.init = function()
	{
		var self = this;
		
		self.$dot.on('click', function(e)
		{
			e.preventDefault();
			self.stopSlides();
			self.slidePosition( $(this).index() );
		});
		
		self.$arrows.on('click', function(e)
		{
			var direction = $(this).attr('class');
			e.preventDefault();
			self.autoCycle(false,direction);
		});
	
		self.$SSGSlide.on('click', function(e)
		{
			e.preventDefault();
			if ( $(this).data('link') )
			{
				var location = $(this).data('link');
				window.location.href = location;
			}
		});	
		
	};
	
	tcmSSG.prototype.stopSlides = function()
	{
		var self = this;
		clearInterval(self.sTimer);
		self.sTimer = null;		
	};
	
	tcmSSG.prototype.autoCycle = function(pauseSlides,arrow)
	{
		var self = this;
		if ( !pauseSlides )
			self.stopSlides();
			
		var currentIndex = self.$slides.children('.active').index();
		
		if ( arrow == 'arrows prev' )
			self.slidePosition( ( ( currentIndex - 1 ) + self.slidesIndex ) % self.slidesIndex );
		else
			self.slidePosition( ( ( currentIndex + 1 ) + self.slidesIndex ) % self.slidesIndex );
	};

  	tcmSSG.prototype.slidePosition = function(newIndex)
	{
		var self = this;
		var currentIndex = this.$slides.children('.active').index();
		
		self.$dots.children('.active').removeClass('active');
		self.$dots.children().eq(newIndex).addClass('active');
		self.$slides.children('.active').fadeOut().removeClass('active');
		self.$slides.children().eq(newIndex).fadeIn().addClass('active');
		
		if ( self.opts.heightFix )
		{
			var newHeight = self.$slides.children().eq(newIndex).height();
			$('figure.'+self.opts.classname).css('height', newHeight);
		}
  	};
	
	tcmSSG.prototype.SSGLayout = function()
	{
		var self = this;
		var hr   = (self.opts.markup) ? "<hr />" : "";
		return '<figure class="' + self.opts.classname + '">\
					' + hr + '\
					<span class="arrows prev"></span>\
					<div class="slides"></div>\
					<div class="controls">\
						<div class="dots"></div>\
					</div>\
					<span class="arrows next"></span>\
				</figure><!-- {end} Gallery -->';
	};

	$.fn.ssg = function(opts)
	{
		return this.each( function()
		{
			new tcmSSG(this, opts);
		});
	};
	
})(jQuery, document, window);