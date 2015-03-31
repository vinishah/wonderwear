class ImagesController < ApplicationController

  def index
    images = Image.all
    render json: images
  end

  # def create
  #   image = Image.create(params.require(:image).permit(:name, :price, :description, :address))
  #   render json: image
  # end

end
