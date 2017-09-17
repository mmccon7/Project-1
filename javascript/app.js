$(document).ready(function() {

//Legend for Below:
  // Firebase variables and configuration
  // Global variables
  // Functions - universal and/or page 
  // Run Page Functions
  // Click Functions for Pet API
  // Functions for Firebase


  var config = {
    apiKey: "AIzaSyDv05y1-GztFyliR0L42WZll3Le0lQxoyk",
    authDomain: "project-find-a-pet.firebaseapp.com",
    databaseURL: "https://project-find-a-pet.firebaseio.com",
    projectId: "project-find-a-pet",
    storageBucket: "project-find-a-pet.appspot.com",
    messagingSenderId: "1054405260043"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Initial Values

  //Petfinder API variables
  var url = "http://api.petfinder.com/pet.find?format=json&key=";
  var api = "9503ebe5eee4d378650ea8929cf9c5b7";

  //Search Petfinder variables
  var animal = ["cat", "dog"];//Note: API only accepts lower case animal in search url
  var sex = ["F", "M"];
  var size = ["S", "M", "L", "XL"];
  var age = ["Baby", "Young", "Adult", "Senior"];
  var results = 25;

  //Search Found/Lost variables
  var lostAndFound = ["Found", "Lost"];
  var lFname = "";
  var lFdate = "";
  var lFanimal = "";
  var lFsex = "";
  var lFsize = "";
  var lFage = "";
  var lFzip = "";
  var lFemail= "";
  var lFimage = document.getElementById('file-input');
  var file = "";
  var lFfilelocation = "";

  //Dropdown functions for html page
  //Navigation bar
  function navagationArray () {
    $(".nav").append("<li><a href='index.html'>Home</a></li>" + 
      "<li><a href='FindAPet_Shelter.html'>Shelters</a></li>" + 
      "<li><a href='Lost&Found.html'>Lost &amp; Found</a></li>" + 
      "<li><a href='AddAPet.html'>Add A Pet</a></li>" +
      "<li><a href='Admin.html'>Admin Panel</a></li>");
  }

  function dropdownArray () {
    for (i=0; i<animal.length; i++) {
      $("#animalArray").append("<option data-animal='" + animal[i] + "'>" + animal[i] + "</option>");
    }
    for (i=0; i<sex.length; i++) {
      $("#sexArray").append("<option data-sex='" + sex[i] + "'>" + sex[i] + "</option>");
    } 
    for (i=0; i<size.length; i++) {
      $("#sizeArray").append("<option data-size='" + size[i] + "'>" + size[i] + "</option>");
    } 
    for (i=0; i<lostAndFound.length; i++) {
      $("#lostFound_input").append("<option data-category='" + lostAndFound[i] + "'>" + lostAndFound[i] + "</option>");
      } 
    for (i=0; i<age.length; i++) {
      $("#ageArray").append("<option data-age='" + age[i] + "'>" + age[i] + "</option>");
    }      
  }

  //function to clear zip field after submit key
  function clearField() {
    if (document.getElementById('shelterID')){
      $("#shelterID").val("");
    }
    if (document.getElementById('zipCode')){
      $("#zipCode").val("");
    }  
    if (document.getElementById('addPet')){
      $("#addPet")[0].reset();
      uploader.value = 0;
    }
    if (document.getElementById('sheltersearch')){
      $("#sheltersearch")[0].reset();
    }
    if (document.getElementById('query')){
      $("#query")[0].reset();
    }
   }

  //function to remove Search results to be used in multiple places
  function callback() {
    $(".callback").remove();
  }

  //Run dropdown functions
  navagationArray();
  dropdownArray(); 

  //function for clear button to remove elements in callback area
  $(".clear").on("click", function clear () {
    callback();
  });  

  //Function for search button to capture variables and displayPetFinds
  $(document).on("click", ".search", function petsearchAPI () {
      
    callback();

    var aniSearch = $("#animalArray").val();
    var sizSearch = $("#sizeArray").val();
    var sexSearch = $("#sexArray").val(); 
    var ageSearch = $("#ageArray").val();
    var zipSearch = $("#zipCode").val();

    var queryURL = url + api + "&animal=" + aniSearch + "&size=" + sizSearch + "&sex=" + sexSearch + "&age=" + ageSearch + "&location=" + zipSearch;

    if (zipSearch.length===5) {

        $.ajax({
         url: queryURL,
         method: "GET",
         dataType:"jsonp"
        }).done(function(response) {
         var res = response.petfinder.pets.pet;

      //API search default is 25 results
        for (var i = 0; i < results; i++) {
          var imgResult;
          var newDiv = $("<div class='callback'>" + i);
          var headline = res[i].name.$t;
          var head = $("<h4>").text("My name is: " + headline);
          head.prepend("<span class='label label-primary'>" + (i+1) + "</span>");
          newDiv.append(head);

          if (res[i].media.hasOwnProperty("photos")) {  
            var img = res[i].media.photos.photo[3].$t; 
            imgResult = "<img src=" + img + ">";
            newDiv.append(imgResult);
            }
          else {
            imgResult = "<img src='icons/adopt-placeholder.png'>";
            newDiv.append(imgResult);
            }

          var animal = res[i].animal.$t;
          var aniResult = $("<p>").text(animal);
          newDiv.append(aniResult);

          var age = res[i].age.$t;
          var ageResult = $("<p>").text("Age: " + age);
          newDiv.append(ageResult);

          var sex = res[i].sex.$t;
          var sexResult = $("<p>").text("Gender: " + sex);
          newDiv.append(sexResult);

          var size = res[i].size.$t;
          var sizResult = $("<p>").text("Size: " + size);
          newDiv.append(sizResult);

          var shelter = res[i].shelterId.$t;
          var shResult = $("<p>").text("Shelter ID: " + shelter);
          newDiv.append(shResult);

          var email = res[i].contact.email.$t;
          var emResult = $("<p>").text("Email: " + email);
          newDiv.append(emResult);

          var phone = res[i].contact.phone.$t;
          var phoResult = $("<p>").text("Phone: " + phone);
          newDiv.append(phoResult);

          $(".results").append(newDiv);
        }//end of for

        });//end of response function

        clearField();   
    }//end of if statement
     
    else {
      $("#badInputModal").modal({show: true});
    }
  });//end of Pet Shelter search click function  

  //Function for SHELTER FIND 
  $(document).on("click", ".shelter_search", function shelsearchAPI () {
    
    event.preventDefault();  
    $(".shelterFind").remove();

    var shelsearch = $("#shelterID").val();
    var findID = shelsearch.toUpperCase();
    var url = "http://api.petfinder.com/shelter.get?format=json&key=";
    var queryURL = url + api + "&id=" + findID;

    if (shelsearch.length>=2) {

        $.ajax({
         url: queryURL,
         method: "GET",
         dataType:"jsonp"
        })
    
        .done(function(response) {
          var res = response.petfinder.shelter;
          
          //API search returns 1 shelter
       
          var shelDiv = $("<div class='shelterFind'>");
   
          //Captures if no match on shelter id
          if (!res) {  
            $("#shelterID_search").append(shelDiv);
            shelDiv.html("<b>No results found. Please verify the Shelter ID.</b>");
          }
          
          else {
          var findName = res.name.$t;
          var shelName = $("<h4>").text("Shelter: " + findName);
          shelDiv.append(shelName);
          
          
          var address = res.address1.$t;
          var addResult = $("<p>").text(address);
          shelDiv.append(addResult);
          
          var city = res.city.$t;
          var cityResult = $("<p>").text(city);
          shelDiv.append(cityResult);
          
          var state = res.state.$t;
          var stateResult = $("<p>").text(state);
          shelDiv.append(stateResult);
          
          var zip = res.zip.$t;
          var zipResult = $("<p>").text(zip);
          shelDiv.append(zipResult);
          
          var phone = res.phone.$t;
          var phonResult = $("<p>").text(phone);
          shelDiv.append(phonResult);
          
          var email = res.email.$t;
          var emaResult = $("<p>").text(email);
          shelDiv.append(emaResult);

          $("#shelterID_search").append(shelDiv);
          }
        });//end of response function

        clearField();   
    }//end of if statement   
    else {
      $("#badInputModal").modal({show: true});
    } 
  });//end of shelsearchAPI function 
  
  //Function for search button to capture variables and displayPetFinds
  $(document).on("click", ".firebase_search", function fbSearch () {
   
    //Clear the div so it can populate new results
    $("#pFresults").empty();
   
    var nameSearch = $("#nameFB").val().trim().toLowerCase();
    var aniSearch = $("#animalArray").val();
    var sexSearch = $("#sexArray").val();
    
    var ref = database.ref();

    if (nameSearch==="") {
      
      ref.orderByChild("lFanimal").equalTo(aniSearch).on("child_added", function(childSnapshot) {

        if (childSnapshot.val().lFsex === sexSearch) {
         //Table results are dependent on filter - can not create a universal function to be used in both if and else 
          $("#pFresults").append("<tr><td><img src='" + childSnapshot.val().lFpic + ">'"  +
           " </td><td style='text-transform: capitalize'> " + childSnapshot.val().lFname +
           " </td><td> " + childSnapshot.val().lFanimal +
           " </td><td> " + childSnapshot.val().lFsex +
           " </td><td> " + childSnapshot.val().lFsize +
           " </td><td> " + childSnapshot.val().lFage +
           " </td><td> " + childSnapshot.val().lostAndFound +
           " </td><td> " + childSnapshot.val().lFdate +  
           " </td><td> " + childSnapshot.val().lFzip + 
           " </td><td> " + childSnapshot.val().lFemail + " </td></tr>");   
       }

      });
    }//end of if nameSearch===""

    else {
      ref.orderByChild("lFname").equalTo(nameSearch).on("child_added", function(childSnapshot) {

        if (childSnapshot.val().lFsex === sexSearch && childSnapshot.val().lFanimal === aniSearch) {
          
         //Table results are dependent on filter - can not create a universal function to be used in both if and else 
         $("#pFresults").append("<tr><td><img src='" + childSnapshot.val().lFpic + ">'"  +
          " </td><td style='text-transform: capitalize'> " + childSnapshot.val().lFname +
          " </td><td> " + childSnapshot.val().lFanimal +
          " </td><td> " + childSnapshot.val().lFsex +
          " </td><td> " + childSnapshot.val().lFsize +
          " </td><td> " + childSnapshot.val().lFage +
          " </td><td> " + childSnapshot.val().lostAndFound +
          " </td><td> " + childSnapshot.val().lFdate +  
          " </td><td> " + childSnapshot.val().lFzip + 
          " </td><td> " + childSnapshot.val().lFemail + " </td></tr>");
        }
      });
    }//end of else 
    if ($('#pFresults').html() == '') {
      $("#pFresults").html("<b>No results found</b>");
    } 
    clearField();
  });

  // Listen for file selection
  if ($('#file-input').length) {  
    lFimage.addEventListener('change', function(e) {
      //Get file
      file=e.target.files[0];
      
      //Create a storage ref
      var storageRef = firebase.storage().ref('animalphotos/' + file.name);
      
      //Upload file
      var task = storageRef.put(file);
      
      //Update progress bar
      task.on('state_changed',
      function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploader.value = percentage;
      },
      
      function error(err) {  
      },
      
      function complete(snapshot) {
        lFfilelocation = task.snapshot.downloadURL;
      });//End of progress bar      
    });//End of event listener
  }//End of file selection

  //Phase 2 implementation - User signin and validation to add to Pet list
  // Capture Add a Pet Click
  $("#submit").on("click", function(event) {
    event.preventDefault();

    lostAndFound = $("#lostFound_input").val();
    lFname = $("#name_input").val().trim().toLowerCase(); 
    lFdate = $("#date").val().trim();   
    lFanimal = $("#animalArray").val();
    lFsize = $("#sizeArray").val();
    lFsex = $("#sexArray").val();
    lFage = $("#ageArray").val();
    lFzip = $("#zipCode").val();
    lFemail = $("#email").val();

    //Phase 2 user authentication sign in to add pet & email verification
    if (lFzip.length===5 && lFname.length >= 1 && lFemail.length >=1 && file != "") {

      $("#myModal").modal({show: true});

      // Code for the push
      database.ref().push({
        lostAndFound: lostAndFound,
        lFname: lFname,
        lFdate: lFdate,
        lFanimal: lFanimal,
        lFsize: lFsize,
        lFsex: lFsex,
        lFage: lFage,
        lFzip: lFzip,
        lFemail: lFemail,
        lFpic: lFfilelocation,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

      // Code to clear input fields
      clearField();
    }//end of if
    
    else {
      $("#badInputModal").modal({show: true});
    }//end of else

  });//end of click

  // Function to update Firebase Admin Panel - Captures unique child key and delete button to update screen and firebase database 
  //Phase 2 implementation - Admin rights - Delete function
  database.ref().on("child_added", function(childSnapshot) {

    var lFkeyChild = childSnapshot.key;//captures unique key value

    // full list of pets
    $("#petList").append("<tr><td><img src='" + childSnapshot.val().lFpic + ">'"  +     
      " </td><td style='text-transform: capitalize'> " + childSnapshot.val().lFname +
      " </td><td> " + childSnapshot.val().lFanimal +
      " </td><td> " + childSnapshot.val().lFsex +
      " </td><td> " + childSnapshot.val().lFsize +
      " </td><td> " + childSnapshot.val().lFage +
      " </td><td> " + childSnapshot.val().lostAndFound +   
      " </td><td> " + childSnapshot.val().lFdate +  
      " </td><td> " + childSnapshot.val().lFzip +
      " </td><td> " + childSnapshot.val().lFemail +
      " </td><td> " + "<button id='" + lFkeyChild + "'class=delete style='background: url(icons/remove.png)'></button>" + " </td></tr>");

      // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
    });
    
  //Phase 2 implementation - Admin rights - Delete function
  //alerts need to be replaced with modals
  $(document).on("click", ".delete", function(event) {
    var childKey = this.id;
    database.ref(childKey).remove();
    $(this).closest("tr").remove();
    $("#deleteModal").modal({show: true});
    
  });


 
});//document ready