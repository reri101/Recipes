class CategoriesController < ApplicationController
  load_and_authorize_resource

  def index
  end

  def show
  end

  def create
    @category.save!
    render :show, status: :created
  end

  def update
    @category.update!(category_params)
    render :show, status: :ok
  end

  def destroy
    @category.destroy!
  rescue ActiveRecord::RecordNotDestroyed
    render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
  end

  private

  def category_params
    params.require(:category).permit(:name, :photo_id)
  end
end
