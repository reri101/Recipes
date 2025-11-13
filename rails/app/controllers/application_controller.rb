class ApplicationController < ActionController::API
    respond_to :json
    before_action :authenticate_user!
    rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found
  
    rescue_from CanCan::AccessDenied do |exception|
      render json: { error: exception.message }, status: :forbidden
    end

    def record_not_found
      render json: {error: 'not found'}, status: :not_found
    end

end
