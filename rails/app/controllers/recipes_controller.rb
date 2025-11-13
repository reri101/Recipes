class RecipesController < ApplicationController
  load_and_authorize_resource
  
    def index
    end
  
    def show
    end
  
    def create
      @recipe.save!
      render :show, status: :created
    end
  
    def update
      @recipe.update!(recipe_params)
      render :show, status: :ok
    end
  
    def destroy
      @recipe.destroy!
    end
  
    private

    def recipe_params
      params.require(:recipe).permit(
        :name,
        :description,
        :preparation_time,
        :photo_id,
        :category_id,
        tag_ids: [],
        recipes_ingredients_attributes: [:id, :ingredient_id, :amount, :_destroy]
      )
    end
  end
  