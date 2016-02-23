/*!
 * nina@ninalp.com
 */

;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "videoModal",
        defaults = {
            themeClass:'video-modal-theme-default',
            mouseHideDelay:3000
        };

    // The actual plugin constructor
    function VideoModal( element, options ) {
        this.element = element;

        $(this.element).data('videoModal', this);
        
        this.options = $.extend( {}, defaults, options);

        this._is_playing = false;
        this._is_playing_rendered = true;
        
        this._is_open = false;
        this._is_open_rendered = true;

        this.scrub_portion = 0;

        this._render_interval = -1;

        this.ui_container = $(this.element).find(".controls")[0];
        this.video = $(this.element).find("video")[0];
        
        

        this.init();
    }


    VideoModal.prototype = {

        init: function() {
            var parent = this;

            $(this.element).addClass(this.options.themeClass);

            this.initListeners();
            
            this.render();
            

        },
        initListeners : function(){
            var parent = this;

            var img_src = $(this.video).attr("poster")
            $("<img/>").attr("src", img_src).load(function() {
                $(parent.video).data('measured', true);
                $(parent.video).data('image-width', this.width);
                $(parent.video).data('image-height', this.height);
                $(parent.video).attr('data-image-width', this.width);
                $(parent.video).attr('data-image-height', this.height);
                parent.render();
                
            });

            
            $(this.ui_container).find(".play").bind("click", function(event){
                event.preventDefault();
                parent.play();
            });

            $(this.ui_container).find(".pause").bind("click", function(event){
                event.preventDefault();
                parent.pause();
            });

            $(this.ui_container).find(".close").bind("click", function(event){
                event.preventDefault();
                parent.close();
            });

            $(this.ui_container).find(".scrub").bind("mousedown", function(event){
                event.preventDefault();
                parent._is_scrubbing = true;
                parent._onScrub(event);
            });

            $(this.ui_container).bind("mousemove", function(event){
                
                if(parent._is_scrubbing){
                    parent._onScrub(event);
                }

                if(parent._is_open){
                    parent._onMouseMove();
                }

            });

            $(document).bind("mouseup", function(event){
                event.preventDefault();
                if(parent._is_scrubbing){
                    parent._is_scrubbing = false;
                    parent._onScrub(event);
                }
            });

            $( window ).bind("resize", function() {
              parent.render();
            });

            $(document).bind("keyup", function (event) {
                
                if(parent._is_open){
                    if(event.keyCode==32){
                        if(parent._is_playing){
                            parent.pause();
                        }else{
                            parent.play();
                        }
                    }else if(event.keyCode==27){
                        parent.close();
                    }  
                }
                
            });



        },
        pause : function(){
            if(this._is_playing==false){
                return;
            }

            this._is_playing = false;
            clearInterval(this._render_interval);
            this.render();
        },
        play : function(){
            if(this._is_playing==true){
                return;
            }

            this._is_playing = true;
            this.render();

            var parent = this;
            clearInterval(this._render_interval);
            this._render_interval = setInterval(function(){
                parent.render();
            }, 100);

            this._onMouseMove();
            
        },

        close : function(){
            if(this._is_open==false){
                return;
            }

            this._is_playing = false;
            this._is_open = false;
            clearInterval(this._render_interval);
            this.render();
        },
        open : function(autoplay){
            if(this._is_open==true){
                return;
            }
            this._is_open = true;

            if(autoplay){
                this.scrubTo(0);
                this.play();
            }else{
                this.render();    
            }
            
        },

        scrubTo : function(portion){
            this.scrub_portion = portion;

            this.video.currentTime = this.scrub_portion * this.video.duration;

            this.render();
        },
        _onScrub : function(event){
            var scrub_offset = $(this.ui_container).find(".scrub").offset();
            
            var margin_x = parseInt($(this.ui_container).find(".scrub .marker").css("margin-left"));
            var x = event.clientX - scrub_offset.left - margin_x;
            var x_portion = x / $(this.ui_container).find(".scrub").width();
            x_portion = Math.max(0, Math.min(1, x_portion))
            this.scrubTo(x_portion);
        },
        _onMouseMove : function(){
            this._mouse_idle = false;

            var parent = this;
            clearInterval(this._idle_interval);
            this._idle_interval = setInterval(function(){
                parent._mouse_idle = true;
                parent.render()
            }, this.options.mouseHideDelay);
            parent.render()
        },
        render : function(){
            // console.log("render")
            if(this._is_open_rendered != this._is_open){
                this._is_open_rendered = this._is_open;
                if(this._is_open){
                    $(this.element).show();
                }else{
                    $(this.element).hide();
                }    
            }
            

            if(this._is_playing_rendered != this._is_playing){
                this._is_playing_rendered = this._is_playing;
                if(this._is_playing){
                    $(this.ui_container).find(".pause").show();
                    $(this.ui_container).find(".play").hide();
                    this.video.play();
                }else{
                    $(this.ui_container).find(".pause").hide();
                    $(this.ui_container).find(".play").show();
                    this.video.pause();
                }
            }

           

            if(this._is_scrubbing){

                var target_width = $(this.ui_container).find(".scrub").width() * this.scrub_portion;
                $(this.ui_container).find(".scrub .marker").width(target_width+"px");

            }else{

                this.play_portion = this.video.currentTime / this.video.duration;
                var target_width = $(this.ui_container).find(".scrub").width() * this.play_portion;
                $(this.ui_container).find(".scrub .marker").width(target_width+"px");

                if(this._mouse_idle && this._is_playing==true){
                    $(this.ui_container).addClass("hide");
                }else{
                    $(this.ui_container).removeClass("hide");
                } 
            }

            if($(this.video).data('measured')==true){
                this.renderFill();
            }
            
        },
        renderFill : function(){
            var image_width = $(this.video).data('image-width');
            var image_height = $(this.video).data('image-height');
            var container_width = $(window).width();
            var container_height = $(window).height();

            // console.log("Fit image "+image_width+" by "+image_height+" into "+container_width+" by "+container_height)

            

            var dw = container_width / image_width;
            var dh = container_height / image_height;
            var scale = Math.max(dw, dh);
            
            var new_w = scale * image_width;
            var new_h = scale * image_height;

            var dx = 0.5 * (container_width - new_w);
            var dy = 0.5 * (container_height - new_h);
            $(this.video).width(new_w);
            $(this.video).height(new_h);
            $(this.video).css("margin-left", dx);
            $(this.video).css("margin-top", dy);

            // console.log("container_width: "+container_width+" new_w: "+new_w+" dx: "+dx);
            // console.log("container_height: "+container_height+" new_h: "+new_h+" dy: "+dy);
            
        }

        
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new VideoModal( this, options ));
            }
        });
    };

})( jQuery, window, document );
