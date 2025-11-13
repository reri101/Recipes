class TagsController < ApplicationController
  load_and_authorize_resource
  
    def index
    end
  
    def show
    end
  
    def create
      @tag.save!
      render :show, status: :created
    end
  
    def update
      @tag.update!(tag_params)
      render :show, status: :ok
    end
  
    def destroy
      @tag.destroy!
    end
  
    private
  
    def tag_params
      params.require(:tag).permit(:name)
    end
  end
  