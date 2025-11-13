class IngredientsController < ApplicationController
  load_and_authorize_resource
  
    def index
    end
  
    def show
    end
  
    def create
       @ingredient.save!
      render :show, status: :created
    end
  
    def update
      @ingredient.update!(ingredient_params)
      render :show, status: :ok
    end
  
    def destroy
      @ingredient.destroy!
    end
  
    private
  
    def ingredient_params
      params.require(:ingredient).permit(:name, :unit, :photo_id)
    end
  end
  