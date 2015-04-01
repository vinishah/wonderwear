app.factory('ImageService', function($http){
  var ImageService = {
    getImages: function(){
      return $http.get('/images')
    },
    createImage: function(image) {
      return $http.post('/images', image)
    }
  };
  return ImageService;
});