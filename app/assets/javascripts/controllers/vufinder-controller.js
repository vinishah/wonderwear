app.controller('VufinderController', function($scope, $http, $timeout) {

  // $scope.callAtTimeout = function(input) {
  //         console.log("$scope.callAtTimeout - Timeout occurred");
  //     }

  //     $timeout( function(){ $scope.callAtTimeout(); }, 3000);

  $scope.creds = {
    bucket: 'wonderwear',
    access_key: gon.wonderwear_access_key,
    secret_key: gon.wonderwear_secret_key
  }

// colortag API
  $http.defaults.headers.common['X-Mashape-Key'] = gon.mashape_key;
  $http.defaults.headers.common['Accept'] ="application/json";

  $http.defaults.headers.common['X-Mashape-Key'] = gon.mashape_key;
  $http.defaults.headers.common['Accept'] = "plain/text";
  

// get the color and type data of the clothing in the image.
  $scope.getImageData = function(image) {
    $scope.fullUrl = 'https://apicloud-colortag.p.mashape.com/tag-url.json?palette=simple&sort=weight&url='+image;

    //getting the color of the items
    $http.get($scope.fullUrl).success(function(data){
      console.log(data)
      $scope.colors = data.tags
    })

    //getting the type of clothing from the image
    $http.get('https://vufind-vufind-recognize.p.mashape.com/vugraph/v175/recognize.php?app_key='+gon.vufind_key+'&genre=fashion&token=3hbv1ionxeoyl9pzsy49e7bl5yh45i830nxuono4vzq309ii80whj9mu022rwgd3&url='+image+'&user_id=777999') 
    .then(function(data) {
      output = data.data
      newData = JSON.parse(output.slice(output.indexOf('{')))
      $scope.dataArr = newData.Data.VufindTags
      $scope.items = []
      $scope.dataArr.forEach(function(item){$scope.items.push(item.replace("_", " "))})
      console.log($scope.colors)
      $scope.getPrice($scope.colors, $scope.items);
    })

  }

 // image upload
  $scope.upload = function($timeout) {
    // Configure The S3 Object 
    AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
    AWS.config.region = 'us-east-1';
    var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
   
    if($scope.file) {
      var params = { Key: $scope.file.name, ContentType: $scope.file.type, Body: $scope.file, ServerSideEncryption: 'AES256' };
   
      bucket.putObject(params, function(err, data) {
        if(err) {
          // There Was An Error With Your S3 Config
          alert(err.message);
          return false;
        }
        else {
          // Success!
          alert('Upload Done');
        }
      })
      .on('httpUploadProgress',function(progress) {
            // Log Progress Information
            console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
          });
    }
    else {
      // No File Selected
      alert('No File Selected');
    }
      $scope.url = 'https://s3-eu-west-1.amazonaws.com/wonderwear/' + $scope.file.name
    // $scope.getVueData($scope.url)
    $scope.getImageData($scope.url)
    $scope.dataReceived = true;
  }


  // shopsense API
  $scope.getPrice = function(clothingColor, clothingType) {
    console.log(clothingColor[1].label, clothingType[0])

    for(var i=0; i < clothingType.length; i++){
  
    $http.get('http://api.shopstyle.com/api/v2/products?pid='+gon.shopsense_key+'&fts=' + clothingColor[1].label + '+' + clothingColor[2].label + '+' + clothingType[i])
    .then(function(response) {
      console.log(response)
      var data = response.data;
      console.log('hello');
      console.log(data.products);
      $scope.prices = data.products;

      $scope.brandedName = data.products.brandedName;
      $scope.currency = data.products.currency;
      $scope.price = data.products.price;
      $scope.clickUrl = data.products.clickUrl;
      $scope.image = data.products.image;


    $scope.dataReceived = true;

    
    });
    }


  }


});
