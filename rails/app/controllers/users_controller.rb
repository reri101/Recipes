class UsersController < ApplicationController
  load_and_authorize_resource

    def index
    end
  
    def show
    end
  
    def create
      @user.save!
      render :show, status: :created
    end
  
    def update
      @user.update!(user_params)
      render :show, status: :ok
    end

  def destroy
    if @user.id == current_user.id
      render json: { error: "Admin cannot delete themselves" }, status: :unauthorized
    else
      @user.destroy!
    end
  end
  
    private
  
    def user_params
      params.require(:user).permit(:name, :surname, :email, :password, :role, :photo_id)
    end
  end
  