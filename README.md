# jquery-video-modal

[View a simple demo here](https://cdn.rawgit.com/ninapavlich/jquery-video-modal/master/example.html)

[View the video modal in the wild here](http://www.lesleyloraine.com/portfolio/)



![alt text](https://raw.githubusercontent.com/ninapavlich/jquery-video-modal/master/docs/screenshot.png "Very Simple Screenshot")

## Initialization

**Example Markup**

    <video loop="" autoplay="" muted="" src="https://lesleyloraine-dev.s3.amazonaws.com/media/media/homepage.mp4" poster="https://lesleyloraine-dev.s3.amazonaws.com/media/image/homepage_poster.jpg" id="homepage-video"></video>


**Required Libraries**

    <script src="js/vendor/jquery-1.11.2.min.js"></script>


**Javascript**

    <script>
        var modal_player = new VideoModal({
            'initUI':true
        });
        modal_player.play($('#homepage-video'))
    </script>
    


## Options

**initUI:true**
Initialize UI elements