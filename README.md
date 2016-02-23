# jquery-video-modal

[View a simple demo here](https://cdn.rawgit.com/ninapavlich/jquery-video-modal/master/example.html)

[View the video modal in the wild here](http://www.lesleyloraine.com/portfolio/)



![alt text](https://raw.githubusercontent.com/ninapavlich/jquery-video-modal/master/docs/screenshot.png "Very Simple Screenshot")

## Initialization

**Example Markup**

    <div id="video-modal" class='video-modal'>
        <video loop="" autoplay="" muted="" src="https://lesleyloraine-dev.s3.amazonaws.com/media/media/homepage.mp4" poster="https://lesleyloraine-dev.s3.amazonaws.com/media/image/homepage_poster.jpg" id="homepage-video"></video>
        <div class="controls">
            <a href="#" class='play fa fa-play'></a>
            <a href="#" class='pause fa fa-pause'></a>
            <a href="#" class='scrub'><span class="marker"></span></a>
            <a href="#" class='close fa fa-close'></a>
        </div>
    </div>


**Required Libraries**

    <script src="js/vendor/jquery-1.11.2.min.js"></script>


**Javascript**

    <script>
        var modal = $('#video-modal').data("videoModal");
        $("a.open").bind("click", function(event){
            event.preventDefault();
            modal.open(true);
        });
    </script>
    


## Options

**initUI:true**
Initialize UI elements