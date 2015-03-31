app.factory('ImageService', function($http){
  var ImageService = {
    getImages: function(){
      return $http.get('http://localhost:3000/images')
    },
    createImage: function(image) {
      return $http.image('http://localhost:3000/images', image)
    }
  };
  return ImageService;
});