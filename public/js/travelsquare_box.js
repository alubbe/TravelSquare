
TSglobal_likes = [];
TSglobal_dislikes = [];
TSglobal_visibles = [];
TSglobal_city = "Barcelona";
TSglobal_hotel = "JetPack Alternative";
TSglobal_startdate = "01.12.2013";
TSglobal_daysofstay = 5;
    

$(function() {
   /* $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
*/


	$( "#accordion" ).accordion({
      event: "click hoverintent",
      header: "div:even" 
    });



  $( "input[type=submit]" )
      .button({
      icons: {
        primary: "ui-icon-locked"
      }
    })
      .click(function( event ) {
        event.preventDefault();
      }); 


  $( ".venueTrash" ).click(function() {
  	$(this).parents(".square").hide('fade');
    TSglobal_dislikes.push("idkommtnoch");
    console.log("dislike id 123");
    /*retrieve id, toggle on/off*/
  });



  $( ".venueHeart" ).click(function() {
  	$(this).removeClass( "imgoff" );
    TSglobal_likes.push("idkommtnoch");
    console.log("like id 123");
    /*retrieve id, toggle on/off*/
     });


    $("#calculatetrip").click(function(){
      prefix = "prefix";
      llikes = "";
      ldislikes = "";
      lothers = "";
      var nexturl = prefix + "&city=" + TSglobal_city + "&hotel=" + TSglobal_hotel + "&startdate=" + TSglobal_startdate + "&daysofstay=" + TSglobal_daysofstay + "&likes=" + TSglobal_likes + "&dislikes=" + TSglobal_dislikes + "&visibles=" + TSglobal_visibles;    
       $( "#debugnexturl" ).html(nexturl); 
       $( "#debugnexturl" ).dialog( "open" );

        });
	


    $( "#debugnexturl" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      }
    });
 
    
  });


