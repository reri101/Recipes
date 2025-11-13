class PhotosController < ApplicationController
  load_and_authorize_resource
  def create
    @photo = Photo.new(photo_params)
    if @photo.save
      render json: { id: @photo.id, message: 'Photo created successfully' }, status: :created
    else
      render json: { error: 'Failed to create photo' }, status: :unprocessable_entity
    end
  end

  private

  def photo_params
    params.require(:photo).permit(:file_data) 
  end
end
